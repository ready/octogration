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

  test('empty on not including title in production', async () => {
    mockedVersion = '1.1.0'
    mockedConfig.includePrTitleProd = false
    const prBody = await evaluatePrTitle()
    expect(prBody).toBe('')
  })

  test('empty on not including title in dev', async () => {
    mockedVersion = '1.1.1'
    mockedConfig.includePrTitleDev = false
    const prBody = await evaluatePrTitle()
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
