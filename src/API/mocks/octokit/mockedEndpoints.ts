import { executeCommitsEndpoint } from './endpoints/commits'
import { OctokitResponse, OctokitRequest } from './mockedOctokit'

type EndpointExecutor = (request: OctokitRequest) => OctokitResponse<any>

const endpointExecutors = new Map<string, EndpointExecutor>()
endpointExecutors.set('repos/<org>/<repo>/commits', executeCommitsEndpoint)

/**
 * Searches the known endpoints to find the executor for a request
 * @param request - the parsed request to find the endpoint with
 * @returns the endpoint executor
 */
export function findEndpointExecutor (request: OctokitRequest): EndpointExecutor {
  const identifiers = [...endpointExecutors.keys()]
  const matchingIdentifier = identifiers.find(i => isMatchingEndpoint(i, request.endpoint))
  if (matchingIdentifier === undefined) {
    throw new Error(`The endpoint ${request.endpoint.join('/')} does not match any known endpoint`)
  }

  const executor = endpointExecutors.get(matchingIdentifier)
  if (executor === undefined) {
    throw new Error(`The endpoint ${request.endpoint.join('/')} could not be located`)
  }

  return executor
}

/**
 * Checks if a given endpoint matches the endpoint identifier
 * @param identifier - an endpoint ruleset to check against
 * @param endpoint - the endpoint to test
 * @returns true if the endpoint matches the rules
 */
function isMatchingEndpoint (identifier: string, endpoint: string[]): boolean {
  const path = identifier.split('/')
  if (path.length !== endpoint.length) return false

  return path.every((pathStep, index) => isMatchingStep(pathStep, endpoint[index]))
}

/**
 * Checks if the endpoint step matches the rules defined by the path step
 * @param pathStep - a literal string, <str> (any string), or ### (any number)
 * @param endpointStep - the string to check against the path rule
 * @returns true if the endpointStep is a match
 */
function isMatchingStep (pathStep: string, endpointStep: string): boolean {
  if (pathStep.startsWith('<') && pathStep.endsWith('>')) return true
  if (pathStep === '###') {
    const numericStep = parseInt(endpointStep)
    if (isNaN(numericStep)) return false
    return numericStep.toString() === endpointStep
  }

  return pathStep === endpointStep
}

export const testMockedEndpoints = {
  isMatchingEndpoint,
  isMatchingStep
}
