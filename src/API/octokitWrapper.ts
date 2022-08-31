import { Octokit } from '@octokit/action'
import { executeLive } from '../utils/executeLive'
import { mockOctokitRequest, OctokitResponse } from './mocks/octokit/mockedOctokit'

/**
 * While running outside of a github action or during tests,
 * the live github API is not available.
 * This class automatically determines if the live data can be fetched
 * and provides mocked data if live data is impossible to get
 */
export class OctokitWrapper {
  octokit: Octokit | undefined

  constructor () {
    try {
      executeLive(() => {
        this.octokit = new Octokit()
      })
    } catch (e) {
      this.octokit = undefined
    }
  }

  /**
   * If the live github API is available, it sends the request
   * If not, it provides mocked data instead
   * @param request - The request to serve
   * @param data - a package of data to send with the request
   * The format of the data expected depends on the request endpoint
   * @returns live or mocked data
   */
  async request (request: string, data?: any): Promise<OctokitResponse<any>> {
    if (this.octokit === undefined) {
      return mockOctokitRequest(request, data)
    }
    return await this.octokit.request(request, data)
  }
}
