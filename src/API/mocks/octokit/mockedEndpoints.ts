import { executeListBranchesEndpoint } from './endpoints/listBranches'
import { executeCommitsEndpoint } from './endpoints/commits'
import { executePullsEndpoint } from './endpoints/pulls'
import { OctokitResponse, OctokitRequest } from './mockedOctokit'

type EndpointExecutor = (request: OctokitRequest) => OctokitResponse<any>

const endpointExecutors = new Map<string, EndpointExecutor>()
endpointExecutors.set('repos/<org>/<repo>/commits', executeCommitsEndpoint)
endpointExecutors.set('repos/<org>/<repo>/pulls', executePullsEndpoint)
endpointExecutors.set('repos/<org>/<repo>/pulls/###/reviews', executePullsEndpoint)
endpointExecutors.set('repos/<org>/<repo>/branches', executeListBranchesEndpoint)
endpointExecutors.set('repos/<org>/<repo>/branches/<^>', executePullsEndpoint)

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
  const lastPathStep = path[path.length - 1]
  if (lastPathStep !== '<^>' && path.length !== endpoint.length) return false

  return endpoint.every((endStep, index) => {
    const pathStep = index >= path.length ? lastPathStep : path[index]
    return isMatchingStep(pathStep, endStep)
  })
}

/**
 * Checks if the endpoint step matches the rules defined by the path step
 * @param pathStep - a literal string, <str> (any string), ### (any number), or <^> (remaining steps)
 * @param endpointStep - the string to check against the path rule
 * @returns true if the endpointStep is a match
 */
function isMatchingStep (pathStep: string, endpointStep: string): boolean {
  if (pathStep === '<^>') return true
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
