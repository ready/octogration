import { execSync } from 'child_process'

// Spawning a child process is expensive, so we cache the results for future calls
let gitUrl = undefined as string | undefined

/**
 * @returns the remote origin url for the github project
 */
export function getGitRemoteURL (): string {
  if (gitUrl === undefined) {
    gitUrl = retrieveGitRemoteURL()
  }
  return gitUrl
}

/**
 * Spawns a child process to determine the remote git URL and formats it like:
 * https://github.com/ready/subscriber-portal
 * @returns the remote origin url for the github project
 */
function retrieveGitRemoteURL (): string {
  const output = execSync('git remote -v').toString()
  const lines = output.split('\n')
  if (lines.length === 0) throw new Error('git remote command failed')

  const originSection = lines[0].split('\t')
  if (originSection.length !== 2) throw new Error('git origin fields malformatted')

  const fetchSection = originSection[1].split(' ')
  if (fetchSection.length !== 2) throw new Error('git fetch fields malformatted')

  const gitAddress = fetchSection[0]
  const urlPrefix = 'https://github.com/'
  if (gitAddress.startsWith(urlPrefix)) return gitAddress

  return parseGitAddress(gitAddress)
}

/**
 * Parses a git address in the form of:
 * git@github.com:ready/subscriber-portal.git
 * And turns it into a remote URL like:
 * https://github.com/ready/subscriber-portal
 * @param gitAddress - the git address to parse
 * @returns the remote URL
 */
function parseGitAddress (gitAddress: string): string {
  const prefix = 'git@'
  const suffix = '.git'
  const gitURL = gitAddress.slice(prefix.length, gitAddress.length - suffix.length)
  const remoteURL = gitURL.replace(':', '/')
  return `https://${remoteURL}`
}
