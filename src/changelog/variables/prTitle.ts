import { OctokitWrapper } from '../../API/octokitWrapper'
import { getRepo } from '../utils/getGithubInfo'

const octokit = new OctokitWrapper()

/**
 * @returns the title of the PR linked to this changelog
 */
export async function evaluatePrTitle (): Promise<string> {
  try {
    const number = process.argv[3]
    const title = await retrieveGithubPrTitle(number)
    return `\n# ${title}`
  } catch {
    return ''
  }
}

/**
 * Gets the pull request title for a given id
 * @param number - the id of the PR to lookup
 * @returns the title of the PR in markdown
 */
async function retrieveGithubPrTitle (number: string): Promise<string> {
  const request = `GET /repos/${getRepo()}/pulls/${number}`
  const pullInfo = await octokit.request(request)
  return pullInfo.data.title
}
