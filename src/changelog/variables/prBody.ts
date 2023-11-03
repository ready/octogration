import { OctokitWrapper } from '../../API/octokitWrapper'
import { getPackageJson } from '../../utils/packageJson'
import { evaluateEnvDeploy } from '../utils/changelogTitle'
import { getRepo } from '../utils/getGithubInfo'

const octokit = new OctokitWrapper()

/**
 * @returns the body of the PR linked to this changelog
 */
export async function evaluatePrBody (): Promise<string> {
  const env = evaluateEnvDeploy()
  const includePrBodyDev = getPackageJson().config.includePrBodyDev
  const includePrBodyProd = getPackageJson().config.includePrBodyProd

  if (env === 'Production' && !includePrBodyProd) return ''
  if (env === 'Dev' && !includePrBodyDev) return ''

  try {
    const number = process.argv[3]
    const body = await retrieveGithubPrBody(number)
    if (body === undefined || body === null) return ''
    return body
  } catch {
    return ''
  }
}

/**
 * Gets the pull request body for a given id
 * @param number - the id of the PR to lookup
 * @returns the body of the PR in markdown
 */
async function retrieveGithubPrBody (number: string): Promise<string | undefined> {
  const request = `GET /repos/${getRepo()}/pulls/${number}`
  const pullInfo = await octokit.request(request)
  return pullInfo.data.body
}
