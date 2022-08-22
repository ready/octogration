import { getGitRemoteURL } from '../../gitRemoteOrigin'

/**
 * Fetches the branch name and PR number from the CLI arguments
 * @return a markdown formatted version of the branch
 */
export function evaluateBranch (): string {
  const number = process.argv[2]
  const name = process.argv[3]

  const mainURL = getGitRemoteURL()
  const prURL = getPrURL(number)

  return `#${number}   [main](${mainURL}) &larr; [${name}](${prURL})`
}

/**
 * @param number - the number of the github PR
 * @returns the formatted PR url
 */
function getPrURL (number: string): string {
  const remoteURL = getGitRemoteURL()
  return `${remoteURL}/pull/${number}`
}
