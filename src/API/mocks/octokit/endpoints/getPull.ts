import { OctokitRequest, OctokitResponse } from '../mockedOctokit'
import { MockedPR, mockedPullData } from './pulls'

/**
 * Mocks the octokit get PR data API
 * @param request - the octokit requestl; no valid parameters
 * @returns the PR with the matching id; fields are:
 * - id: the number of the PR in github
 * - submitted_at: the date of PR submission in ISO 8601 format
 * - state: open or closed
 * - reviewAuthors: a list of authors that reviewed the PR
 * - head: the ref (name of branch) of the branch merging in
 * - base: the ref (name of branch) of the branch being merged into
 */
export function executeGetPullEndpoint (request: OctokitRequest): OctokitResponse<MockedPR | undefined> {
  const id = request.endpoint[4]
  const pr = mockedPullData.find(pr => pr.id === parseInt(id))
  if (pr === undefined) {
    return {
      status: 404,
      data: undefined
    }
  }

  return {
    status: 200,
    data: pr
  }
}
