
/**
 * @param version - a version number that may have extra formatting
 * @returns a semver style version number in format X.Y.Z with no extra formatting
 */
export function cleanVersionNumber (version: string): string {
  const stripped = version.replace(/[^0-9.]/g, '')
  const fields = stripped.split('.').filter(f => f !== '')
  const cleanedFields = fields.map(f => parseInt(f).toString())
  return cleanedFields.join('.')
}

/**
 * Decrements the patch (last number in semver format)
 * Doesn't decrement below zero
 * @param version - the clean semver number to decrement
 * @returns a semver number one less than the input
 */
export function decrementPatch (version: string): string {
  const fields = version.split('.')
  const patch = parseInt(fields[fields.length - 1])
  fields[fields.length - 1] = Math.max(patch - 1, 0).toString()
  return fields.join('.')
}

/**
 * Decrements the minor (second number in semver format)
 * Doesn't decrement below zero
 * Resets the patch to zero
 * @param version - the clean semver number to decrement
 * @returns a semver number one less than the input
 */
export function decrementMinor (version: string): string {
  const fields = version.split('.')
  fields[fields.length - 1] = '0'
  const minor = parseInt(fields[1])
  fields[1] = Math.max(minor - 1, 0).toString()
  return fields.join('.')
}
