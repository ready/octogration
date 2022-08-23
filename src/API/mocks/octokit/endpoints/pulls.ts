import { OctokitResponse, OctokitRequest } from '../mockedOctokit'

export interface MockedPR {
  id: number
  submitted_at: string
  state: 'open' | 'closed'
  reviewAuthors: string[]
}

export const mockedPullData: MockedPR[] = [
  {
    id: 1,
    submitted_at: (new Date()).toISOString(),
    state: 'open',
    reviewAuthors: []
  }, {
    id: 6,
    submitted_at: (new Date(Date.now() - 24 * 3600 * 1000)).toISOString(),
    state: 'open',
    reviewAuthors: []
  }, {
    id: 10,
    submitted_at: (new Date('7/2/22')).toISOString(),
    state: 'open',
    reviewAuthors: []
  }, {
    id: 12,
    submitted_at: (new Date('8/2/22')).toISOString(),
    state: 'closed',
    reviewAuthors: ['ready']
  }, {
    id: 13,
    submitted_at: (new Date(Date.now() - 24 * 3600 * 1000 * 2)).toISOString(),
    state: 'closed',
    reviewAuthors: ['ready']
  }
]

/**
 * Mocks the octokit PR data API
 * @param request - the Octokit request; valid parameters are:
 * - state: open or closed
 * @returns an array of PRs that match the search parameters; fields are:
 * - id: the number of the PR in github
 * - submitted_at: the date of PR submission in ISO 8601 format
 * - state: open or closed
 * - reviewAuthors: a list of authors that reviewed the PR
 */
export function executePullsEndpoint (request: OctokitRequest): OctokitResponse<MockedPR[]> {
  const state = request.params.get('state')
  const stateFiltered = mockedPullData.filter(pr => state === undefined || pr.state === state)

  return {
    status: 200,
    data: stateFiltered
  }
}
