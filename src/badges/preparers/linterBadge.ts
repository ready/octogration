import { spawnSync } from 'child_process'
import { getPackageJson } from '../../utils/packageJson'
import { createURL } from '../badgesUtils'

/**
 * Runs `ts-standard` and counts the number of linter errors to create the badge
 * @returns the url encoding of the linter badge
 */
export function prepareLinterBadge (): string {
  const config = getPackageJson().config.badgeConfigs.linter
  const errors = retrieveLinterErrors()
  const color = errors === 0 ? config.primaryColor : config.secondaryColor
  const message = errors.toFixed(0)
  return createURL({ ...config, message, color })
}

/**
 * Spawns a child process to run the linter
 * @returns a number representing how many linter errors there are
 */
function retrieveLinterErrors (): number {
  const process = spawnSync('npm', ['run', 'lint'])
  const output = process.stdout.toString()
  return output.split('\n').length - 1
}
