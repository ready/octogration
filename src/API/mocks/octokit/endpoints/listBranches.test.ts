import { executeListBranchesEndpoint } from './listBranches'

describe('Mocked list branches endpoint', () => {
  test('setting protected to true yields only protected branches', () => {
    const response = executeListBranchesEndpoint({
      type: 'GET',
      endpoint: ['repos', 'ready', 'octogration', 'branches'],
      params: new Map([['protected', 'true']])
    })

    response.data.forEach(branch => {
      expect(branch.protected).toBe(true)
    })
  })

  test('setting protected to false yields only non protected branches', () => {
    const response = executeListBranchesEndpoint({
      type: 'GET',
      endpoint: ['repos', 'ready', 'octogration', 'branches'],
      params: new Map([['protected', 'false']])
    })

    response.data.forEach(branch => {
      expect(branch.protected).toBe(false)
    })
  })

  test('not setting protected yields all branches', () => {
    const protectedResponse = executeListBranchesEndpoint({
      type: 'GET',
      endpoint: ['repos', 'ready', 'octogration', 'branches'],
      params: new Map([['protected', 'true']])
    })
    const nonprotectedResponse = executeListBranchesEndpoint({
      type: 'GET',
      endpoint: ['repos', 'ready', 'octogration', 'branches'],
      params: new Map([['protected', 'false']])
    })
    const neitherResponse = executeListBranchesEndpoint({
      type: 'GET',
      endpoint: ['repos', 'ready', 'octogration', 'branches'],
      params: new Map<string, string>()
    })

    expect(protectedResponse.data.length + nonprotectedResponse.data.length).toBe(neitherResponse.data.length)
  })

  test('setting invalid protected yields all branches', () => {
    const protectedResponse = executeListBranchesEndpoint({
      type: 'GET',
      endpoint: ['repos', 'ready', 'octogration', 'branches'],
      params: new Map([['protected', 'true']])
    })
    const nonprotectedResponse = executeListBranchesEndpoint({
      type: 'GET',
      endpoint: ['repos', 'ready', 'octogration', 'branches'],
      params: new Map([['protected', 'false']])
    })
    const neitherResponse = executeListBranchesEndpoint({
      type: 'GET',
      endpoint: ['repos', 'ready', 'octogration', 'branches'],
      params: new Map([['protected', 'INVALID']])
    })

    expect(protectedResponse.data.length + nonprotectedResponse.data.length).toBe(neitherResponse.data.length)
  })
})
