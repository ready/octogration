import { readFileSync } from 'fs'

export interface Commit {
  hash: string
  email: string
  type: string
  scope?: string
  subject: string
}

// The cached commits so the parser only runs once
const commitsByType = new Map<string, Commit[]>()

// A flag to determine if the file has already been read and parsed
let readFile = false

/**
 * Consults the commit log and grabs all of the commits of a certain type
 * Caches the commit log file for future calls to this function
 * @param type - the commit type to filter through
 * @returns all commits corresponding to the given type
 */
export function getCommitsByType (type: string): Commit[] {
  if (!readFile) {
    parseCommits()
  }
  return commitsByType.get(type) ?? []
}

/**
 * Reads in the commits from file and determines their type
 * Sorts the commits into the `commitsByType` map
 */
function parseCommits (): void {
  const commits = readCommitsFromFile()
  commits.forEach(commitLine => {
    try {
      const commit = parseCommit(commitLine)
      const previousCommits = commitsByType.get(commit.type)

      if (previousCommits === undefined) {
        commitsByType.set(commit.type, [commit])
      } else {
        commitsByType.set(commit.type, [...previousCommits, commit])
      }
    } catch (e) {
      // If the error thrown isn't the expected failed parser,
      // then throw it up the stack
      if (!(e instanceof Error) || e.message !== 'invalid commit format') {
        throw e
      }
    }
  })
}

/**
 * Parses a commit line from the git log into the useful components
 * @param commit - a line in the format <hash> <email> <type>(<scope?>): <subject>
 * @returns a commit object
 */
export function parseCommit (commit: string): Commit {
  const endHashLocation = commit.indexOf(' ')
  if (endHashLocation === -1) throw new Error('invalid commit format')

  const hash = commit.substring(0, endHashLocation)
  const emailAndMessage = commit.substring(endHashLocation + 1)
  const endEmailLocation = emailAndMessage.indexOf(' ')
  if (endHashLocation === -1) throw new Error('invalid commit format')

  const email = emailAndMessage.substring(0, endEmailLocation)
  const message = emailAndMessage.substring(endEmailLocation + 1)
  const endTypeAndScopeLocation = message.indexOf(':')
  if (endTypeAndScopeLocation === -1) throw new Error('invalid commit format')

  // If there is no ( character, then the scope isn't included
  const subject = message.substring(endTypeAndScopeLocation + 1).trim()
  const typeAndScope = message.substring(0, endTypeAndScopeLocation)
  const endTypeLocation = typeAndScope.indexOf('(')
  if (endTypeLocation === -1) {
    return {
      hash,
      email,
      type: typeAndScope,
      subject
    }
  }

  const endScopeLocation = typeAndScope.lastIndexOf(')')
  if (endScopeLocation === -1) throw new Error('invalid commit format')

  const type = typeAndScope.substring(0, endTypeLocation)
  const scope = typeAndScope.substring(endTypeLocation + 1, endScopeLocation)
  return {
    hash,
    email,
    type,
    scope,
    subject
  }
}

/**
 * @returns an array of commit messages read from the commits file
 */
function readCommitsFromFile (): string[] {
  const file = readFileSync('./.github/data/commits.txt').toString()
  readFile = true
  return file.split('\n')
}
