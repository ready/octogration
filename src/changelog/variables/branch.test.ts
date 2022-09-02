import { evaluateBranch } from './branch'

describe('Evaluate branch changelog data', () => {
  process.argv = ['node', 'octogration', 'changelog', '1']
  test('formats data properly', async () => {
    const branchData = await evaluateBranch()
    const truth = '[main](https://github.com/ready/octogration) &larr; [`#1` some-branch](https://github.com/ready/octogration/pull/1)'
    expect(branchData).toBe(truth)
  })
})

jest.mock('../../utils/gitRemoteOrigin', () => ({
  getGitRemoteURL: () => 'https://github.com/ready/octogration'
}))
