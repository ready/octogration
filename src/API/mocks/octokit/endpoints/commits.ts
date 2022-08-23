import { MockedOctokitResponse, OctokitRequest } from '../mockedOctokit'

export interface MockedCommit {
  author: string
  username: string
  avatar: string
}

const mockedCommitData: MockedCommit[] = [
  {
    author: 'riverliway@gmail.com',
    username: 'riverliway',
    avatar: 'https://avatars.githubusercontent.com/u/82117023?s=200&v=4'
  }, {
    author: 'git@ready.net',
    username: 'ready',
    avatar: 'https://avatars.githubusercontent.com/u/63874247?s=200&v=4'
  }
]

/**
 * Mocks the octokit commit data API
 * @param request - the Octokit request; valid parameters are:
 * - author: filters the commits by the specified author
 * - per_page: the number to return
 * @returns an array of commits that match the search parameters; fields are:
 * - author: the email of the author
 * - username: the github username of the author
 * - avatar: the github avatar of the author
 */
export function executeCommitsEndpoint (request: OctokitRequest): MockedOctokitResponse<MockedCommit[]> {
  const author = request.params.get('author')
  const authorFilteredCommits = mockedCommitData.filter(c => author === undefined || c.author === author)

  const perPage = request.params.get('per_page')
  const firstN = perPage === undefined ? undefined : parseInt(perPage)

  return {
    status: 200,
    data: authorFilteredCommits.slice(0, firstN)
  }
}
