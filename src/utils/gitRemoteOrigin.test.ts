import { execSync } from 'child_process'
import { getGitRemoteURL, testGitRemoteOrigin } from './gitRemoteOrigin'
const { retrieveGitRemoteURL } = testGitRemoteOrigin

// Mocking the child process for efficency and consistency
// The remote command returns different outputs depending on
// if run on a local machine or inside of a github action
enum ProcessOutput {
  Local = 'origin\tgit@github.com:ready/octogration.git (fetch)\norigin\tgit@github.com:ready/octogration.git (push)',
  Github = 'origin\thttps://github.com/ready/octogration (fetch)\norigin\thttps://github.com/ready/octogration (push)',
  NoTab = 'thisoutputhasnotab',
  MultiTab = 'this\toutput\thas\ttabs',
  NoSpace = 'this\toutputhasnospaces',
  MultiSpace = 'this\toutput has too many spaces'
}

let mockedOutput = ProcessOutput.Local
jest.mock('child_process', () => ({
  execSync: jest.fn().mockImplementation((cmd: string) => {
    if (cmd !== 'git remote -v') {
      throw new Error('Unexpected command')
    }

    return {
      toString: () => mockedOutput
    }
  })
}))

describe('Get git remote origin', () => {
  test('calling multiple times only spawns one process', () => {
    getGitRemoteURL()
    getGitRemoteURL()
    getGitRemoteURL()
    expect(execSync).toBeCalledTimes(1)
  })
})

describe('Retrieve git remote origin', () => {
  const expectedOutput = 'https://github.com/ready/octogration'

  test('local output suceeds', () => {
    mockedOutput = ProcessOutput.Local
    const output = retrieveGitRemoteURL()
    expect(output).toBe(expectedOutput)
  })

  test('github output suceeds', () => {
    mockedOutput = ProcessOutput.Github
    const output = retrieveGitRemoteURL()
    expect(output).toBe(expectedOutput)
  })

  test('no tab output fails', () => {
    mockedOutput = ProcessOutput.NoTab
    expect(retrieveGitRemoteURL).toThrowError('git origin fields malformatted')
  })

  test('multi tab output fails', () => {
    mockedOutput = ProcessOutput.MultiTab
    expect(retrieveGitRemoteURL).toThrowError('git origin fields malformatted')
  })

  test('no space output fails', () => {
    mockedOutput = ProcessOutput.NoSpace
    expect(retrieveGitRemoteURL).toThrowError('git fetch fields malformatted')
  })

  test('multi space output fails', () => {
    mockedOutput = ProcessOutput.MultiSpace
    expect(retrieveGitRemoteURL).toThrowError('git fetch fields malformatted')
  })
})
