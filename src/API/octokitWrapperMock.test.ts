import { OctokitWrapper } from './octokitWrapper'

// When the Github octokit package is mocked, it should act like in an action
jest.mock('@octokit/action', () => ({
  Octokit: jest.fn().mockImplementation(() => ({ request: jest.fn() }))
}))

describe('Octokit Wrapper class mocked', () => {
  test('octokit is not undefined', () => {
    // Need to change the environment so the live executor will let our mocked octokit through
    process.env.NODE_ENV = '~MOCKED~'
    const octokit = new OctokitWrapper()
    expect(octokit.octokit).not.toBe(undefined)
    process.env.NODE_ENV = 'test'
  })

  test('requests go to octokit in live mode', async () => {
    process.env.NODE_ENV = '~MOCKED~'
    const octokit = new OctokitWrapper()
    await octokit.request('')
    expect(octokit.octokit?.request).toBeCalled()
    process.env.NODE_ENV = 'test'
  })
})
