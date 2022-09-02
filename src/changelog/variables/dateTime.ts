import { getPackageJson } from '../../utils/packageJson'

/**
 * @returns the current formatted datetime
 */
export function evaluateDatetime (): string {
  const config = getPackageJson().config
  return (new Date()).toLocaleString(config.datetimeLocal, config.datetimeOptions)
}
