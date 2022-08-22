import { Octokit } from '@octokit/action'
import { getRepo } from '../../changelog/getGithubAvatar'
import { createURL, BadgeStyle } from '../badgesUtils'

const octokit = new Octokit()

const config = {
  label: 'Neglected PRs',
  color: '33ab53',
  secondaryColor: 'cf3b36',
  logo: 'Git Extensions',
  logoColor: 'ffffff',
  style: 'for-the-badge' as BadgeStyle
}

/**
 * Finds the number of stale branches and makes a badge for it
 * @returns the url encoding of the stale branches badge
 */
export async function prepareStaleBranchesBadge (): Promise<string> {
  const numNeglectedPrs = await countNeglectedPrs()

  const color = numNeglectedPrs === 0 ? config.color : config.secondaryColor
  const message = numNeglectedPrs.toFixed(0)
  return createURL({ ...config, message, color })
}

/**
 * Calls the github API to find the number of neglected PRs
 * @returns the number of open PRs without a review for 4 or more days
 */
async function countNeglectedPrs (): Promise<number> {
  try {
    const prIds = await getOldPrNumbers()
    const prReviewStatuses = await Promise.all(prIds.map(async pr => await hasPrBeenReviewed(pr)))
    const notReviewed = prReviewStatuses.filter(status => !status)
    return notReviewed.length
  } catch (e) {
    // If there is an error, we want to fail gracefully
    console.error(e)
    return 0
  }
}

/**
 * Calls the github API to find the open PR data
 * @returns a list of PR numbers older than 4 days
 */
async function getOldPrNumbers (): Promise<string[]> {
  const NEGLECTED_AGE = 4

  const repo = getRepo()
  const search = 'per_page=100&state=open&sort=created&direction=asc'
  const prs = await octokit.request(`GET /repos/${repo}/pulls?${search}`)

  const oldPrs = prs.data.filter((pr: any) => {
    const submittedDate = new Date(pr.submitted_at)
    const age = (new Date()).getTime() - submittedDate.getTime()
    const daysOld = age / (1000 * 3600 * 24)
    return daysOld > NEGLECTED_AGE
  })
  return oldPrs.map((pr: any) => pr.id)
}

/**
 * Calls the github API to determine if a PR has been reviewed or not
 * @param prNumber - the PR number to check
 * @returns true if the PR number has been reviewed
 */
async function hasPrBeenReviewed (prNumber: string): Promise<boolean> {
  const repo = getRepo()
  const search = 'per_page=1'
  const prs = await octokit.request(`GET /repos/${repo}/pulls/${prNumber}/reviews?${search}`)
  return prs.data.length !== 0
}
