import { readFileSync, writeFileSync } from 'fs'

// These are held here to make the process of writing the new sources easier
let readmeFile = ''
let originalSources = [] as string[]

/**
 * Reads the source tags for a list of alt tags from the readme file
 * @param alts - a list of alt texts to search for
 * @returns a list of source texts
 */
export function readSources (alts: string[]): string[] {
  readmeFile = readReadMeFile()
  originalSources = parseAltSources(readmeFile, alts)
  return originalSources
}

/**
 * Overwrites the readme file with new sources for each alt
 * Throw error if the alts and sources are not the same length
 * @param alts - A list of alt texts to replace with new sources
 * @param sources - A list of the new sources to write into the file
 */
export function writeSources (alts: string[], sources: string[]): void {
  if (alts.length !== sources.length) {
    throw new Error('Writing sources requires the alts and sources list to be the same length')
  }
  if (alts.length !== originalSources.length) {
    throw new Error('Writing sources requires the alts and original sources list to be the same length')
  }

  alts.forEach((alt, index) => {
    const searchString = `alt="${alt}" src="${originalSources[index]}"`
    const replaceString = `alt="${alt}" src="${sources[index]}"`
    readmeFile = readmeFile.replace(searchString, replaceString)
  })

  writeReadMeFile(readmeFile)
}

/**
 * Looks through a file to search for the specific format:
 * alt="<some alt text>" src="<the source>"[space]
 * If multiple alts with the same text are found, the first source is returned
 * If no alts are found, an empty string is returned
 * @param file - the string version of the file to search through
 * @param alts - a list of alt strings to look for
 * @returns a list of source strings that match the alts provided
 */
function parseAltSources (file: string, alts: string[]): string[] {
  const sources = [] as string[]
  alts.forEach(alt => {
    sources.push(searchForAltSource(file, alt))
  })
  return sources
}

/**
 * Looks through a file to search for the specific format:
 * alt="<some alt text>" src="<the source>"[space]
 * If multiple alts with the same text are found, the first source is returned
 * If no alts are found, an empty string is returned
 * @param file - the string version of the file to search through
 * @param alt - the alt text to search for
 * @returns the source string for the matching alt
 */
function searchForAltSource (file: string, alt: string): string {
  const altSearchString = `alt="${alt}"`
  const altLocation = file.indexOf(altSearchString)
  if (altLocation === -1) return ''

  // Once the alt location is found, we need to search for the next space
  const beginSpaceSearchIndex = altLocation + altSearchString.length + 1
  const nextSpaceLocation = file.indexOf(' ', beginSpaceSearchIndex)
  if (nextSpaceLocation === -1) return ''

  // We need to set the bounds so that it doesn't include the src=""
  const beginSource = beginSpaceSearchIndex + 5
  const endSource = nextSpaceLocation - 1

  return file.substring(beginSource, endSource)
}

/**
 * @returns the contents of the README.md file
 */
function readReadMeFile (): string {
  return readFileSync('README.md').toString()
}

/**
 * @param file - the string version of the file to overwrite with
 */
function writeReadMeFile (file: string): void {
  writeFileSync('README.md', file)
}
