
let formatFile = ''
let readFile = false

/**
 * Checks if the format file has the variable of a certain name in it
 * If the format file hasn't been read into cache yet, this function reads it
 * @param variableName - The name of the variable to check for
 * @returns true if the format file has a variable by this name
 */
export function formatFileHasVariable (variableName: string): boolean {
  guarenteeFormatFile()
  return formatFile.includes(`<!-- ${variableName} -->`)
}

/**
 * Replaces all instances of a variable name with the value
 * If the format file hasn't been read into cache yet, this function reads it
 * @param variableName - The name of the variable to check for
 * @returns true if the format file has a variable by this name
 */
export function replaceVariable (variableName: string, value: string): void {
  guarenteeFormatFile()
  formatFile = formatFile.replace(`<!-- ${variableName} -->`, value)
}

/**
 * @returns the format file
 */
export function getFormatFile (): string {
  return formatFile
}

/**
 * Guarentees `formatFile` has been read in before performing operations on it
 */
function guarenteeFormatFile (): void {
  if (!readFile) {
    formatFile = readMarkdownFormat()
    readFile = true
  }
}

/**
 * Reads the release format from file
 * @returns the string verison of the file
 */
const readMarkdownFormat = (): string =>
`<!-- dateTime -->
<!-- branch -->
<!-- badges -->
<!-- prTitle -->
<!-- prBody -->

<!-- commitLog -->`

export const testReleaseFormatParser = {
  reset: () => {
    formatFile = ''
    readFile = false
  }
}
