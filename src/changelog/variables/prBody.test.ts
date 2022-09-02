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

  test('empty on not including body in production', async () => {
    mockedVersion = '1.1.0'
    mockedConfig.includePrBodyProd = false
    const prBody = await evaluatePrBody()
    expect(prBody).toBe('')
  })

  test('empty on not including body in dev', async () => {
    mockedVersion = '1.1.1'
    mockedConfig.includePrBodyDev = false
    const prBody = await evaluatePrBody()
    expect(prBody).toBe('')
  })
})

jest.mock('../../utils/gitRemoteOrigin', () => ({
  getGitRemoteURL: () => 'https://github.com/ready/octogration'
}))

let mockedVersion = '1.1.0'
const mockedConfig = {
  includePrTitleDev: true,
  includePrTitleProd: true,
  includePrBodyDev: true,
  includePrBodyProd: true
}
jest.mock('../../utils/packageJson', () => ({
  getPackageJson: () => ({
    version: mockedVersion,
    config: mockedConfig
  })
}))
