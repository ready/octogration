import { executeCommitsEndpoint } from './endpoints/commits'
import { MockedOctokitResponse, OctokitRequest } from './mockedOctokit'

type EndpointExecutor = (request: OctokitRequest) => MockedOctokitResponse<any>

const endpointExecutors = new Map<string, EndpointExecutor>()
endpointExecutors.set('repos/<org>/<repo>/commits', executeCommitsEndpoint)

export function getEndpointExecutor (request: OctokitRequest): EndpointExecutor {
  return executeCommitsEndpoint
}
