import { readFileSync } from 'fs'
import { getPackageJson } from '../../utils/packageJson'
import { createURL } from '../badgesUtils'

/**
 * Counts the number of deprecations and then creates the badge for it
 * @returns the url encoding of the deprecations badge
 */
export function prepareDeprecationsBadge (): string {
  const config = getPackageJson().config.badgeConfigs.deprecations
  const numDeprecations = countDeprecations()

  const color = numDeprecations === 0 ? config.primaryColor : config.secondaryColor
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
