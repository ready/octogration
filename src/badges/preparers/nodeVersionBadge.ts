import { spawnSync } from 'child_process'
import { createURL, BadgeConfig } from '../badgesUtils'
import { cleanVersionNumber } from '../../utils/version'

const config: BadgeConfig = {
  label: 'Node Version',
  color: '5c80f7',
  style: 'for-the-badge',
  logo: 'ts-node',
  logoColor: 'ffffff'
}

/**
 * Determines the current version of node and creates the badge for it
 * @returns the url encoding of the node version badge
 */
export function prepareNodeVersionBadge (): string {
  const nodeVersion = retrieveNodeVersion()
  const version = cleanVersionNumber(nodeVersion)
  return createURL({ ...config, message: version })
}

/**
 * Spawns a child process to determine the current version of node
 * @returns the current version of node
 */
function retrieveNodeVersion (): string {
  const process = spawnSync('node', ['--version'])
  return process.stdout.toString()
}
