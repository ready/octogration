import { prepareVersionBadge } from './versionBadge'

const mockedPackageJson = {
  version: '1.23.3',
  devDependenices: {
    jest: 'v10.20.30'
  },
  config: {
    badgeConfigs: {
      version: {
        label: 'Version',
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

test('Version badge works', () => {
  const badge = prepareVersionBadge()
  expect(badge.includes('message=1.23.3')).toBe(true)
})

// Mock package json
jest.mock('../../utils/packageJson', () => ({
  getPackageJson: () => mockedPackageJson
}))
