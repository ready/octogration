import { getPackageJson } from '../../utils/packageJson'

/**
 * Formats and prints the change log title
 */
export function createChangelogTitle (): void {
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
