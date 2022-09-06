import { OctokitResponse, OctokitRequest } from '../mockedOctokit'

export interface MockedBranchData {
  name: string
  commit: {
    commit: {
      date: string
    }
  }
}

export const mockedBranchData: MockedBranchData[] = [
  {
    name: 'main',
    date: (new Date('8/22/22')).toISOString()
  }, {
    name: 'stage',
    date: (new Date('8/22/22')).toISOString()
  }, {
    name: 'prod',
    date: (new Date('8/22/22')).toISOString()
  }, {
    name: 'river/test',
    date: (new Date(Date.now() - 24 * 3600 * 1000)).toISOString()
  }, {
    name: 'river/dev',
    date: (new Date(Date.now() - 24 * 3600 * 1000 * 2)).toISOString()
  }
].map(b => ({ name: b.name, commit: { commit: { date: b.date } } }))

/**
 * Mocks the octokit branch API
 * @param request - the Octokit request; there are no valid parameters
 * @returns an array of branches that match the search parameters; fields are:
 * - name: the name of the branch, may contain /
 * - commit.commit.date: the date of the most recent commit on the branch
 */
export function executeBranchEndpoint (request: OctokitRequest): OctokitResponse<MockedBranchData | undefined> {
  const endpointPath = request.endpoint.join('/')
  if (request.endpoint.length <= 4) {
    throw new Error(`Branch endpoint "${endpointPath}" is missing branch name`)
  }

  const branchName = request.endpoint.slice(4).join('/')
  const branch = mockedBranchData.find(b => b.name === branchName)

  if (branch === undefined) {
    return {
      status: 404,
      data: undefined
    }
  }

  return {
    status: 200,
    data: branch
  }
}

export const testBranches = {
  addBranchRequest: (pr: MockedBranchData) => mockedBranchData.push(pr)
}
