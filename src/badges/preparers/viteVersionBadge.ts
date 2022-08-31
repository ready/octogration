import { getPackageJson } from '../../utils/packageJson'
import { createURL, BadgeConfig } from '../badgesUtils'
import { cleanVersionNumber } from '../../utils/version'

const config: BadgeConfig = {
  label: 'Vite Version',
  color: '5c80f7',
  style: 'for-the-badge',
  logo: 'Vite',
  logoColor: 'ffffff'
}

/**
 * Parses the package.json file to find the vite version used in the project
 * @returns the url encoding of the vite version badge
 */
export function prepareViteVersionBadge (): string {
  const packageJson = getPackageJson()
  const version = cleanVersionNumber(packageJson.devDependencies.vite)
  return createURL({ ...config, message: version })
}
