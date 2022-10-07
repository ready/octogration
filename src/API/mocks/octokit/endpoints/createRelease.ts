import { OctokitResponse, OctokitRequest } from '../mockedOctokit'

/**
 * Mocks the octokit create release API
 * @param request - the Octokit request; there are no valid parameters, valid data fields are:
 * - tag_name (string): the name of the tag
 * - target_commitish (string?): the branch to target for the release
 * - name (string?): the name of the release
 * - body (string?): the body of the release
 * - draft (boolean?): is the release a draft
 * - prerelease (boolean?): is the release a prelease
 * - generate_release_notes (boolean?): should Github generate the release notes
 * @returns true if the release was formatted properly, false if not
 */
export function executeCreateReleaseEndpoint (request: OctokitRequest): OctokitResponse<boolean> {
  const goodResponse = { status: 200, data: true }
  const badResponse = { status: 400, data: false }

  if (request.type !== 'POST') return badResponse

  const data = request.data
  if (!isValidString(data, 'tag_name', false)) return badResponse
  if (!isValidString(data, 'target_commitish', true)) return badResponse
  if (!isValidString(data, 'name', true)) return badResponse
  if (!isValidString(data, 'body', true)) return badResponse
  if (!isValidBoolean(data, 'draft', true)) return badResponse
  if (!isValidBoolean(data, 'prerelease', true)) return badResponse
  if (!isValidBoolean(data, 'generate_release_notes', true)) return badResponse

  return goodResponse
}

/**
 * Checks if the field of an object is a valid string
 * @param data - the object holding the field
 * @param field - the name of the field to check
 * @param optional - is the field optional
 * @returns true if the field is a valid string
 */
function isValidString (data: any, field: string, optional: boolean): boolean {
  if (typeof data !== 'object') return false
  if (!optional && !(field in data)) return false
  if (field in data && typeof data[field] !== 'string') return false
  return true
}

/**
 * Checks if the field of an object is a valid boolean
 * @param data - the object holding the field
 * @param field - the name of the field to check
 * @param optional - is the field optional
 * @returns true if the field is a valid boolean
 */
function isValidBoolean (data: any, field: string, optional: boolean): boolean {
  if (typeof data !== 'object') return false
  if (!optional && !(field in data)) return false
  if (field in data && typeof data[field] !== 'boolean') return false
  return true
}

export const testCreateRelease = {
  isValidString,
  isValidBoolean
}
