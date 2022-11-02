import { getPackageJson } from '../../utils/packageJson'
import { cleanVersionNumber } from '../../utils/version'
import { appendToChangelogFile } from '../parsers/changelogFileParser'
import { evaluateEnvDeploy } from '../utils/changelogTitle'
import { evaluatePrBody } from '../variables/prBody'
import { evaluatePrTitle } from '../variables/prTitle'

/**
 * Writes a changelog post and appends it to the changelog file
 */
export async function writeChangelogPost (): Promise<void> {
  const prBody = await evaluatePrBody()
  const override = getOverride(prBody)

  const writeChangelogToFile = getPackageJson().config.writeChangelogToFile
  const writeEmptyChangelogs = getPackageJson().config.writeEmptyChangelogs
  if (override === false) return
  if (!writeChangelogToFile && override === undefined) return

  const prTitle = await evaluatePrTitle()
  const post = {
    title: prTitle.startsWith('\n# ') ? prTitle.substring('\n# '.length) : prTitle,
    body: prBody,
    version: cleanVersionNumber(getPackageJson().version),
    env: evaluateEnvDeploy(),
    timestamp: (new Date()).toISOString()
  }

  // If this is an empty changelog, and that is disabled in the config
  // then do not write this changelog to file
  if (!writeEmptyChangelogs && post.title === '' && post.body === '') return

  appendToChangelogFile(post)
}

/**
 * Gets the override signal from the PR body, returns undefined
 * if neither override exists
 * @param prBody - the body of the pull request
 * @returns true or false if an override signal exists, undefined if not
 */
function getOverride (prBody: string): boolean | undefined {
  const lines = prBody.split('\n')
  if (lines.includes('<!-- changelogFile=true -->')) return true
  if (lines.includes('<!-- changelogFile=false -->')) return false
  return undefined
}
