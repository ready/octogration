import { readFileSync } from 'fs'
import { getDefaultBadgeConfigs } from './badgeConfig'

export interface PackageJson {
  version: string
  scripts: {
    testSummary: string
  }
  dependencies: {
    [key: string]: string
  }
  devDependencies: {
    [key: string]: string
  }
  config: OctogrationConfig
}

interface OctogrationConfig {
  datetimeLocal: string
  datetimeOptions: Intl.DateTimeFormatOptions
  commitSections: boolean | { [type: string]: string[] }
  badgeConfigs: {
    [name: string]: BadgeConfig
  }
  includePrTitleDev: boolean
  includePrTitleProd: boolean
  includePrBodyDev: boolean
  includePrBodyProd: boolean
  writeChangelogToFile: boolean
  changelogFileName: string
  writeEmptyChangelogs: boolean
}

export interface BadgeConfig {
  label: string
  labelColor: string
  primaryColor: string
  secondaryColor: string
  gradient?: [number, number]
  logo: string
  logoColor: string
  logoWidth: string
  style: string
}

let packageJson = undefined as undefined | PackageJson

/**
 * Reads the package.json file and returns the JSON object
 * Caches the data for future calls
 * @returns the package information
 */
export function getPackageJson (): PackageJson {
  if (packageJson === undefined) {
    packageJson = readPackageJson()
  }

  return packageJson
}

/**
 * Reads the package.json file and stores it in a cached variable
 * @returns the cached variable
 */
function readPackageJson (): PackageJson {
  const packageJson = JSON.parse(readFileSync('package.json').toString())
  const config = validateConfig(packageJson)
  delete packageJson['@ready/octogration']
  return { ...packageJson, config }
}

// The default configuration options if the provided ones aren't valid
export const defaultConfig: OctogrationConfig = {
  datetimeLocal: 'en-US',
  datetimeOptions: {
    weekday: 'long',
    day: 'numeric',
    year: '2-digit',
    month: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Los_Angeles',
    timeZoneName: 'short'
  },
  commitSections: false,
  badgeConfigs: getDefaultBadgeConfigs(),
  includePrTitleDev: true,
  includePrTitleProd: true,
  includePrBodyDev: true,
  includePrBodyProd: true,
  writeChangelogToFile: true,
  changelogFileName: 'automatic_changelog.json',
  writeEmptyChangelogs: true
}

/**
 * Validates the config fields and sets defaults if needed
 * @param packageJson - the package JSON to get the config from
 * @returns a validated config with defaults subbed in if necessary
 */
function validateConfig (packageJson: any): OctogrationConfig {
  const name = '@ready/octogration'
  const packageConfig = name in packageJson ? packageJson[name] : {}
  const config = typeof packageConfig === 'object' ? packageConfig : {}

  validateDatetime(config)
  validateCommitSections(config)
  validateBadgeConfigs(config)
  validateIncludePrContent(config)
  validateChangelogFile(config)

  return config
}

/**
 * Validates the datetime fields in the config and sets defaults if needed
 * @param config - the config to validate and potentially edit
 */
function validateDatetime (config: any): void {
  if (!isValidField(config, 'datetimeLocal', 'string')) config.datetimeLocal = defaultConfig.datetimeLocal
  if (!isValidField(config, 'datetimeOptions', 'object')) config.datetimeOptions = defaultConfig.datetimeOptions
}

/**
 * Validates the commit sections fields in the config and sets defaults if needed
 * Also filters out any invalid type arrays
 * @param config - the config to validate and potentially edit
 */
function validateCommitSections (config: any): void {
  if (!isValidField(config, 'commitSections', 'boolean')) {
    if (!isValidField(config, 'commitSections', 'object')) {
      config.commitSections = defaultConfig.commitSections
    } else {
      const sections = Object.keys(config.commitSections)
      const newCommitSections: { [type: string]: string[] } = {}
      sections.forEach(section => {
        const types = config.commitSections[section]
        if (!(types instanceof Array)) return

        const validTypes = types.filter((t): t is string => typeof t === 'string')
        if (validTypes.length > 0) {
          newCommitSections[section] = validTypes
        }
      })
      config.commitSections = newCommitSections
    }
  }
}

/**
 * Validates the badge configs in the config and sets defaults if needed
 * @param config - the config to validate and potentially edit
 */
function validateBadgeConfigs (config: any): void {
  if (!isValidField(config, 'badgeConfigs', 'object')) {
    config.badgeConfigs = defaultConfig.badgeConfigs
    return
  }

  const overrideField = (badgeName: string, field: string): void => {
    const defaultBadgeConfig = defaultConfig.badgeConfigs[badgeName] as any
    config.badgeConfigs[badgeName][field] = defaultBadgeConfig[field]
  }

  // Validate every field of every badge config
  for (const [badgeName, badgeConfigValue] of Object.entries(config.badgeConfigs)) {
    if (!(badgeName in defaultConfig.badgeConfigs)) {
      // Don't validate fields of variables not included in the default config
      continue
    }

    if (typeof badgeConfigValue !== 'object') {
      config.badgeConfigs[badgeName] = defaultConfig.badgeConfigs[badgeName]
      continue
    }

    const badgeConfig = badgeConfigValue as any
    const validateBadgeField = (field: string): void => {
      if (!isValidField(badgeConfig, field, 'string')) overrideField(badgeName, field)
    }

    validateBadgeField('label')
    validateBadgeField('labelColor')
    validateBadgeField('primaryColor')
    validateBadgeField('secondaryColor')
    validateBadgeField('logo')
    validateBadgeField('logoColor')
    validateBadgeField('logoWidth')
    validateBadgeField('style')

    if ('gradient' in badgeConfig) {
      if (!(badgeConfig.gradient instanceof Array)) overrideField(badgeName, 'gradient')
      if (badgeConfig.gradient.length !== 2) overrideField(badgeName, 'gradient')
      if (badgeConfig.gradient.every((n: any) => typeof n === 'number') !== true) overrideField(badgeName, 'gradient')
    } else {
      overrideField(badgeName, 'gradient')
    }
  }

  // If a default badge config isn't included at all, it should be added
  for (const [badgeName, badgeConfig] of Object.entries(defaultConfig.badgeConfigs)) {
    if (!(badgeName in config.badgeConfigs)) config.badgeConfigs[badgeName] = badgeConfig
  }
}

/**
 * Validates the include PR content flags in the config and sets defaults if needed
 * @param config - the config to validate and potentially edit
 */
function validateIncludePrContent (config: any): void {
  if (!isValidField(config, 'includePrTitleDev', 'boolean')) config.includePrTitleDev = defaultConfig.includePrTitleDev
  if (!isValidField(config, 'includePrTitleProd', 'boolean')) config.includePrTitleProd = defaultConfig.includePrTitleProd
  if (!isValidField(config, 'includePrBodyDev', 'boolean')) config.includePrBodyDev = defaultConfig.includePrBodyDev
  if (!isValidField(config, 'includePrBodyProd', 'boolean')) config.includePrBodyProd = defaultConfig.includePrBodyProd
}

/**
 * Validates the changelog file name in the config and sets defaults if needed
 * @param config - the config to validate and potentially edit
 */
function validateChangelogFile (config: any): void {
  if (!isValidField(config, 'writeChangelogToFile', 'string')) config.writeChangelogToFile = defaultConfig.writeChangelogToFile
  if (!isValidField(config, 'changelogFileName', 'string')) config.changelogFileName = defaultConfig.changelogFileName
  if (!isValidField(config, 'writeEmptyChangelogs', 'boolean')) config.writeEmptyChangelogs = defaultConfig.writeEmptyChangelogs
}

/**
 * Checks if the field of an object is a valid field
 * @param data - the object holding the field
 * @param field - the name of the field to check
 * @param type - the type of the field
 * @returns true if the field is a valid field
 */
function isValidField (data: any, field: string, type: string): boolean {
  // eslint-disable-next-line valid-typeof
  if (!(field in data) || typeof data[field] !== type) return false
  return true
}

export const testPackageJson = {
  reset: () => {
    packageJson = undefined
  }
}
