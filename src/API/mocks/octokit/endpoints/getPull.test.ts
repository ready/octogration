import { mockOctokitRequest, OctokitRequest } from '../mockedOctokit'
import { executeGetPullEndpoint } from './getPull'

describe('Mocked get pull endpoint', () => {
  test('fails on invalid id', () => {
    const request: OctokitRequest = {
      type: 'GET',
      endpoint: ['repos', 'ready', 'octogration', 'pulls', '11111111'],
      params: new Map<string, string>()
    }
    const response = executeGetPullEndpoint(request)
    expect(response.status).toBe(404)
  })

  test('works on valid id', () => {
    const request: OctokitRequest = {
      type: 'GET',
      endpoint: ['repos', 'ready', 'octogration', 'pulls', '12'],
      params: new Map<string, string>()
    }
    const response = executeGetPullEndpoint(request)
    expect(response.status).toBe(200)
    expect(response.data?.head.ref).toBe('some-branch4')
  })

  test('able to find the endpoint path', () => {
    const request = 'GET /repos/ready/octogration/pulls/6'
    const response = mockOctokitRequest(request)
    expect(response.status).toBe(200)
    expect(response.data?.head.ref).toBe('some-branch2')
  })
})
