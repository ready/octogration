import { preparePackageVersionBadge } from './packageVersionBadge'

const mockedPackageJson = {
  version: '1.2.3',
  devDependenices: {
    jest: 'v10.20.30'
  },
  config: {
    badgeConfigs: {
      jestVersion: {
        label: 'Jest Version',
        labelColor: '555555',
        primaryColor: '33ab53',
        secondaryColor: 'cf3b36',
        logo: 'mocked logo',
        logoColor: 'ffffff',
        logoWidth: '14'
      }
    }
  }
}

describe('Package version badge', () => {
  test('works for jest', () => {
    const badge = preparePackageVersionBadge('jest', 'v10.20.30')
    expect(badge.includes('message=10.20.30')).toBe(true)
  })

  test('works for TypeScript', () => {
    const badge = preparePackageVersionBadge('typescript', 'v3.2.1')
    expect(badge.includes('message=3.2.1')).toBe(true)
  })
})

// Mock package json
jest.mock('../../utils/packageJson', () => ({
  getPackageJson: () => mockedPackageJson
}))
