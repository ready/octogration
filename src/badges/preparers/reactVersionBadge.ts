import { getPackageJson } from '../../packageJson'
import { createURL, BadgeConfig, cleanVersionNumber } from '../badgesUtils'

const config: BadgeConfig = {
  label: 'React Version',
  color: '5c80f7',
  style: 'for-the-badge',
  logo: 'React',
  logoColor: 'ffffff'
}

/**
 * Parses the package.json file to find the react version used in the project
 * @returns the url encoding of the react version badge
 */
export function prepareReactVersionBadge (): string {
  const packageJson = getPackageJson()
  const version = cleanVersionNumber(packageJson.dependencies.react)
  return createURL({ ...config, message: version })
}
