import { createURL, BadgeConfig } from '../badgesUtils'
import { cleanVersionNumber } from '../../utils/version'

const config: BadgeConfig = {
  label: 'Package Version',
  color: '5c80f7',
  style: 'for-the-badge',
  logo: 'ts-node',
  logoColor: 'ffffff'
}

/**
 * Determines the current version of node and creates the badge for it
 * @returns the url encoding of the node version badge
 */
export function preparePackageVersionBadge (packageName: string, version: string): string {
  const message = cleanVersionNumber(version)
  return createURL({ ...config, message })
}
