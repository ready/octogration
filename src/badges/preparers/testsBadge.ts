import { spawnSync } from 'child_process'
import { getPackageJson } from '../../utils/packageJson'
import { createURL } from '../badgesUtils'

/**
 * Runs the unit tests to find out how many passed
 * and then creates the tests badge
 * @returns the url encoding of the tests badge
 */
export function prepareTestsBadge (): string {
  const config = getPackageJson().config.badgeConfigs.tests
  const summary = retrieveTestsSummary()
  const color = summary.numPassedTests === summary.numTotalTests ? config.primaryColor : config.secondaryColor
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
  const process = spawnSync('npm', ['run', 'testSummary'])
  const output = process.stderr.toString()
  let summary = {
    numPassedTests: 0,
    numTotalTests: 0
  }

  output.split('\n').forEach(line => {
    const parsedSummary = parseTestLine(line)
    if (parsedSummary !== undefined) summary = parsedSummary
  })

  return summary
}

/**
 * Attempts to parse a line of the output, expecting the Jest summary format
 * @param line - a line of the child process output
 * @returns the parsed summary or undefined
 */
function parseTestLine (line: string): TestsSummary | undefined {
  const fields = line.split(' ').filter(f => f !== '')
  if (fields[0] !== 'Tests:') return undefined

  const passedIndex = fields.findIndex(f => f === 'passed,')
  if (passedIndex === -1) return undefined

  const totalIndex = fields.findIndex(f => f === 'total')
  if (totalIndex === -1) return undefined

  const numPassedTests = parseInt(fields[passedIndex - 1])
  if (isNaN(numPassedTests)) return undefined
  const numTotalTests = parseInt(fields[totalIndex - 1])
  if (isNaN(numTotalTests)) return undefined

  return {
    numPassedTests,
    numTotalTests
  }
}
