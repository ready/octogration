import { findEndpointExecutor } from './mockedEndpoints'

/**
 * An octokit request is formatted as
 * <type> /<...endpoint>?<params.key?>=<params.value?>...
 * Example:
 * GET /repos/ready/octogration/pulls?per_page=100
 */
export interface OctokitRequest {
  type: 'GET' | 'POST'
  endpoint: string[]
  params: Map<string, string>
  data?: any
}

export interface OctokitResponse<T> {
  status: number
  data: T
}

/**
 * Mocks any given request to the Octokit API
 * @param request - an Octokit API request
 * @returns mocked data or throws an error if the operation couldn't be completed
 */
export function mockOctokitRequest (request: string, data?: any): OctokitResponse<any> {
  const parsedRequest = parseOctokitRequest(request)
  const executor = findEndpointExecutor(parsedRequest)
  return executor({ ...parsedRequest, data })
}

/**
 * Parses a string verion of an Octokit request into its core components
 * Expects the request format to look like this example:
 * GET /repos/ready/octogration/pulls?per_page=100
 * @param request - the string version of the request
 * @returns the parsed request
 */
function parseOctokitRequest (request: string): OctokitRequest {
  const fields = request.split(' ')
  if (fields.length !== 2) {
    throw new Error(`Mocked octokit request "${request}" does not have a single space`)
  }

  const type = fields[0]
  if (type !== 'GET' && type !== 'POST') {
    throw new Error(`Mocked octokit request "${request}" type is not GET or POST`)
  }

  const urlFields = fields[1].split('?')
  if (urlFields.length > 2) {
    throw new Error(`Mocked octokit request "${request}" has too many question marks`)
  }

  const rawEndpoint = urlFields[0]
  const endpoint = rawEndpoint.split('/').filter(e => e.trim() !== '')
  const params = new Map<string, string>()

  if (urlFields.length === 1) {
    return {
      type,
      endpoint,
      params
    }
  }

  const paramList = urlFields[1].split('&')
  paramList.forEach(p => {
    const keyValue = p.split('=')
    if (keyValue.length !== 2) {
      throw new Error(`Mocked octokit request "${request}" has parameter "${p}" malformatted key=value`)
    }

    if (keyValue[0].trim() === '') {
      throw new Error(`Mocked octokit request "${request}" has parameter "${p}" missing key`)
    }

    if (keyValue[1].trim() === '') {
      throw new Error(`Mocked octokit request "${request}" has parameter "${p}" missing value`)
    }

    params.set(keyValue[0], keyValue[1])
  })

  return {
    type,
    endpoint,
    params
  }
}

export const testMockedOctokit = {
  parseOctokitRequest
}
