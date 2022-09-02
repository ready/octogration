import { evaluatePrTitle } from './prTitle'

describe('Evaluate PR title', () => {
  test('able to get mocked PR title', async () => {
    process.argv = ['node', 'octogration', 'changelog', '1']
    const prTitle = await evaluatePrTitle()
    expect(prTitle).toBe('\n# Mocked PR title 1')
  })

  test('unable to get invalid PR', async () => {
    process.argv = ['node', 'octogration', 'changelog', '1914841']
    const prTitle = await evaluatePrTitle()
    expect(prTitle).toBe('')
  })
})

jest.mock('../../utils/gitRemoteOrigin', () => ({
  getGitRemoteURL: () => 'https://github.com/ready/octogration'
}))
