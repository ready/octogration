
const formatFile =
`<!-- dateTime -->
<!-- branch -->
<!-- badges -->
<!-- prTitle -->
<!-- prBody -->

<!-- commitLog -->`

/**
 * Checks if the format file has the variable of a certain name in it
 * @param variableName - The name of the variable to check for
 * @returns true if the format file has a variable by this name
 */
export function formatFileHasVariable (variableName: string): boolean {
  return formatFile.includes(`<!-- ${variableName} -->`)
}

interface Variables {
  [variable: string]: string
}

/**
 * Replaces the variables in the format file with values and returns it
 * @param variables - a dictionary of variable names to values
 * @returns the formatted file with new values inserted
 */
export function replaceVariables (variables: Variables): string {
  let file = formatFile

  Object.keys(variables).forEach(variable => {
    file = file.replace(`<!-- ${variable} -->`, variables[variable])
  })

  return file
}

/**
 * @returns the format file
 */
export function getFormatFile (): string {
  return formatFile
}
