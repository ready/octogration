import { getGithubUserInfo, getRepo } from './getGithubInfo'

test('Get github avatar for River', async () => {
  const info = await getGithubUserInfo('riverliway@gmail.com')
  expect(info.username).toBe('riverliway')
  expect(info.avatar).toBe('https://avatars.githubusercontent.com/u/82117023?s=200&v=4')
  expect(console.error).not.toBeCalled()
})

test('Get github avatar for invalid user', async () => {
  const info = await getGithubUserInfo('notrealemail@notrealurl.com')
  expect(info.username).toBe('ready')
  expect(info.avatar).toBe('https://avatars.githubusercontent.com/u/63874247?s=200&v=4')
  expect(console.error).toBeCalled()
})

test('Get repo works', () => {
  const repo = getRepo()
  expect(repo).toBe('ready/octogration')
})

test('Get repo fails on bad origin', () => {
  mockedGithubOrigin = 'this is a bad origin'
  expect(getRepo).toThrowError('Malformed URL "this is a bad origin" does not begin with "https://github.com/"')
})

// Mock console error
let consoleSpy: jest.SpyInstance
beforeAll(() => {
  consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
})
afterAll(() => {
  consoleSpy.mockRestore()
})
afterEach(() => {
  consoleSpy.mockClear()
})

let mockedGithubOrigin = 'https://github.com/ready/octogration'
jest.mock('../../utils/gitRemoteOrigin', () => ({
  getGitRemoteURL: () => mockedGithubOrigin
}))
