import { evaluatePrBody } from './prBody'

describe('Evaluate PR body', () => {
  test('able to get mocked PR body', async () => {
    process.argv = ['node', 'octogration', 'changelog', '1']
    const prBody = await evaluatePrBody()
    expect(prBody).toBe('Mocked PR body 1')
  })

  test('unable to get invalid PR', async () => {
    process.argv = ['node', 'octogration', 'changelog', '1914841']
    const prBody = await evaluatePrBody()
    expect(prBody).toBe('')
  })
})

jest.mock('../../utils/gitRemoteOrigin', () => ({
  getGitRemoteURL: () => 'https://github.com/ready/octogration'
}))
