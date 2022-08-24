import { execSync } from 'child_process'
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
  const process = execSync('npm run testSummary')
  const outputLines = process.toString().split('\n')

  // The output may contain more than just the JSON that we need
  // Check every line to see which one has the JSON summary
  for (let i = 0; i < outputLines.length; i++) {
    try {
      const json = JSON.parse(outputLines[i])
      if ('numPassedTests' in json && 'numTotalTests' in json) {
        if (typeof json.numPassedTests === 'number' && typeof json.numTotalTests === 'number') {
          return json
        }
      }
    } catch (e) {
      if (e instanceof Error) {
        const erroredFunction = e.stack?.split('\n')[1]
        if (erroredFunction?.includes('at JSON.parse') === true) {
          continue
        }
      }

      // If the error is not a JSON parsing error, throw it up the stack
      throw e
    }
  }

  throw new Error(`Tests summary did not contain valid JSON: ${process.toString()}`)
}
