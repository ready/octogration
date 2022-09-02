import { OctokitWrapper } from '../../API/octokitWrapper'
import { getRepo } from '../utils/getGithubInfo'

const octokit = new OctokitWrapper()

/**
 * @returns the body of the PR linked to this changelog
 */
export async function evaluatePrBody (): Promise<string> {
  try {
    const number = process.argv[3]
    return await retrieveGithubPrBody(number)
  } catch {
    return ''
  }
}

/**
 * Gets the pull request body for a given id
 * @param number - the id of the PR to lookup
 * @returns the body of the PR in markdown
 */
async function retrieveGithubPrBody (number: string): Promise<string> {
  const request = `GET /repos/${getRepo()}/pulls/${number}`
  const pullInfo = await octokit.request(request)
  return pullInfo.data.body
}
