import { execSync } from 'child_process'

/**
 * @returns the current formatted datetime
 */
export function evaluateDatetime (): string {
  const process = execSync("TZ='America/Los_Angeles' date '+%A %D %l:%M %p %Z'")
  return process.toString()
}
