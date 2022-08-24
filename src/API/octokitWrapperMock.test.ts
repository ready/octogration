import { OctokitWrapper } from './octokitWrapper'

// When the Github octokit package is mocked, it should act like in an action
jest.mock('@octokit/action', () => ({
  Octokit: jest.fn().mockImplementation(() => ({ request: jest.fn() }))
}))

describe('Octokit Wrapper class mocked', () => {
  test('octokit is not undefined', () => {
    const octokit = new OctokitWrapper()
    expect(octokit.octokit).not.toBe(undefined)
  })

  test('requests go to octokit in live mode', async () => {
    const octokit = new OctokitWrapper()
    await octokit.request('')
    expect(octokit.octokit?.request).toBeCalled()
  })
})
