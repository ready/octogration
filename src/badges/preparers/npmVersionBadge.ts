import { spawnSync } from 'child_process'
import { createURL } from '../badgesUtils'
import { cleanVersionNumber } from '../../utils/version'
import { getPackageJson } from '../../utils/packageJson'

/**
 * Determines the current version of NPM and creates the badge for it
 * @returns the url encoding of the NPM version badge
 */
export function prepareNPMVersionBadge (): string {
  const config = getPackageJson().config.badgeConfigs.npmVersion
  const nodeVersion = retrieveNPMVersion()
  const version = cleanVersionNumber(nodeVersion)
  return createURL({ ...config, message: version, color: config.primaryColor })
}

/**
 * Spawns a child process to determine the current version of NPM
 * @returns the current version of NPM
 */
function retrieveNPMVersion (): string {
  const process = spawnSync('npm', ['--version'])
  return process.stdout.toString()
}
