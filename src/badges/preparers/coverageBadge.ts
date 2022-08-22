import { readFileSync } from 'fs'
import { createURL, BadgeStyle } from '../badgesUtils'
import { interpolateProgessColor } from '../interpolateColor'

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

  const percent = summary.total.statements.pct / 100
  const bufferedPercent = percent * 1.2 - 0.1
  const boundedPercent = Math.min(Math.max(bufferedPercent, 0), 1)
  const color = interpolateProgessColor(boundedPercent)

  const message = summary.total.statements.pct.toFixed(2) + '%'
  return createURL({ ...config, message, color })
}

interface CoverageSummary {
  total: {
    statements: {
      total: number
      covered: number
      skipped: number
      pct: number
    }
  }
}

/**
 * Reads the coverage summary file from the latest coverage run
 * @returns statistics about the tests coverage
 */
function retrieveCoverageSummary (): CoverageSummary {
  const file = readFileSync('./coverage/coverage-summary.json')
  return JSON.parse(file.toString()) as CoverageSummary
}
