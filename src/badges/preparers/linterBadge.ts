import { spawnSync } from 'child_process'
import { createURL, BadgeStyle } from '../badgesUtils'

const config = {
  label: 'Linter',
  color: '33ab53',
  secondaryColor: 'cf3b36',
  logo: 'Integromat',
  logoColor: 'ffffff',
  style: 'for-the-badge' as BadgeStyle
}

/**
 * Runs `ts-standard` and counts the number of linter errors to create the badge
 * @returns the url encoding of the linter badge
 */
export function prepareLinterBadge (): string {
  const errors = retrieveLinterErrors()
  const color = errors === 0 ? config.color : config.secondaryColor
  const message = errors.toFixed(0)
  return createURL({ ...config, message, color })
}

/**
 * Spawns a child process to run the linter
 * @returns a number representing how many linter errors there are
 */
function retrieveLinterErrors (): number {
  // Shell must be enabled for piping between processes
  const process = spawnSync('npx', ['ts-standard', '|', 'wc', '-l'], { shell: true })
  const output = process.stdout.toString()
  return parseInt(output.trim())
}
