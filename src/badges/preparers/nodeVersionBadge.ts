import { spawnSync } from 'child_process'
import { createURL } from '../badgesUtils'
import { cleanVersionNumber } from '../../utils/version'
import { getPackageJson } from '../../utils/packageJson'

/**
 * Determines the current version of node and creates the badge for it
 * @returns the url encoding of the node version badge
 */
export function prepareNodeVersionBadge (): string {
  const config = getPackageJson().config.badgeConfigs.nodeVersion
  const nodeVersion = retrieveNodeVersion()
  const version = cleanVersionNumber(nodeVersion)
  return createURL({ ...config, message: version, color: config.primaryColor })
}

/**
 * Spawns a child process to determine the current version of node
 * @returns the current version of node
 */
function retrieveNodeVersion (): string {
  const process = spawnSync('node', ['--version'])
  return process.stdout.toString()
}
