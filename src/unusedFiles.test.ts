/**
 * All of the tests that run as github actions when a branch merges into main are here
 */

import * as madge from 'madge'
import * as path from 'path'
import { readdirSync, readFileSync } from 'fs'

// No unused files: There cannot exist a file that isn't used in the project
test.each(getProjectFiles())('File %s is not used within the project', file => {
  expect(isFileUsed(file)).toBe(true)
})

// No unused packages: There cannot exist a Node package that isn't used in the project
test.each(getNodePackages())('Node Package %s is not used within the project', npmPackage => {
  expect(isNpmPackageUsed(npmPackage)).toBe(true)
})

// No empty folders: There cannot exist a folder that is empty
test.each(getFolders('src'))('Folder %s is empty', folder => {
  expect(isFolderEmpty(folder)).toBe(false)
})

// Asynchronously create the dependency graph of all the imports
// Jest will wait for this promise to resolve before running the tests
let dependencyTree: madge.MadgeModuleDependencyGraph
let npmDependencies: string[]
beforeAll(async () => {
  const config = {
    includeNpm: true,
    tsConfig: 'tsconfig.json'
  }

  const resolveDepTree = await madge('src/index.ts', config)
  dependencyTree = resolveDepTree.obj()
  npmDependencies = filterNpmDependencies(dependencyTree)
})

/**
 * Filters out non npm modules and returns just the used node dependencies
 * @param tree - Madge Dependency tree
 * @returns an array of node module library locations 'react/index.js'
 */
function filterNpmDependencies (tree: madge.MadgeModuleDependencyGraph): string[] {
  const npmPrefix = '../node_modules/'
  const typesPrefix = '@types/'
  const npmDeps: string[] = []

  for (const kvPair of Object.entries(tree)) {
    for (const dep of kvPair[1]) {
      const depIsNode: boolean = dep.startsWith(npmPrefix)
      if (depIsNode) {
        const depName = dep.substring(npmPrefix.length)
        npmDeps.push(depName)
        const depIsType: boolean = depName.startsWith(typesPrefix)
        if (depIsType) {
          npmDeps.push(depName.substring(typesPrefix.length))
        }
      }
    }
  }

  return [...new Set(npmDeps)]
}

/**
 * Checks if a file is used in the project
 * @param file - a filepath under the directory src/<file>
 */
function isFileUsed (file: string): boolean {
  return file in dependencyTree
}

/**
 * Checks if a Node Package is used in the project
 * @param npmPackage - The name of a Node Package
 */
function isNpmPackageUsed (npmPackage: string): boolean {
  return npmDependencies.some(dep => dep.startsWith(npmPackage + '/'))
}

/**
 * Checks if a folder is empty
 * @param folder - The folder to check
 */
function isFolderEmpty (folder: string): boolean {
  const dirents = readdirSync(folder)
  return dirents.length === 0
}

/**
 * Recursively traverses project to find all development files
 * @returns A promise that resolves to a list of all files src/<file>
 */
function getProjectFiles (): string[] {
  const devExts = ['.ts', '.tsx', '.css']
  const ignoredExts = ['.d.ts', '.test.ts', '.test.tsx']
  // Removes any file that doesn't end with a development file extension
  // or does end with one of the ignored extensions
  const filefilter = (file: string): boolean => {
    return devExts.some(ext => file.endsWith(ext)) &&
      !ignoredExts.some(ext => file.endsWith(ext))
  }

  const cwd = path.join(process.cwd(), 'src')
  const localize = (file: string): string => file.replace(cwd, '').substring(1)

  return getFiles('src').filter(filefilter).map(localize)
}

/**
 * Recursively traverses project to find all files
 * @param dir - The root directory of the project
 * @returns All files in the directory
 */
function getFiles (dir: string): string[] {
  const ignoredDirs = [path.join('src', 'test')]
  // If the directory is in the ignored Dirs list, then don't check the contents
  if (ignoredDirs.some(ignoredDir => dir.endsWith(ignoredDir))) {
    return []
  }

  // Unfortunately we can't use the async version of readdir
  // Because Jest requires the tests to be created synchronously
  const dirents = readdirSync(dir, { withFileTypes: true })
  const files = dirents.map(dirent => {
    const res = path.resolve(dir, dirent.name)
    return dirent.isDirectory() ? getFiles(res) : res
  })
  return Array.prototype.concat(...files)
}

/**
 * Reads the package.json file in root directory
 * @returns An array of packages in the dependencies object
 */
function getNodePackages (): string[] {
  const packageConfig = JSON.parse(readFileSync('package.json', 'utf-8'))
  return Object.keys(packageConfig.dependencies)
}

/**
 * Recursively traverses project to find all folders
 * @param dir - The root directory to search
 * @returns All folders in the directory
 */
function getFolders (dir: string): string[] {
  const dirents = readdirSync(dir, { withFileTypes: true })
  const folders = dirents.map(dirent => {
    const res = path.resolve(dir, dirent.name)
    return dirent.isDirectory() ? getFolders(res) : []
  })

  const arr = Array.prototype.concat(...folders)
  arr.push(dir)
  return arr
}
