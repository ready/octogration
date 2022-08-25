import { readFileSync } from 'fs'

interface PackageJson {
  version: string
  scripts: {
    testSummary: string
  }
  dependencies: {
    [key: string]: string
  }
  devDependencies: {
    [key: string]: string
  }
}

let packageJson = undefined as undefined | PackageJson

/**
 * Reads the package.json file and returns the JSON object
 * Caches the data for future calls
 * @returns the package information
 */
export function getPackageJson (): PackageJson {
  if (packageJson === undefined) {
    return readPackageJson()
  }

  return packageJson
}

/**
 * Reads the package.json file and stores it in a cached variable
 * @returns the cached variable
 */
function readPackageJson (): PackageJson {
  packageJson = JSON.parse(readFileSync('package.json').toString())
  return packageJson as PackageJson
}
