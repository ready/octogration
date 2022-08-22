import { spawnSync } from 'child_process'
import { createURL, BadgeStyle } from '../badgesUtils'

const config = {
  label: 'Vulnerabilities',
  color: '33ab53',
  secondaryColor: 'cf3b36',
  logo: 'Amazon Cloudwatch',
  logoColor: 'ffffff',
  style: 'for-the-badge' as BadgeStyle
}

/**
 * Runs an audit to find the number of vulnerabilities and creates the badge
 * @returns the url encoding of the vulnerabilities badge
 */
export function prepareVulnerabilitiesBadge (): string {
  const summary = retrieveAuditSummary()
  const vuln = summary.metadata.vulnerabilities
  const totalVulnerabilities = vuln.low + vuln.moderate + vuln.high + vuln.critical

  const color = totalVulnerabilities === 0 ? config.color : config.secondaryColor
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
