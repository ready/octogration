import { changelog } from './changelog'
import { testReleaseFormatParser } from './parsers/releaseFormatParser'
import { createRelease } from './utils/createRelease'
import { evaluateBadges } from './variables/badges'
import { evaluateBranch } from './variables/branch'
import { evaluateCommitLog } from './variables/commitLog'
import { evaluateDatetime } from './variables/dateTime'
import { evaluatePrBody } from './variables/prBody'
import { evaluatePrTitle } from './variables/prTitle'

test('Exits on invalid CLI parameters', async () => {
  process.argv = ['node', 'octogration', 'changelog']
  await changelog()
  expect(console.log).toBeCalled()
  expect(process.exit).toBeCalled()
  expect(createRelease).not.toBeCalled()
  expect(evaluateBadges).not.toBeCalled()
  expect(evaluateBranch).not.toBeCalled()
  expect(evaluateCommitLog).not.toBeCalled()
  expect(evaluateDatetime).not.toBeCalled()
  expect(evaluatePrBody).not.toBeCalled()
  expect(evaluatePrTitle).not.toBeCalled()
})

test('Works on valid CLI parameters', async () => {
  process.argv = ['node', 'octogration', 'changelog', '1']
  await changelog()
  expect(console.log).not.toBeCalled()
  expect(process.exit).not.toBeCalled()
  expect(createRelease).toBeCalled()
  expect(evaluateBadges).toBeCalled()
  expect(evaluateBranch).toBeCalled()
  expect(evaluateCommitLog).toBeCalled()
  expect(evaluateDatetime).toBeCalled()
  expect(evaluatePrBody).toBeCalled()
  expect(evaluatePrTitle).toBeCalled()
})

test('Works when evaluator errors', async () => {
  process.argv = ['node', 'octogration', 'changelog', '1']
  mockedExecutorError = true
  await changelog()
  expect(console.log).not.toBeCalled()
  expect(process.exit).not.toBeCalled()
  expect(console.error).toBeCalled()
})

// Mock executors
let mockedExecutorError = false
jest.mock('./utils/createRelease', () => ({ createRelease: jest.fn().mockImplementation(() => '') }))
jest.mock('./variables/badges', () => ({ evaluateBadges: jest.fn().mockImplementation(() => '') }))
jest.mock('./variables/branch', () => ({ evaluateBranch: jest.fn().mockImplementation(() => '') }))
jest.mock('./variables/commitLog', () => ({ evaluateCommitLog: jest.fn().mockImplementation(() => '') }))
jest.mock('./variables/dateTime', () => ({ evaluateDatetime: jest.fn().mockImplementation(() => '') }))
jest.mock('./variables/prBody', () => ({ evaluatePrBody: jest.fn().mockImplementation(() => '') }))
jest.mock('./variables/prTitle', () => ({
  evaluatePrTitle: jest.fn().mockImplementation(() => {
    if (mockedExecutorError) throw new Error('mocked error')
    return ''
  })
}))

// Mock console log & console log
let consoleLogSpy: jest.SpyInstance
let consoleErrorSpy: jest.SpyInstance
let processSpy: jest.SpyInstance
beforeAll(() => {
  consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  processSpy = jest.spyOn(process, 'exit').mockImplementation(_code => 0 as never)
})
afterAll(() => {
  consoleLogSpy.mockRestore()
  consoleErrorSpy.mockRestore()
  processSpy.mockRestore()
})
afterEach(() => {
  jest.clearAllMocks()
  testReleaseFormatParser.reset()
})
