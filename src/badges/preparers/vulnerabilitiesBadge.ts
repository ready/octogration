import { spawnSync } from 'child_process'
import { getPackageJson } from '../../utils/packageJson'
import { createURL } from '../badgesUtils'

/**
 * Runs an audit to find the number of vulnerabilities and creates the badge
 * @returns the url encoding of the vulnerabilities badge
 */
export function prepareVulnerabilitiesBadge (): string {
  const config = getPackageJson().config.badgeConfigs.vulnerabilities
  const summary = retrieveAuditSummary()
  const vuln = summary.metadata.vulnerabilities
  const totalVulnerabilities = vuln.low + vuln.moderate + vuln.high + vuln.critical

  const color = totalVulnerabilities === 0 ? config.primaryColor : config.secondaryColor
  const message = totalVulnerabilities.toFixed(0)
  return createURL({ ...config, message, color })
}

interface AuditSummary {
  metadata: {
    vulnerabilities: {
      info: number
      low: number
      moderate: number
      high: number
      critical: number
    }
  }
}

/**
 * Spawns a child process to run the npm audit
 * @returns metadata about how many vulnerabilities were found
 */
function retrieveAuditSummary (): AuditSummary {
  const process = spawnSync('npm', ['audit', '--json'])
  return JSON.parse(process.stdout.toString()) as AuditSummary
}
