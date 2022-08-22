import { spawnSync } from 'child_process'
import { createURL, BadgeConfig, cleanVersionNumber } from '../badgesUtils'

const config: BadgeConfig = {
  label: 'NPM Version',
  color: '5c80f7',
  style: 'for-the-badge',
  logo: 'npm'
}

/**
 * Determines the current version of NPM and creates the badge for it
 * @returns the url encoding of the NPM version badge
 */
export function prepareNPMVersionBadge (): string {
  const nodeVersion = retrieveNPMVersion()
  const version = cleanVersionNumber(nodeVersion)
  return createURL({ ...config, message: version })
}

/**
 * Spawns a child process to determine the current version of NPM
 * @returns the current version of NPM
 */
function retrieveNPMVersion (): string {
  const process = spawnSync('npm', ['--version'])
  return process.stdout.toString()
}
