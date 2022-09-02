import { getPackageJson } from '../../utils/packageJson'
import { createURL } from '../badgesUtils'
import { cleanVersionNumber } from '../../utils/version'

/**
 * Parses the package.json file to find the version of the project
 * @returns the url encoding of the version badge
 */
export function prepareVersionBadge (): string {
  const config = getPackageJson().config.badgeConfigs.version
  const packageJson = getPackageJson()
  const version = cleanVersionNumber(packageJson.version)
  return createURL({ ...config, message: version, color: config.primaryColor })
}
