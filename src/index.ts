import { updateBadges } from './badges/badges'
import { changelog } from './changelog/changelog'
import { executeLive } from './utils/executeLive'

export const HELP_MSG = `
Usage: octogration <subprocess> <...params>

Valid subprocesses are
- changelog
- badges
`

/**
 * Calls the appropriate subprocess based on the parameter passed in
 * Prints the help message if the subprocess isn't known
 * @param subprocess - which subprocess to call
 */
function callSubprocess (subprocess: string): void {
  switch (subprocess) {
    case 'changelog': changelog(); break
    case 'badges': void updateBadges(); break
    default: help()
  }
}

/**
 * Checks arguments and then either prints the help message
 * or runs the subprocess
 */
export function main (): void {
  if (process.argv.length < 3) {
    help()
  } else {
    callSubprocess(process.argv[2])
  }
}

// Only execute main if we're not in test mode
executeLive(main)

/**
 * Exits the program with failing status code after printing help message
 */
function help (): void {
  console.log(HELP_MSG)
  process.exit(1)
}
