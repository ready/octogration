import { existsSync, readFileSync } from 'fs'
import { exit } from 'process'

/**
 * If the coverage report from Jest is below the defined threshold,
 * it outputs to stderr and exits with code 1.
 * @param coverageThreshold - the percentage to set as the threshold for failing
 */
export const ensureCoverage = (coverageThreshold?: string): void => {
  const uncheckedThreshold = parseInt(coverageThreshold ?? '100')
  const threshold = isNaN(uncheckedThreshold) ? 100 : uncheckedThreshold

  if (existsSync('coverage/coverage-summary.json')) {
    const coverageReport = JSON.parse(readFileSync('coverage/coverage-summary.json').toString())
    const lines = coverageReport?.total?.lines?.pct
    const statements = coverageReport?.total?.statements?.pct
    const functions = coverageReport?.total?.functions?.pct
    const branches = coverageReport?.total?.branches?.pct

    let status = 0

    if (typeof lines !== 'number') {
      console.error('The lines percentage of the coverage report was malformed')
    } else if (lines < threshold) {
      console.error(`The lines coverage is only at ${lines}%, expected to be at least ${threshold}%`)
      status = 1
    }

    if (typeof statements !== 'number') {
      console.error('The statements percentage of the coverage report was malformed')
    } else if (statements < threshold) {
      console.error(`The statements coverage is only at ${statements}%, expected to be at least ${threshold}%`)
      status = 1
    }

    if (typeof functions !== 'number') {
      console.error('The functions percentage of the coverage report was malformed')
    } else if (functions < threshold) {
      console.error(`The functions coverage is only at ${functions}%, expected to be at least ${threshold}%`)
      status = 1
    }

    if (typeof branches !== 'number') {
      console.error('The branches percentage of the coverage report was malformed')
    } else if (branches < threshold) {
      console.error(`The branches coverage is only at ${branches}%, expected to be at least ${threshold}%`)
      status = 1
    }

    exit(status)
  } else {
    console.error('Unable to locate coverage report')
  }
}
ensureCoverage()
