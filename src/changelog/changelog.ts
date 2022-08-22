import { writeFileSync } from 'fs'
import { formatFileHasVariable, getFormatFile, replaceVariable } from './releaseFormatParser'
import { evaluateBadges } from './variables/badges'
import { evaluateBranch } from './variables/branch'
import { evaluateCommitLog } from './variables/commitLog'
import { evaluateDatetime } from './variables/dateTime'

const HELP_MSG = `
Usage: ts-node changelog.ts <prNumber> <branchName>
This changelog script reads from the file .github/data/commits.txt
and parses the commit messages to create a changelog for release.
It uses the format described in releaseFormat.md and substitutes the values as necessary
`

const knownVariables = new Map<string, () => string | Promise<string>>()
knownVariables.set('dateTime', evaluateDatetime)
knownVariables.set('branch', evaluateBranch)
knownVariables.set('badges', evaluateBadges)
knownVariables.set('commitLog', evaluateCommitLog)

/**
 * Evaluates every variable in the format file and replaces them
 */
async function createChangelog (): Promise<void> {
  const variables = [...knownVariables.keys()]
  await Promise.all(variables.map(async variable => {
    const evaluator = knownVariables.get(variable)

    if (formatFileHasVariable(variable)) {
      const value = await (evaluator === undefined ? '' : evaluator())
      replaceVariable(variable, value)
    }
  }))

  writeFileSync('./.github/data/changelog.md', getFormatFile())
}

/**
 * Checks arguments and then either prints the help message
 * or calls the create changelog function
 */
export function main (): void {
  if (process.argv.length !== 4) {
    help()
    process.exit(1)
  } else {
    void createChangelog()
  }
}
main()

/**
 * Prints the help message to console
 */
function help (): void {
  console.log(HELP_MSG)
}
