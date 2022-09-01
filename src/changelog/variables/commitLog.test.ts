import { evaluateCommitLog } from './commitLog'
import { testCommitParser } from '../parsers/commitParser'

describe('Commit log with sections', () => {
  test('does not have unused section header', async () => {
    const commitLog = await evaluateCommitLog()
    expect(commitLog.includes('# Bug Fixes')).toBe(false)
    expect(commitLog.includes('# Tests')).toBe(false)
    expect(commitLog.includes('# Meta')).toBe(false)
    expect(console.log).not.toBeCalled()
  })

  test('does have used section headers', async () => {
    const commitLog = await evaluateCommitLog()
    expect(commitLog.includes('# Features')).toBe(true)
    expect(commitLog.includes('# Cleaning')).toBe(true)
    expect(console.log).not.toBeCalled()
  })

  test('does not have chore or typos', async () => {
    const commitLog = await evaluateCommitLog()
    expect(commitLog.includes('<b>chore</b>')).toBe(false)
    expect(commitLog.includes('<b>typo</b>')).toBe(false)
    expect(console.log).not.toBeCalled()
  })

  test('empty on no used commits', async () => {
    mockedRawCommits = [
      '0c5b13f5b038e4d8c3d2fb6439680e548f47273f riverliway@gmail.com chore: this is a mock commit',
      'ca505ed9ef2bbeafd7ef15c22d0b6f7ba63a6194 riverliway@gmail.com chore: this is another mock commit',
      'd9981a24dc470401f9fce814bbd1bbb70efb1080 riverliway@gmail.com chore: this is the last mock commit',
      'd777f320a1c818eb07847d474723e2c30fb90e01 riverliway@gmail.com typo(mockscope): mocked typo commit'
    ]
    const commitLog = await evaluateCommitLog()
    expect(commitLog).toBe('')
    expect(console.log).toBeCalledWith('Skipping: No significant changes have been added to this release')
    expect(process.exit).toBeCalled()
  })
})

describe('Commit log without sections', () => {
  test('does not have section headers', async () => {
    mockedRawCommits = [
      'd777f320a1c818eb07847d474723e2c30fb90e01 riverliway@gmail.com feat(#1): mocked feature commit',
      'dafed8ea28de9706d3f9d68195a3d3711e5c9970 riverliway@gmail.com feat(#2): mocked feature commit',
      'c96870a1e925de3755fdd01811dd81db464a28d8 riverliway@gmail.com feat(#3): mocked feature commit',
      'a4ef2cc53d993f5e03cf0be8237d2cfc21d09240 riverliway@gmail.com feat(): mocked empty scope feature commit',
      'aa90c29f92b29c8f2ba900ba3cebbeca12d1076b riverliway@gmail.com feat: mocked emptier scope feature commit',
      'd777f320a1c818eb07847d474723e2c30fb90e01 riverliway@gmail.com typo(mockscope): mocked typo commit',
      '7332bb22234e84c735dcda62d007811e2acbe798 riverliway@gmail.com style((parenscope)): double parens',
      '0c5b13f5b038e4d8c3d2fb6439680e548f47273f riverliway@gmail.com chore: this is a mock commit',
      'ca505ed9ef2bbeafd7ef15c22d0b6f7ba63a6194 riverliway@gmail.com chore: this is another mock commit',
      'd9981a24dc470401f9fce814bbd1bbb70efb1080 riverliway@gmail.com chore: this is the last mock commit',
      'b569e67f71744d08669e62c4c85ec7c821272f5b riverliway@gmail.com v0.0.1'
    ]
    mockedCommitSections = false
    const commitLog = await evaluateCommitLog()
    expect(commitLog.includes('# ')).toBe(false)
  })
})

// Mock remote URL for speed and consistency
jest.mock('../../utils/gitRemoteOrigin', () => ({
  getGitRemoteURL: () => 'https://github.com/ready/octogration'
}))

// Mock raw commits for speed and consistency
let mockedRawCommits = [
  'd777f320a1c818eb07847d474723e2c30fb90e01 riverliway@gmail.com feat(#1): mocked feature commit',
  'dafed8ea28de9706d3f9d68195a3d3711e5c9970 riverliway@gmail.com feat(#2): mocked feature commit',
  'c96870a1e925de3755fdd01811dd81db464a28d8 riverliway@gmail.com feat(#3): mocked feature commit',
  'a4ef2cc53d993f5e03cf0be8237d2cfc21d09240 riverliway@gmail.com feat(): mocked empty scope feature commit',
  'aa90c29f92b29c8f2ba900ba3cebbeca12d1076b riverliway@gmail.com feat: mocked emptier scope feature commit',
  'd777f320a1c818eb07847d474723e2c30fb90e01 riverliway@gmail.com typo(mockscope): mocked typo commit',
  '7332bb22234e84c735dcda62d007811e2acbe798 riverliway@gmail.com style((parenscope)): double parens',
  '0c5b13f5b038e4d8c3d2fb6439680e548f47273f riverliway@gmail.com chore: this is a mock commit',
  'ca505ed9ef2bbeafd7ef15c22d0b6f7ba63a6194 riverliway@gmail.com chore: this is another mock commit',
  'd9981a24dc470401f9fce814bbd1bbb70efb1080 riverliway@gmail.com chore: this is the last mock commit',
  'b569e67f71744d08669e62c4c85ec7c821272f5b riverliway@gmail.com v0.0.1'
]

jest.mock('../../API/CLI/gitLog', () => ({
  retrieveRawCommits: () => mockedRawCommits
}))

// To make sure the mocked raw commits get updated
// we need to reset the cached parsed commits
afterEach(() => {
  testCommitParser.reset()
})

// Mock package config
let mockedCommitSections: boolean | { [type: string]: string[] } = {
  Features: ['feat', 'perf'],
  'Bug Fixes': ['fix'],
  Cleaning: ['docs', 'style', 'refact'],
  Tests: ['test'],
  Meta: ['ci', 'build']
}
jest.mock('../../utils/packageJson', () => ({
  getPackageJson: () => ({
    config: {
      commitSections: mockedCommitSections
    }
  })
}))

// Mock console log
let consoleSpy: jest.SpyInstance
beforeAll(() => {
  consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
})
afterAll(() => {
  consoleSpy.mockRestore()
})
afterEach(() => {
  consoleSpy.mockClear()
})

// Mock process exit
let processSpy: jest.SpyInstance
beforeAll(() => {
  processSpy = jest.spyOn(process, 'exit').mockImplementation(_code => 0 as never)
})
afterAll(() => {
  processSpy.mockRestore()
})
afterEach(() => {
  processSpy.mockClear()
})
