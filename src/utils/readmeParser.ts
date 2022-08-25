import { readFileSync, writeFileSync } from 'fs'

let readmeFile: undefined | string
const sources = new Map<string, string>()

/**
 * Grabs an image source from the readme file given the alt text
 * Caches the readme file internally and can be written with `writeSources()`
 * @param alt - The alt text of the image to find
 * @returns the image source, or undefined if not found
 */
export function getSource (alt: string): string | undefined {
  if (readmeFile === undefined) {
    readmeFile = readReadMeFile()
  }

  const source = searchForAltSource(readmeFile, alt)
  if (source !== undefined) sources.set(alt, source)
  return source
}

/**
 * Replaces all image sources with a given alt text in the readme file
 * @param alt - the alt text of the image to set
 * @param source - the new source to replace with
 */
export function setSource (alt: string, source: string): void {
  if (readmeFile === undefined) {
    throw new Error('The alt text was not gotten before attempting to set')
  }

  const oldSource = sources.get(alt)
  if (oldSource === undefined) {
    throw new Error('The alt text was not gotten before attempting to set')
  }

  sources.set(alt, source)
  readmeFile.replaceAll(htmlify(alt, oldSource), htmlify(alt, source))
}

/**
 * Writes the sources to the readme file
 */
export function writeSources (): void {
  if (readmeFile === undefined) {
    throw new Error('No sources have been read before attempting to write')
  }
  writeFileSync('README.md', readmeFile)
}

/**
 * Looks through a file to search for the specific format:
 * alt="<some alt text>" src="<the source>"[space]
 * If multiple alts with the same text are found, the first source is returned
 * If no alts are found, an empty string is returned
 * @param file - the string version of the file to search through
 * @param alt - the alt text to search for
 * @returns the source string for the matching alt, or undefined if not found
 */
function searchForAltSource (file: string, alt: string): string | undefined {
  const altSearchString = `<img alt="${alt}"`
  const altLocation = file.indexOf(altSearchString)
  if (altLocation === -1) return undefined

  // Once the alt location is found, we need to search for the next space
  const beginSpaceSearchIndex = altLocation + altSearchString.length + 1
  const nextSpaceLocation = file.indexOf(' ', beginSpaceSearchIndex)
  if (nextSpaceLocation === -1) return undefined

  // We need to set the bounds so that it doesn't include the src=""
  const beginSource = beginSpaceSearchIndex + 'src="'.length
  const endSource = nextSpaceLocation - 1

  return file.substring(beginSource, endSource)
}

/**
 * @param alt - the alt string
 * @param source - the source
 * @returns an image tag formatted as HTML
 */
function htmlify (alt: string, source: string): string {
  return `<img alt="${alt}" src="${source}" `
}

/**
 * @returns the contents of the README.md file
 */
function readReadMeFile (): string {
  return readFileSync('README.md').toString()
}
