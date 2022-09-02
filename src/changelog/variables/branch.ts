import { OctokitWrapper } from '../../API/octokitWrapper'
import { getGitRemoteURL } from '../../utils/gitRemoteOrigin'
import { getRepo } from '../utils/getGithubInfo'

const octokit = new OctokitWrapper()

/**
 * Fetches the branch name and PR number from the CLI arguments
 * @return a markdown formatted version of the branch
 */
export async function evaluateBranch (): Promise<string> {
  const number = process.argv[3]

  const { headRef, baseRef } = await getBranchNames(number)
  const mainURL = getGitRemoteURL()
  const prURL = getPrURL(number)

  const gv = '`'
  return `[${baseRef}](${mainURL}) &larr; [${gv}#${number}${gv} ${headRef}](${prURL})`
}

/**
 * Gets the names of the branches involved in a PR
 * @param id - the id of the PR to lookup
 * @returns the name of the head and base branches
 */
async function getBranchNames (id: string): Promise<{ headRef: string, baseRef: string }> {
  const request = `GET /repos/${getRepo()}/pulls/${id}`
  const pullInfo = await octokit.request(request)
  return {
    headRef: pullInfo.data?.head.ref,
    baseRef: pullInfo.data?.base.ref
  }
}

/**
 * @param number - the number of the github PR
 * @returns the formatted PR url
 */
function getPrURL (number: string): string {
  const remoteURL = getGitRemoteURL()
  return `${remoteURL}/pull/${number}`
}
