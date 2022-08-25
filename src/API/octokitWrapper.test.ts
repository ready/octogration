import { OctokitWrapper } from './octokitWrapper'
import { mockOctokitRequest } from './mocks/octokit/mockedOctokit'

jest.mock('./mocks/octokit/mockedOctokit', () => ({
  mockOctokitRequest: jest.fn()
}))

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
})
