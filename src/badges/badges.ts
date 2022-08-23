import { readSources, writeSources } from '../readmeParser'
import { prepareVersionBadge } from './preparers/versionBadge'
import { prepareTestsBadge } from './preparers/testsBadge'
import { prepareCoverageBadge } from './preparers/coverageBadge'
import { prepareVulnerabilitiesBadge } from './preparers/vulnerabilitiesBadge'
import { prepareNodeVersionBadge } from './preparers/nodeVersionBadge'
import { prepareNPMVersionBadge } from './preparers/npmVersionBadge'
import { prepareViteVersionBadge } from './preparers/viteVersionBadge'
import { prepareReactVersionBadge } from './preparers/reactVersionBadge'
import { prepareLinterBadge } from './preparers/linterBadge'
import { prepareDeprecationsBadge } from './preparers/deprecationsBadge'
import { prepareStaleBranchesBadge } from './preparers/staleBranchesBadge'
import { prepareNeglectedPrsBadge } from './preparers/neglectedPRsBadge'
import { prepareLastProdBadge } from './preparers/lastProdBadge'

const HELP_MSG = `
This badges script will modify the README.md file in the root directory of the current project.
It updates the badges to be consistent with the latest version of the project.

Useage: badges.ts <badgeList?>
The badgeList parameter is optional and should be in the format: type,type,type,...
Where each type is a valid badge type to be updated. 
When the badge list parameter has not been provided, all badges are updated.
Here are the valid badges to pass in:`

enum ValidBadgeType {
  Version = 'version',
  StaleBranches = 'staleBranches',
  NeglectedPRs = 'neglectedPrs',
  LastProd = 'lastProd',
  Tests = 'tests',
  Coverage = 'coverage',
  Vulnerabilities = 'vulnerabilities',
  Deprecations = 'deprecations',
  NodeVersion = 'nodeVersion',
  NPMVersion = 'npmVersion',
  ViteVersion = 'viteVersion',
  ReactVersion = 'reactVersion',
  Linter = 'linter'
}

const preparers = new Map<ValidBadgeType, (oldBadge: string) => (string | Promise<string>)>()
preparers.set(ValidBadgeType.Version, prepareVersionBadge)
preparers.set(ValidBadgeType.StaleBranches, prepareStaleBranchesBadge)
preparers.set(ValidBadgeType.NeglectedPRs, prepareNeglectedPrsBadge)
preparers.set(ValidBadgeType.LastProd, prepareLastProdBadge)
preparers.set(ValidBadgeType.Tests, prepareTestsBadge)
preparers.set(ValidBadgeType.Coverage, prepareCoverageBadge)
preparers.set(ValidBadgeType.Vulnerabilities, prepareVulnerabilitiesBadge)
preparers.set(ValidBadgeType.Deprecations, prepareDeprecationsBadge)
preparers.set(ValidBadgeType.NodeVersion, prepareNodeVersionBadge)
preparers.set(ValidBadgeType.NPMVersion, prepareNPMVersionBadge)
preparers.set(ValidBadgeType.ViteVersion, prepareViteVersionBadge)
preparers.set(ValidBadgeType.ReactVersion, prepareReactVersionBadge)
preparers.set(ValidBadgeType.Linter, prepareLinterBadge)

/**
 * Updates the badges in the README.md file
 */
export async function updateBadges (): Promise<void> {
  const badgeTypes = Object.values(ValidBadgeType)
  const sourcedBadges = readSources(badgeTypes)

  const badgesToUpdate = parseParams(process.argv)
  const updatedBadges = await Promise.all(sourcedBadges.map(async (oldBadge, index) => {
    const currentType = badgeTypes[index]
    if (!badgesToUpdate.includes(currentType)) return oldBadge

    const preparer = preparers.get(currentType)
    if (preparer === undefined) {
      console.error(`Preparer not found for ${currentType}`)
      return ''
    }

    try {
      const newBadge = await preparer(oldBadge)
      console.log(`Updated ${currentType} badge`)
      return newBadge
    } catch (e) {
      console.error(e)
      return ''
    }
  }))

  writeSources(badgeTypes, updatedBadges)
}
void updateBadges()

/**
 * Parses and validates all of the parameters sent to the process via CLI.
 * Displays the help message on screen if the params aren't in a valid format.
 * @param params - CLI parameters from the process
 */
function parseParams (params: string[]): ValidBadgeType[] {
  const validBadgeTypes = Object.values(ValidBadgeType)
  if (params.length === 2) {
    return validBadgeTypes
  } else if (params.length !== 3) {
    help()
    return []
  }

  const badgeNames = params[2].split(',')
  try {
    return badgeNames.map(badgeName => {
      const badgeType = validBadgeTypes.find(bt => bt.toString() === badgeName)
      if (badgeType === undefined) throw new Error()
      return badgeType
    })
  } catch {
    help()
    return []
  }
}

/**
 * Prints the help message to console with a list of all valid badge types
 */
function help (): void {
  const badgeNames = Object.values(ValidBadgeType).map(v => v.toString())
  const helpMessage = badgeNames.reduce((message, next) => `${message}\n * ${next}`, HELP_MSG)
  console.log(helpMessage)
}
