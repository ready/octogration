import { formatFileHasVariable, replaceVariables } from './parsers/releaseFormatParser'
import { createRelease } from './utils/createRelease'
import { evaluateBadges } from './variables/badges'
import { evaluateBranch } from './variables/branch'
import { evaluateCommitLog } from './variables/commitLog'
import { evaluateDatetime } from './variables/dateTime'
import { evaluatePrBody } from './variables/prBody'
import { evaluatePrTitle } from './variables/prTitle'

const HELP_MSG = `
Usage: octogration changelog <prNumber>

This changelog script reads from the file .github/data/commits.txt
and parses the commit messages to create a changelog for release.
It uses the format described in releaseFormat.md and substitutes the values as necessary
`

type Evaluator = () => string | Promise<string>
const knownVariables = new Map<string, Evaluator>()
knownVariables.set('dateTime', evaluateDatetime)
knownVariables.set('branch', evaluateBranch)
knownVariables.set('badges', evaluateBadges)
knownVariables.set('prTitle', evaluatePrTitle)
knownVariables.set('prBody', evaluatePrBody)

/**
 * Evaluates every variable in the format file and replaces them
 */
async function createChangelog (): Promise<void> {
  let body = ''
  let minimizeLevel = 0

  do {
    body = await evaluateChangelog(minimizeLevel)
    minimizeLevel++
  } while (body.length >= 125000)

  console.warn('!!body', body)

  await createRelease(body)
}

/**
 * Evaluates every variable in the format file and replaces them
 * @param minimizeLevel - how much minimization should be done
 */
async function evaluateChangelog (minimizeLevel: number): Promise<string> {
  const variables = [...knownVariables.keys(), 'commitLog']
  const values: any = {}

  await Promise.all(variables.map(async variable => {
    try {
      if (formatFileHasVariable(variable)) {
        if (variable === 'commitLog') {
          values[variable] = await evaluateCommitLog(minimizeLevel)
          console.warn('!!commitLog', values[variable])
        } else {
          const evaluator = knownVariables.get(variable) as Evaluator
          values[variable] = await evaluator()
        }
      }
    } catch (e) {
      console.error(e)
    }
    values[variable] = ''
  }))

  return replaceVariables(values)
}

/**
 * Checks arguments and then either prints the help message
 * or calls the create changelog function
 */
export async function changelog (): Promise<void> {
  if (process.argv.length !== 4) {
    help()
  } else {
    await createChangelog()
  }
}

/**
 * Prints the help message to console
 * and then exits with failing status code
 */
function help (): void {
  console.log(HELP_MSG)
  process.exit(1)
}
