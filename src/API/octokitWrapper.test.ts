import { OctokitWrapper } from './octokitWrapper'
import { mockOctokitRequest } from './mocks/octokit/mockedOctokit'

jest.mock('./mocks/octokit/mockedOctokit', () => ({
  mockOctokitRequest: jest.fn()
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
})
