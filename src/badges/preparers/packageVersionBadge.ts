import { createURL } from '../badgesUtils'
import { cleanVersionNumber } from '../../utils/version'
import { BadgeConfig, getPackageJson } from '../../utils/packageJson'

/**
 * Determines the current version of node and creates the badge for it
 * @returns the url encoding of the node version badge
 */
export function preparePackageVersionBadge (packageName: string, version: string): string {
  const config = getConfig(packageName)
  const message = cleanVersionNumber(version)
  return createURL({ ...config, message, color: config.primaryColor })
}

/**
 * The package version badge is a bit different because it is an entire class of badges
 * And the users can choose any of their package versions to add
 * @param packageName - the name of the package
 * @returns the config for this package, or the default package
 */
function getConfig (packageName: string): BadgeConfig {
  const badgeName = `${packageName}Version`
  const badgeConfigs = getPackageJson().config.badgeConfigs

  const defaultConfig: BadgeConfig = {
    label: `${packageName} Version`,
    labelColor: '555555',
    primaryColor: '5c80f7',
    secondaryColor: '5c80f7',
    logo: 'Stackbit',
    logoColor: 'ffffff',
    logoWidth: '14',
    style: 'for-the-badge'
  }

  if (!(badgeName in badgeConfigs)) return defaultConfig

  const givenConfig = badgeConfigs[badgeName]
  const checkField = (fieldName: keyof BadgeConfig): void => {
    if (!(fieldName in givenConfig)) (givenConfig as any)[fieldName] = defaultConfig[fieldName]
  }

  checkField('label')
  checkField('labelColor')
  checkField('primaryColor')
  checkField('secondaryColor')
  checkField('logo')
  checkField('logoColor')
  checkField('logoWidth')
  checkField('style')

  return givenConfig
}
