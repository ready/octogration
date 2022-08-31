import { readFileSync } from 'fs'
import { createURL, BadgeStyle } from '../badgesUtils'
import { interpolateProgessColor } from '../../utils/interpolateColor'

const config = {
  label: 'Coverage',
  logo: 'Buffer',
  logoColor: 'ffffff',
  style: 'for-the-badge' as BadgeStyle
}

/**
 * Reads the coverage summary file from most recent run and creates the badge
 * @returns the url encoding of the coverage badge
 */
export function prepareCoverageBadge (): string {
  const summary = retrieveCoverageSummary()
  const coverage = getMinCoverage(summary)

  const percent = coverage / 100
  const bufferedPercent = percent * 1.2 - 0.1
  const boundedPercent = Math.min(Math.max(bufferedPercent, 0), 1)
  const color = interpolateProgessColor(boundedPercent)

  const message = formatPercent(coverage)
  return createURL({ ...config, message, color })
}

interface CoverageSummary {
  total: {
    statements: {
      pct: number
    }
    lines: {
      pct: number
    }
    functions: {
      pct: number
    }
    branches: {
      pct: number
    }
  }
}

/**
 * Reads the coverage summary file from the latest coverage run
 * @returns statistics about the tests coverage
 */
function retrieveCoverageSummary (): CoverageSummary {
  try {
    const file = readFileSync('./coverage/coverage-summary.json')
    return JSON.parse(file.toString()) as CoverageSummary
  } catch (e) {
    console.error(e)
    return {
      total: {
        statements: {
          pct: 0
        },
        lines: {
          pct: 0
        },
        functions: {
          pct: 0
        },
        branches: {
          pct: 0
        }
      }
    }
  }
}

/**
 * Finds the minimum amount covered by all of the statistics
 * @param summary - The coverage report from Jest
 * @returns the smallest coverage stat
 */
function getMinCoverage (summary: CoverageSummary): number {
  const total = summary.total
  const coverages = [total.branches.pct, total.functions.pct, total.lines.pct, total.statements.pct]
  return Math.min(...coverages)
}

/**
 * Formats a string as a percent with two decimal places
 * If the number is rounded to an integer, the trailing zeros aren't shown
 * @param num - the number to format
 * @returns a string like 84.32% or 99%
 */
function formatPercent (num: number): string {
  const fixed = num.toFixed(2)
  const fields = fixed.split('.')
  if (fields[1] === '00') {
    return `${fields[0]}%`
  }

  return `${fields[0]}.${fields[1]}%`
}
