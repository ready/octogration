import { prepareDeprecationsBadge } from './deprecationsBadge'

const mockedPackageJson = {
  config: {
    badgeConfigs: {
      deprecations: {
        label: 'Deprecations',
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

describe('Deprecation badge', () => {
  test('has 0 deprecations on empty file', () => {
    const badge = prepareDeprecationsBadge()
    expect(badge.includes('message=0')).toBe(true)
  })

  test('has 0 deprecations on no warnings', () => {
    mockedInstallFile = 'install warning\nnpm deprecation\nsome data'
    const badge = prepareDeprecationsBadge()
    expect(badge.includes('message=0')).toBe(true)
  })

  test('has 1 deprecations on properly formatted log', () => {
    mockedInstallFile = 'npm WARN deprecated package \n npm WARN deprecated package2'
    const badge = prepareDeprecationsBadge()
    expect(badge.includes('message=2')).toBe(true)
  })

  test('does not catch error', () => {
    mockedThrowError = true
    expect(() => prepareDeprecationsBadge()).toThrowError('mocked error')
  })
})

// Mock package json
jest.mock('../../utils/packageJson', () => ({
  getPackageJson: () => mockedPackageJson
}))

// Mock install file
let mockedInstallFile = ''
let mockedThrowError = false
jest.mock('fs', () => ({
  readFileSync: jest.fn().mockImplementation((_cmd: string) => ({
    toString: () => {
      if (mockedThrowError) throw new Error('mocked error')
      return mockedInstallFile
    }
  }))
}))
