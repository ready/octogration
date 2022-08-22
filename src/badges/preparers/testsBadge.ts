import { spawnSync } from 'child_process'
import { createURL, BadgeStyle } from '../badgesUtils'

const config = {
  label: 'Tests',
  color: '33ab53',
  secondaryColor: 'cf3b36',
  logo: 'TestCafe',
  logoColor: 'ffffff',
  style: 'for-the-badge' as BadgeStyle
}

/**
 * Runs the unit tests to find out how many passed
 * and then creates the tests badge
 * @returns the url encoding of the tests badge
 */
export function prepareTestsBadge (): string {
  const summary = retrieveTestsSummary()
  const color = summary.numPassedTests === summary.numTotalTests ? config.color : config.secondaryColor
  const message = summary.numPassedTests.toFixed(0)
  return createURL({ ...config, message, color })
}

interface TestsSummary {
  numPassedTests: number
  numTotalTests: number
}

/**
 * Spawns a child process to run the jest summary configuration
 * @returns the number of tests passed and the total number of tests
 */
function retrieveTestsSummary (): TestsSummary {
  try {
    const process = spawnSync('npm run testSummary')
    return JSON.parse(process.stdout.toString()) as TestsSummary
  } catch (e) {
    console.error(e)
    return {
      numPassedTests: 0,
      numTotalTests: 0
    }
  }
}
