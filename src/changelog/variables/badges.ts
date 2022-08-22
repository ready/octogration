import { readSources } from '../../readmeParser'

/**
 * @returns an HTML block of badges to display from the README.md file
 */
export function evaluateBadges (): string {
  const badgeAlts = [
    'tests',
    'coverage',
    'vulnerabilities',
    'deprecations'
  ]
  const badgeSources = readSources(badgeAlts)

  let badgeSection = '<p align="center">\n'
  badgeAlts.forEach((alt, index) => {
    badgeSection += '  ' + htmlifyBadge(alt, badgeSources[index]) + '\n'
  })
  badgeSection += '</p>'

  return badgeSection
}

/**
 * Formats an alt and a source into an HTML image tag
 * @param alt - the alt text
 * @param source - the source URL
 * @returns an HTML image tag
 */
function htmlifyBadge (alt: string, source: string): string {
  return `<img alt="${alt}" src="${source}" />&nbsp`
}
