import { OctokitResponse, OctokitRequest } from '../mockedOctokit'
import { mockedPullData } from './pulls'

export interface MockedReview {
  reviewAuthor: string
}

/**
 * Mocks the octokit review data API
 * @param request - the Octokit request; valid parameters are:
 * - per_page: the number of items to return
 * @returns an array of reviews that match the search parameters; fields are:
 * - reviewAuthor: the username of the reviewer
 */
export function executeReviewsEndpoint (request: OctokitRequest): OctokitResponse<MockedReview[]> {
  const id = parseInt(request.endpoint[4])
  const pr = mockedPullData.find(pr => pr.id === id)
  if (pr === undefined) {
    return {
      status: 404,
      data: []
    }
  }

  const reviews: MockedReview[] = pr.reviewAuthors.map(a => ({ reviewAuthor: a }))

  const perPage = request.params.get('per_page')
  const firstN = perPage === undefined ? reviews.length : parseInt(perPage)
  const endSlice = Math.max(Math.min(firstN, reviews.length), 0)
  return {
    status: 200,
    data: reviews.slice(0, endSlice)
  }
}
