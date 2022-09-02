import { OctokitWrapper } from './octokitWrapper'
import { mockOctokitRequest } from './mocks/octokit/mockedOctokit'

jest.mock('./mocks/octokit/mockedOctokit', () => ({
  mockOctokitRequest: jest.fn().mockImplementation(async (request, data) => {
    return {
      status: 200,
      data: 'mocked response'
    }
  })
}))

afterEach(() => {
  jest.clearAllMocks()
})

// To ensure that these tests work even inside of a github action
// We force octokit to fail as it does outside of a github action
jest.mock('@octokit/action', () => ({
  Octokit: jest.fn().mockImplementation(() => { throw new Error('Not in github action') })
}))

describe('Octokit Wrapper class unmocked', () => {
  test('keeps octokit undefined in test mode', () => {
    const octokit = new OctokitWrapper()
    expect(octokit.octokit).toBe(undefined)
  })

  test('calls mocked request executor in test mode', async () => {
    const octokit = new OctokitWrapper()
    await octokit.request('')
    expect(mockOctokitRequest).toBeCalled()
  })

  test('calls are cached with undefined data', async () => {
    const octokit = new OctokitWrapper()
    const response1 = await octokit.request('GET /repos/mocked/endpoint')
    const response2 = await octokit.request('GET /repos/mocked/endpoint')
    const response3 = await octokit.request('GET /repos/mocked/endpoint')
    expect(response1).toEqual(response2)
    expect(response2).toEqual(response3)

    expect(mockOctokitRequest).toBeCalledTimes(1)
  })

  test('calls are cached with numeric data', async () => {
    const octokit = new OctokitWrapper()
    const response1 = await octokit.request('GET /repos/mocked/endpoint', 11)
    const response2 = await octokit.request('GET /repos/mocked/endpoint', 11)
    const response3 = await octokit.request('GET /repos/mocked/endpoint', 11)
    expect(response1).toEqual(response2)
    expect(response2).toEqual(response3)

    expect(mockOctokitRequest).toBeCalledTimes(1)
  })

  test('calls are cached with string data', async () => {
    const octokit = new OctokitWrapper()
    const response1 = await octokit.request('GET /repos/mocked/endpoint', 'data')
    const response2 = await octokit.request('GET /repos/mocked/endpoint', 'data')
    const response3 = await octokit.request('GET /repos/mocked/endpoint', 'data')
    expect(response1).toEqual(response2)
    expect(response2).toEqual(response3)

    expect(mockOctokitRequest).toBeCalledTimes(1)
  })

  test('calls are cached with boolean data', async () => {
    const octokit = new OctokitWrapper()
    const response1 = await octokit.request('GET /repos/mocked/endpoint', true)
    const response2 = await octokit.request('GET /repos/mocked/endpoint', true)
    const response3 = await octokit.request('GET /repos/mocked/endpoint', true)
    expect(response1).toEqual(response2)
    expect(response2).toEqual(response3)

    expect(mockOctokitRequest).toBeCalledTimes(1)
  })

  test('calls are cached with null data', async () => {
    const octokit = new OctokitWrapper()
    const response1 = await octokit.request('GET /repos/mocked/endpoint', null)
    const response2 = await octokit.request('GET /repos/mocked/endpoint', null)
    const response3 = await octokit.request('GET /repos/mocked/endpoint', null)
    expect(response1).toEqual(response2)
    expect(response2).toEqual(response3)

    expect(mockOctokitRequest).toBeCalledTimes(1)
  })

  test('calls are cached with undefined data', async () => {
    const octokit = new OctokitWrapper()
    const response1 = await octokit.request('GET /repos/mocked/endpoint', { field: 'val' })
    const response2 = await octokit.request('GET /repos/mocked/endpoint', { field: 'val' })
    const response3 = await octokit.request('GET /repos/mocked/endpoint', { field: 'val' })
    expect(response1).toEqual(response2)
    expect(response2).toEqual(response3)

    expect(mockOctokitRequest).toBeCalledTimes(1)
  })

  test('calls are not cached with different data', async () => {
    const octokit = new OctokitWrapper()
    await octokit.request('GET /repos/mocked/endpoint', { field1: 'val' })
    await octokit.request('GET /repos/mocked/endpoint', { field2: 'val' })
    await octokit.request('GET /repos/mocked/endpoint', { field3: 'val' })

    expect(mockOctokitRequest).toBeCalledTimes(3)
  })

  test('calls are not cached with different endpoints', async () => {
    const octokit = new OctokitWrapper()
    await octokit.request('GET /repos/mocked/endpoint1', { field: 'val' })
    await octokit.request('GET /repos/mocked/endpoint2', { field: 'val' })
    await octokit.request('GET /repos/mocked/endpoint3', { field: 'val' })

    expect(mockOctokitRequest).toBeCalledTimes(3)
  })
})
