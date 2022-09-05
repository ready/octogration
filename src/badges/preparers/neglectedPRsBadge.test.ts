import { testPulls } from '../../API/mocks/octokit/endpoints/pulls'
import { prepareNeglectedPrsBadge, testNeglectedPRsBadge } from './neglectedPRsBadge'

const mockedPackageJson = {
  version: '1.2.3',
  config: {
    badgeConfigs: {
      neglectedPrs: {
        label: 'Neglected PRs',
        labelColor: '555555',
        primaryColor: '33ab53',
        secondaryColor: 'cf3b36',
        logo: 'mocked logo',
        logoColor: 'ffffff',
        logoWidth: '14',
        style: 'for-the-badge'
      }
    }
  }
}

describe('Neglected PRs', () => {
  test('is green on zero neglected PRs', async () => {
    const badge = await prepareNeglectedPrsBadge()
    const color = `color=${mockedPackageJson.config.badgeConfigs.neglectedPrs.primaryColor}`
    expect(badge.includes(color)).toBe(true)
    expect(badge.includes('message=0')).toBe(true)
  })

  test('is red on 1 or more neglected PRs', async () => {
    testPulls.addMockedPullRequest({
      id: 9122,
      submitted_at: (new Date('1/1/20')).toISOString(),
      state: 'open',
      reviewAuthors: [],
      head: { ref: 'some-branch4' },
      base: { ref: 'main' },
      title: 'Mocked PR title 9122',
      body: 'Mocked PR body 9122'
    })

    const badge = await prepareNeglectedPrsBadge()
    const color = `color=${mockedPackageJson.config.badgeConfigs.neglectedPrs.secondaryColor}`
    expect(badge.includes(color)).toBe(true)
    expect(badge.includes('message=1')).toBe(true)
  })
})

// Mock package json
jest.mock('../../utils/packageJson', () => ({
  getPackageJson: () => mockedPackageJson
}))

// Mock repo name
jest.mock('../../changelog/utils/getGithubInfo', () => ({
  getRepo: () => 'ready/octogration'
}))

afterEach(() => {
  testNeglectedPRsBadge.reset()
})
