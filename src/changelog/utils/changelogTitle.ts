import { getPackageJson } from '../../utils/packageJson'

/**
 * @returns the formatted change log title
 */
export function createChangelogTitle (): string {
  const version = getPackageJson().version
  const deploy = evaluateEnvDeploy()
  return `${deploy} Deploy v${version}`
}

/**
 * Determines if this version is a production deploy or a dev deploy
 * @returns 'Production' or 'Dev'
 */
export function evaluateEnvDeploy (): 'Production' | 'Dev' {
  const version = getPackageJson().version
  const versionFields = version.split('.')
  const patch = versionFields[versionFields.length - 1]

  const isProductionVersion = patch === '0'
  return isProductionVersion ? 'Production' : 'Dev'
}
