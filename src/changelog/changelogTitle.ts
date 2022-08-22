import { getPackageJson } from '../packageJson'

const HELP_MSG = `
This changelog title will read the version number from package.json
and then format and print the changelog title
`

/**
 * Formats and prints the change log title
 */
function createChangelogTitle (): void {
  const version = getPackageJson().version
  const deploy = evaluateEnvDeploy()
  console.log(`${deploy} Deploy v${version}`)
}

/**
 * Determines if this version is a production deploy or a dev deploy
 * @returns 'Production' or 'Dev'
 */
function evaluateEnvDeploy (): 'Production' | 'Dev' {
  const version = getPackageJson().version
  const versionFields = version.split('.')
  if (versionFields.length !== 3) {
    throw new Error('Version number not in semver format')
  }

  const isProductionVersion = versionFields[2] === '0'
  return isProductionVersion ? 'Production' : 'Dev'
}

/**
 * Checks arguments and then either prints the help message
 * or calls the create changelog function
 */
export function main (): void {
  if (process.argv.length !== 2) {
    help()
  } else {
    createChangelogTitle()
  }
}
main()

/**
 * Prints the help message to console
 */
function help (): void {
  console.log(HELP_MSG)
}
