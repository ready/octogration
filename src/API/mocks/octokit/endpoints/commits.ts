import { OctokitResponse, OctokitRequest } from '../mockedOctokit'

export interface MockedCommit {
  author: {
    email: string
    login: string
    avatar_url: string
  }
}

const mockedCommitData: MockedCommit[] = [
  {
    author: {
      email: 'riverliway@gmail.com',
      login: 'riverliway',
      avatar_url: 'https://avatars.githubusercontent.com/u/82117023?s=200&v=4'
    }
  }, {
    author: {
      email: 'git@ready.net',
      login: 'ready',
      avatar_url: 'https://avatars.githubusercontent.com/u/63874247?s=200&v=4'
    }
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
export function executeCommitsEndpoint (request: OctokitRequest): OctokitResponse<MockedCommit[]> {
  const author = request.params.get('author')
  const authorFilteredCommits = mockedCommitData.filter(c => author === undefined || c.author.email === author)

  const perPage = request.params.get('per_page')
  const firstN = perPage === undefined ? authorFilteredCommits.length : parseInt(perPage)
  const endSlice = Math.max(Math.min(firstN, authorFilteredCommits.length), 0)
  return {
    status: 200,
    data: authorFilteredCommits.slice(0, endSlice)
  }
}
