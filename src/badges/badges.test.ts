import { updateBadges } from './badges'
import { prepareVersionBadge } from './preparers/versionBadge'
import { prepareTestsBadge } from './preparers/testsBadge'
import { prepareCoverageBadge } from './preparers/coverageBadge'
import { prepareVulnerabilitiesBadge } from './preparers/vulnerabilitiesBadge'
import { prepareNodeVersionBadge } from './preparers/nodeVersionBadge'
import { prepareNPMVersionBadge } from './preparers/npmVersionBadge'
import { prepareLinterBadge } from './preparers/linterBadge'
import { prepareDeprecationsBadge } from './preparers/deprecationsBadge'
import { prepareStaleBranchesBadge } from './preparers/staleBranchesBadge'
import { prepareNeglectedPrsBadge } from './preparers/neglectedPRsBadge'
import { prepareLastProdBadge } from './preparers/lastProdBadge'
import { preparePackageVersionBadge } from './preparers/packageVersionBadge'

test('Exits on invalid CLI parameters', async () => {
  process.argv = ['npx', 'octogration', 'badges', 'oh', 'hi']
  await expect(updateBadges).rejects.toThrowError('exited')
  expect(console.log).toBeCalled()
  expect(console.error).not.toBeCalled()
  expect(process.exit).toBeCalled()

  expect(prepareVersionBadge).not.toBeCalled()
  expect(prepareTestsBadge).not.toBeCalled()
  expect(prepareCoverageBadge).not.toBeCalled()
  expect(prepareVulnerabilitiesBadge).not.toBeCalled()
  expect(prepareNodeVersionBadge).not.toBeCalled()
  expect(prepareNPMVersionBadge).not.toBeCalled()
  expect(prepareLinterBadge).not.toBeCalled()
  expect(prepareDeprecationsBadge).not.toBeCalled()
  expect(prepareStaleBranchesBadge).not.toBeCalled()
  expect(prepareNeglectedPrsBadge).not.toBeCalled()
  expect(prepareLastProdBadge).not.toBeCalled()
  expect(preparePackageVersionBadge).not.toBeCalled()
})

test('Calls all preparers when there is no list', async () => {
  process.argv = ['npx', 'octogration', 'badges']
  await updateBadges()
  expect(console.log).not.toBeCalled()
  expect(console.error).not.toBeCalled()
  expect(process.exit).not.toBeCalled()

  expect(prepareVersionBadge).toBeCalled()
  expect(prepareTestsBadge).toBeCalled()
  expect(prepareCoverageBadge).toBeCalled()
  expect(prepareVulnerabilitiesBadge).toBeCalled()
  expect(prepareNodeVersionBadge).toBeCalled()
  expect(prepareNPMVersionBadge).toBeCalled()
  expect(prepareLinterBadge).toBeCalled()
  expect(prepareDeprecationsBadge).toBeCalled()
  expect(prepareStaleBranchesBadge).toBeCalled()
  expect(prepareNeglectedPrsBadge).toBeCalled()
  expect(prepareLastProdBadge).toBeCalled()
  expect(preparePackageVersionBadge).toBeCalled()
})

test('Calls some preparers when there is a list', async () => {
  process.argv = ['npx', 'octogration', 'badges', 'tests,coverage,linter,version']
  await updateBadges()
  expect(console.log).not.toBeCalled()
  expect(console.error).not.toBeCalled()
  expect(process.exit).not.toBeCalled()

  expect(prepareVersionBadge).toBeCalled()
  expect(prepareTestsBadge).toBeCalled()
  expect(prepareCoverageBadge).toBeCalled()
  expect(prepareLinterBadge).toBeCalled()
  expect(preparePackageVersionBadge).toBeCalled()

  expect(prepareVulnerabilitiesBadge).not.toBeCalled()
  expect(prepareNodeVersionBadge).not.toBeCalled()
  expect(prepareNPMVersionBadge).not.toBeCalled()
  expect(prepareDeprecationsBadge).not.toBeCalled()
  expect(prepareStaleBranchesBadge).not.toBeCalled()
  expect(prepareNeglectedPrsBadge).not.toBeCalled()
  expect(prepareLastProdBadge).not.toBeCalled()
})

test('Works when invalid badge in list', async () => {
  process.argv = ['npx', 'octogration', 'badges', 'MOCKED']
  await expect(updateBadges).rejects.toThrowError('exited')
  expect(console.log).toBeCalled()
  expect(console.error).not.toBeCalled()
  expect(process.exit).toBeCalled()

  expect(prepareVersionBadge).not.toBeCalled()
  expect(prepareTestsBadge).not.toBeCalled()
  expect(prepareCoverageBadge).not.toBeCalled()
  expect(prepareVulnerabilitiesBadge).not.toBeCalled()
  expect(prepareNodeVersionBadge).not.toBeCalled()
  expect(prepareNPMVersionBadge).not.toBeCalled()
  expect(prepareLinterBadge).not.toBeCalled()
  expect(prepareDeprecationsBadge).not.toBeCalled()
  expect(prepareStaleBranchesBadge).not.toBeCalled()
  expect(prepareNeglectedPrsBadge).not.toBeCalled()
  expect(prepareLastProdBadge).not.toBeCalled()
  expect(preparePackageVersionBadge).not.toBeCalled()
})

test('Works when evaluator error', async () => {
  process.argv = ['npx', 'octogration', 'badges']
  mockedExecutorError = true
  await updateBadges()
  expect(console.log).not.toBeCalled()
  expect(console.error).toBeCalled()
  expect(process.exit).not.toBeCalled()
})

// Mock executors
let mockedExecutorError = false
jest.mock('./preparers/versionBadge', () => ({ prepareVersionBadge: jest.fn().mockImplementation(() => '') }))
jest.mock('./preparers/testsBadge', () => ({ prepareTestsBadge: jest.fn().mockImplementation(() => '') }))
jest.mock('./preparers/coverageBadge', () => ({ prepareCoverageBadge: jest.fn().mockImplementation(() => '') }))
jest.mock('./preparers/vulnerabilitiesBadge', () => ({ prepareVulnerabilitiesBadge: jest.fn().mockImplementation(() => '') }))
jest.mock('./preparers/nodeVersionBadge', () => ({ prepareNodeVersionBadge: jest.fn().mockImplementation(() => '') }))
jest.mock('./preparers/npmVersionBadge', () => ({ prepareNPMVersionBadge: jest.fn().mockImplementation(() => '') }))
jest.mock('./preparers/linterBadge', () => ({ prepareLinterBadge: jest.fn().mockImplementation(() => '') }))
jest.mock('./preparers/deprecationsBadge', () => ({ prepareDeprecationsBadge: jest.fn().mockImplementation(() => '') }))
jest.mock('./preparers/staleBranchesBadge', () => ({ prepareStaleBranchesBadge: jest.fn().mockImplementation(() => '') }))
jest.mock('./preparers/neglectedPRsBadge', () => ({ prepareNeglectedPrsBadge: jest.fn().mockImplementation(() => '') }))
jest.mock('./preparers/packageVersionBadge', () => ({ preparePackageVersionBadge: jest.fn().mockImplementation(() => '') }))
jest.mock('./preparers/lastProdBadge', () => ({
  prepareLastProdBadge: jest.fn().mockImplementation(() => {
    if (mockedExecutorError) throw new Error('mocked error')
    return ''
  })
}))

// Mock console log & console error
let consoleLogSpy: jest.SpyInstance
let consoleErrorSpy: jest.SpyInstance
let processSpy: jest.SpyInstance
beforeAll(() => {
  consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  processSpy = jest.spyOn(process, 'exit').mockImplementation(_code => { throw new Error('exited') })
})
afterAll(() => {
  consoleLogSpy.mockRestore()
  consoleErrorSpy.mockRestore()
  processSpy.mockRestore()
})
afterEach(() => {
  jest.clearAllMocks()
})

// Mock file system
jest.mock('fs', () => ({
  readFileSync: jest.fn().mockImplementation((cmd: string) => {
    if (cmd === 'README.md') {
      return {
        toString: () => `
          <img alt="version" src="" />
          <img alt="tests" src="" />
          <img alt="coverage" src="" />
          <img alt="vulnerabilities" src="" />
          <img alt="nodeVersion" src="" />
          <img alt="npmVersion" src="" />
          <img alt="linter" src="" />
          <img alt="deprecations" src="" />
          <img alt="staleBranches" src="" />
          <img alt="neglectedPrs" src="" />
          <img alt="lastProd" src="" />
          <img alt="packageVersion" src="" />
        `
      }
    }
    if (cmd === 'package.json') {
      return {
        toString: () => '{"devDependencies":{"package":"^1.2.3"}}'
      }
    }
    throw new Error('Unexpected file')
  }),
  writeFileSync: jest.fn().mockImplementation((cmd: string, content: string) => {
    if (cmd !== 'README.md') {
      throw new Error('Unexpected file')
    }
  })
}))
