import { createRelease } from './createRelease'

test('Create release works on valid body', async () => {
  mockedChangelogTitle = 'valid title'
  await createRelease('this is a valid body')
  expect(console.error).not.toBeCalled()
})

test('Create release fails on invalid body', async () => {
  mockedChangelogTitle = 10
  await createRelease('this is a valid body')
  expect(console.error).toBeCalled()
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

// Mock console log
let consoleLogSpy: jest.SpyInstance
beforeAll(() => {
  consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
})
afterAll(() => {
  consoleLogSpy.mockRestore()
})
afterEach(() => {
  consoleLogSpy.mockClear()
})

// We want the changelog to fail when we return a number as the title
let mockedChangelogTitle: string | number
jest.mock('./changelogTitle', () => ({
  createChangelogTitle: () => mockedChangelogTitle
}))
