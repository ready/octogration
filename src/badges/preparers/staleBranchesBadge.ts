import { OctokitWrapper } from '../../API/octokitWrapper'
import { getRepo } from '../../changelog/getGithubAvatar'
import { createURL, BadgeStyle } from '../badgesUtils'

const octokit = new OctokitWrapper()

const config = {
  label: 'Stale Branches',
  color: '33ab53',
  secondaryColor: 'cf3b36',
  logo: 'Git',
  logoColor: 'ffffff',
  style: 'for-the-badge' as BadgeStyle
}

/**
 * Finds the number of stale branches and makes a badge for it
 * @returns the url encoding of the stale branches badge
 */
export async function prepareStaleBranchesBadge (): Promise<string> {
  const numStaleBranches = await countStaleBranches()

  const color = numStaleBranches === 0 ? config.color : config.secondaryColor
  const message = numStaleBranches.toFixed(0)
  return createURL({ ...config, message, color })
}

/**
 * Queries the github API for information about the branches on Github
 * @returns the number of stale branches
 */
async function countStaleBranches (): Promise<number> {
  const STALE_AGE = 120

  const branches = await getBranchNames()
  const ages = await Promise.all(branches.map(async b => await getBranchAge(b)))
  const staleAges = ages.filter(a => a > STALE_AGE)

  return staleAges.length
}

/**
 * @param branchName - the name of a branch
 * @returns the number of days since the last commit on the branch
 */
async function getBranchAge (branchName: string): Promise<number> {
  const repo = getRepo()
  const endpoint = `GET /repos/${repo}/branches/${branchName}`
  const branch = await octokit.request(endpoint)

  const lastCommit = new Date(branch.data.commit.commit.date)
  const age = (new Date()).getTime() - lastCommit.getTime()
  return age / (1000 * 3600 * 24)
}

/**
 * @returns a list of branch names for the current repository
 */
async function getBranchNames (): Promise<string[]> {
  const repo = getRepo()
  const endpoint = `GET /repos/${repo}/branches?protected=false&per_page=100`
  const branches = await octokit.request(endpoint)
  return branches.data.map((b: any) => b.name)
}
