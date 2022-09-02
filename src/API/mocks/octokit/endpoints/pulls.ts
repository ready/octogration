import { OctokitResponse, OctokitRequest } from '../mockedOctokit'

export interface MockedPR {
  id: number
  submitted_at: string
  state: 'open' | 'closed'
  reviewAuthors: string[]
  head: {
    ref: string
  }
  base: {
    ref: string
  }
  title: string
  body: string
}

export const mockedPullData: MockedPR[] = [
  {
    id: 1,
    submitted_at: (new Date()).toISOString(),
    state: 'open',
    reviewAuthors: [],
    head: { ref: 'some-branch' },
    base: { ref: 'main' },
    title: 'Mocked PR title 1',
    body: 'Mocked PR body 1'
  }, {
    id: 6,
    submitted_at: (new Date(Date.now() - 24 * 3600 * 1000)).toISOString(),
    state: 'open',
    reviewAuthors: [],
    head: { ref: 'some-branch2' },
    base: { ref: 'main' },
    title: 'Mocked PR title 6',
    body: 'Mocked PR body 6'
  }, {
    id: 10,
    submitted_at: (new Date('7/2/22')).toISOString(),
    state: 'open',
    reviewAuthors: ['ready'],
    head: { ref: 'some-branch3' },
    base: { ref: 'main' },
    title: 'Mocked PR title 10',
    body: 'Mocked PR body 10'
  }, {
    id: 12,
    submitted_at: (new Date('8/2/22')).toISOString(),
    state: 'closed',
    reviewAuthors: ['ready'],
    head: { ref: 'some-branch4' },
    base: { ref: 'main' },
    title: 'Mocked PR title 12',
    body: 'Mocked PR body 12'
  }, {
    id: 13,
    submitted_at: (new Date(Date.now() - 24 * 3600 * 1000 * 2)).toISOString(),
    state: 'closed',
    reviewAuthors: ['ready', 'riverliway', 'ready'],
    head: { ref: 'some-branch5' },
    base: { ref: 'some-branch4' },
    title: 'Mocked PR title 13',
    body: 'Mocked PR body 13'
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
 * - head: the ref (name of branch) of the branch merging in
 * - base: the ref (name of branch) of the branch being merged into
 */
export function executePullsEndpoint (request: OctokitRequest): OctokitResponse<MockedPR[]> {
  const state = request.params.get('state')
  const stateFiltered = mockedPullData.filter(pr => state === undefined || pr.state === state)

  return {
    status: 200,
    data: stateFiltered
  }
}
