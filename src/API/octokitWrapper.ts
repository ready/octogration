import { Octokit } from '@octokit/action'
import { executeLive } from '../utils/executeLive'
import { mockOctokitRequest, OctokitResponse } from './mocks/octokit/mockedOctokit'

interface OctokitCaches {
  [request: string]: OctokitResponse<any>
}

/**
 * While running outside of a github action or during tests,
 * the live github API is not available.
 * This class automatically determines if the live data can be fetched
 * and provides mocked data if live data is impossible to get
 */
export class OctokitWrapper {
  octokit: Octokit | undefined
  caches: OctokitCaches

  constructor () {
    this.caches = {}
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
   * Caches responses so duplicate requests don't go to Github
   * @param request - The request to serve
   * @param data - a package of data to send with the request
   * The format of the data expected depends on the request endpoint
   * @returns live or mocked data
   */
  async request (request: string, data?: any): Promise<OctokitResponse<any>> {
    const cacheKey = request + JSON.stringify(data)

    if (cacheKey in this.caches) {
      return this.caches[cacheKey]
    }

    if (this.octokit === undefined) {
      this.caches[cacheKey] = mockOctokitRequest(request, data)
    } else {
      this.caches[cacheKey] = await this.octokit.request(request, data)
    }
    return this.caches[cacheKey]
  }

  resetCache (): void {
    this.caches = {}
  }
}
