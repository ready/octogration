import { readFileSync, writeFileSync } from 'fs'

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

const CHANGELOG_FILE = 'automatic_changelog.json'

/**
 * @returns an array of changelog posts read from the file
 */
function readChangelogFile (): ChangelogPost[] {
  try {
    const file = readFileSync('')
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
  const file = JSON.stringify(posts)
  writeFileSync(CHANGELOG_FILE, file, { flag: 'wx' })
}
