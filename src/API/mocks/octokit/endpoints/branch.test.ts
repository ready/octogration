import { executeBranchEndpoint } from './branch'

describe('Mocked branch endpoint', () => {
  test('fails on missing branch name', () => {
    expect(() => executeBranchEndpoint({
      type: 'GET',
      endpoint: ['repos', 'ready', 'octogration', 'branches'],
      params: new Map<string, string>()
    })).toThrowError('Branch endpoint "repos/ready/octogration/branches" is missing branch name')
  })

  test('returns 404 when branch not found', () => {
    const response = executeBranchEndpoint({
      type: 'GET',
      endpoint: ['repos', 'ready', 'octogration', 'branches', 'invalid branch name'],
      params: new Map<string, string>()
    })

    expect(response.status).toBe(404)
  })

  test('returns branch on single token name', () => {
    const response = executeBranchEndpoint({
      type: 'GET',
      endpoint: ['repos', 'ready', 'octogration', 'branches', 'main'],
      params: new Map<string, string>()
    })

    expect(response.data?.name).toBe('main')
  })

  test('returns branch on multi token name', () => {
    const response = executeBranchEndpoint({
      type: 'GET',
      endpoint: ['repos', 'ready', 'octogration', 'branches', 'river', 'test'],
      params: new Map<string, string>()
    })

    expect(response.data?.name).toBe('river/test')
  })
})
