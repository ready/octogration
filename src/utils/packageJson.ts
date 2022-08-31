import { readFileSync } from 'fs'

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
  }
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
