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
  const writeChangelogToFile = getPackageJson().config.writeChangelogToFile
  const writeEmptyChangelogs = getPackageJson().config.writeEmptyChangelogs
  if (!writeChangelogToFile) return

  const prTitle = await evaluatePrTitle()
  const post = {
    title: prTitle.startsWith('\n# ') ? prTitle.substring('\n# '.length) : prTitle,
    body: await evaluatePrBody(),
    version: cleanVersionNumber(getPackageJson().version),
    env: evaluateEnvDeploy(),
    timestamp: (new Date()).toISOString()
  }

  // If this is an empty changelog, and that is disabled in the config
  // then do not write this changelog to file
  if (!writeEmptyChangelogs && post.title === '' && post.body === '') return

  appendToChangelogFile(post)
}
