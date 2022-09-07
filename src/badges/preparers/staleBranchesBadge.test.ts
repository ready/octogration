import { testBranches } from '../../API/mocks/octokit/endpoints/branch'
import { testListBranches } from '../../API/mocks/octokit/endpoints/listBranches'
import { prepareStaleBranchesBadge, testStaleBranchesBadge } from './staleBranchesBadge'

const mockedPackageJson = {
  version: '1.2.3',
  config: {
    badgeConfigs: {
      staleBranches: {
        label: 'Stale Branches',
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
    const badge = await prepareStaleBranchesBadge()
    const color = `color=${mockedPackageJson.config.badgeConfigs.staleBranches.primaryColor}`
    expect(badge.includes(color)).toBe(true)
    expect(badge.includes('message=0')).toBe(true)
  })

  test('is red on 1 or more neglected PRs', async () => {
    testBranches.addBranchRequest({
      name: 'mockedBranchTest',
      commit: {
        commit: {
          date: (new Date('8/22/21')).toISOString()
        }
      }
    })
    testListBranches.addBranchRequest({
      name: 'mockedBranchTest',
      protected: false
    })

    const badge = await prepareStaleBranchesBadge()
    const color = `color=${mockedPackageJson.config.badgeConfigs.staleBranches.secondaryColor}`
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
  testStaleBranchesBadge.reset()
})
