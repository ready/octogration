import { readFileSync } from 'fs'
import { createURL, BadgeStyle } from '../badgesUtils'

const config = {
  label: 'Deprecations',
  color: '33ab53',
  secondaryColor: 'cf3b36',
  logo: 'Git LFS',
  logoColor: 'ffffff',
  style: 'for-the-badge' as BadgeStyle
}

/**
 * Counts the number of deprecations and then creates the badge for it
 * @returns the url encoding of the deprecations badge
 */
export function prepareDeprecationsBadge (): string {
  const numDeprecations = countDeprecations()

  const color = numDeprecations === 0 ? config.color : config.secondaryColor
  const message = numDeprecations.toFixed(0)
  return createURL({ ...config, message, color })
}

/**
 * Reads the NPM install log to find the number of deprecated packages
 * @returns how many deprecated packages were installed
 */
function countDeprecations (): number {
  const installLog = readFileSync('./.github/data/install_log.txt').toString()
  const lines = installLog.split('\n')

  const deprecationWarning = 'npm WARN deprecated'
  const deprecations = lines.filter(w => w.includes(deprecationWarning))

  return deprecations.length
}
