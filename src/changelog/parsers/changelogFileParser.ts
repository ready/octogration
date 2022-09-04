import { readFileSync, writeFileSync } from 'fs'
import { getPackageJson } from '../../utils/packageJson'

interface ChangelogPost {
  title: string
  body: string
  version: string
  env: string
  timestamp: string
}

/**
 * Appends a post to the changelog written to file
 * @param post - the post to add to the file
 */
export function appendToChangelogFile (post: ChangelogPost): void {
  const posts = readChangelogFile()
  const newPosts = [post, ...posts]
  writeChangelogFile(newPosts)
}

/**
 * @returns an array of changelog posts read from the file
 */
function readChangelogFile (): ChangelogPost[] {
  const CHANGELOG_FILE = getPackageJson().config.changelogFileName
  try {
    const file = readFileSync(CHANGELOG_FILE)
    const posts = JSON.parse(file.toString())
    if (!(posts instanceof Array)) return []
    return posts
  } catch {
    return []
  }
}

/**
 * Writes an array of posts to file
 * @param posts - the array of posts to write
 */
function writeChangelogFile (posts: ChangelogPost[]): void {
  const CHANGELOG_FILE = getPackageJson().config.changelogFileName
  const file = JSON.stringify(posts)
  writeFileSync(CHANGELOG_FILE, file, { flag: 'w' })
}
