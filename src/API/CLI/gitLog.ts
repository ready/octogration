import { execSync } from 'child_process'
import { getPackageJson } from '../../utils/packageJson'
import { cleanVersionNumber, decrementMinor, decrementPatch } from '../../utils/version'

/**
 * Queries the git log to retrieve the commits since the last version
 * Formatted as <hash> <email> <message>
 * If the last version could not be found, returns all commits
 * @returns an array of raw commit lines from git
 */
export function retrieveRawCommits (): string[] {
  try {
    const oldVersion = getOldVersion()
    const hash = retrieveCommitHash(`v${oldVersion}`)
    return retrieveCommitsSinceHash(hash)
  } catch (e) {
    console.error(e)
    return retrieveCommitsSinceHash(undefined)
  }
}

/**
 * Determines which version number it should go back to fetch commits from
 * If this is a prod deploy, it returns the last minor update
 * If this is a dev deploy, it returns the last patch update
 * @returns a version number
 */
function getOldVersion (): string {
  const version = cleanVersionNumber(getPackageJson().version)
  const vFields = version.split('.')
  const isProd = vFields[vFields.length - 1] === '0'

  return isProd ? decrementMinor(version) : decrementPatch(version)
}

/**
 * Queries git to find the most recent commit hash with a given commit message
 * Throws an error if the result is not a hash
 * @param commitMessage - the commit message to search for
 * @returns the hash for the commit with this message
 */
function retrieveCommitHash (commitMessage: string): string {
  const cmd = `git log --pretty=format:"%H" --grep="^${commitMessage}$"`
  const output = execSync(cmd).toString()
  const hash = output.split('\n')[0]

  if (hash === '') {
    throw new Error(`Git commit with message "${commitMessage}" does not exist`)
  }

  if (hash.length !== 40) {
    const m = `Git commit with message "${commitMessage}" yielded hash "${hash}" which is not 40 characters`
    throw new Error(m)
  }

  if (!/^[a-fA-F0-9]+$/.test(hash)) {
    const m = `Git commit with message "${commitMessage}" yielded hash "${hash}" which is not hex`
    throw new Error(m)
  }

  return hash
}

/**
 * Queries git to find all commits from a given hash up until now
 * @param hash - the long hash relating to a commit. If undefined, return all commits
 * @returns an array of raw commit lines from git
 */
function retrieveCommitsSinceHash (hash: string | undefined): string[] {
  const search = hash === undefined ? '' : `${hash}..HEAD`
  const cmd = `git log ${search} --pretty=format:"%H %ae %s"`

  const output = execSync(cmd).toString()
  return output.split('\n').filter(c => c.trim() !== '')
}

export const testGitLog = {
  retrieveCommitHash,
  retrieveCommitsSinceHash
}
