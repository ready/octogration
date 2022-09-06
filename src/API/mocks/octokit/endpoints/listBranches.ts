import { OctokitResponse, OctokitRequest } from '../mockedOctokit'

export interface MockedBranch {
  name: string
  protected: boolean
}

export const mockedBranchData: MockedBranch[] = [
  {
    name: 'main',
    protected: true
  }, {
    name: 'stage',
    protected: true
  }, {
    name: 'prod',
    protected: true
  }, {
    name: 'river/test',
    protected: false
  }, {
    name: 'river/dev',
    protected: false
  }
]

/**
 * Mocks the octokit list branches API
 * @param request - the Octokit request; valid parameters are:
 * - protected: true or false
 * @returns an array of branches that match the search parameters; fields are:
 * - name: the name of the branch, may contain /
 * - protected: true or false if the branch is protected
 */
export function executeListBranchesEndpoint (request: OctokitRequest): OctokitResponse<MockedBranch[]> {
  const isProtected = boolString(request.params.get('protected'))
  const protectedFiltered = mockedBranchData.filter(pr => isProtected === undefined || pr.protected === isProtected)

  return {
    status: 200,
    data: protectedFiltered
  }
}

/**
 * @param bool - a string to check for booleanness
 * @returns true or false if the boolean matches those strings
 * may also return undefined if the string is undefined or not boolean
 */
function boolString (bool: string | undefined): boolean | undefined {
  if (bool === 'true') return true
  if (bool === 'false') return false
  return undefined
}

export const testListBranches = {
  addBranchRequest: (pr: MockedBranch) => mockedBranchData.push(pr)
}
