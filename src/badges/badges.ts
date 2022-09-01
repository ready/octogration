import { getSource, setSource, writeSources } from '../utils/readmeParser'
import { prepareVersionBadge } from './preparers/versionBadge'
import { prepareTestsBadge } from './preparers/testsBadge'
import { prepareCoverageBadge } from './preparers/coverageBadge'
import { prepareVulnerabilitiesBadge } from './preparers/vulnerabilitiesBadge'
import { prepareNodeVersionBadge } from './preparers/nodeVersionBadge'
import { prepareNPMVersionBadge } from './preparers/npmVersionBadge'
import { prepareLinterBadge } from './preparers/linterBadge'
import { prepareDeprecationsBadge } from './preparers/deprecationsBadge'
import { prepareStaleBranchesBadge } from './preparers/staleBranchesBadge'
import { prepareNeglectedPrsBadge } from './preparers/neglectedPRsBadge'
import { prepareLastProdBadge } from './preparers/lastProdBadge'
import { getPackageJson } from '../utils/packageJson'
import { preparePackageVersionBadge } from './preparers/packageVersionBadge'

const HELP_MSG = `
This badges script will modify the README.md file in the root directory of the current project.
It updates the badges to be consistent with the latest version of the project.

Useage: octogration badges <badgeList?>
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
preparers.set(ValidBadgeType.Linter, prepareLinterBadge)

/**
 * Updates the badges in the README.md file
 */
export async function updateBadges (): Promise<void> {
  const badgesToUpdate = parseParams(process.argv)

  await Promise.all(badgesToUpdate.map(async badgeName => {
    const originalSource = getSource(badgeName)

    if (originalSource !== undefined) {
      await updateBadge(badgeName, originalSource)
    }
  }))

  updatePackageVersionBadges()

  writeSources()
}

/**
 * Updates the badge and sets it in the readme
 * @param badgeName - the name of the badge to update
 * @param originalSource - the old version of the badge
 */
async function updateBadge (badgeName: ValidBadgeType, originalSource: string): Promise<void> {
  const preparer = preparers.get(badgeName)
  if (preparer === undefined) {
    console.error(`Preparer not found for ${badgeName}`)
    return
  }

  try {
    const newSource = await preparer(originalSource)
    setSource(badgeName, newSource)
  } catch (e) {
    console.error(e)
  }
}

/**
 * The package version badges are a bit unqiue,
 * so they need to be updated separately
 */
function updatePackageVersionBadges (): void {
  const updateDeps = (deps: { [key: string]: string }): void => {
    for (const [name, version] of Object.entries(deps)) {
      const badgeName = `${name}Version`
      const originalSource = getSource(badgeName)
      if (originalSource !== undefined) {
        const badge = preparePackageVersionBadge(name, version)
        setSource(badgeName, badge)
      }
    }
  }

  updateDeps(getPackageJson().dependencies)
  updateDeps(getPackageJson().devDependencies)
}

/**
 * Parses and validates all of the parameters sent to the process via CLI.
 * Displays the help message on screen if the params aren't in a valid format.
 * @param params - CLI parameters from the process
 */
function parseParams (params: string[]): ValidBadgeType[] {
  const validBadgeTypes = Object.values(ValidBadgeType)
  if (params.length === 3) {
    return validBadgeTypes
  } else if (params.length !== 4) {
    help()
    return []
  }

  const badgeNames = params[3].split(',')
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
 * and then exits with a failing status code
 */
function help (): void {
  const badgeNames = Object.values(ValidBadgeType).map(v => v.toString())
  const helpMessage = badgeNames.reduce((message, next) => `${message}\n * ${next}`, HELP_MSG)
  console.log(helpMessage)
  process.exit(1)
}
