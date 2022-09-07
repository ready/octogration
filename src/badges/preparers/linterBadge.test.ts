import { prepareLinterBadge } from './linterBadge'

const mockedPackageJson = {
  version: '1.2.3',
  config: {
    badgeConfigs: {
      linter: {
        label: 'Linter',
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

describe('Linter badge', () => {
  test('is 0 on no lines', () => {
    const badge = prepareLinterBadge()
    expect(badge.includes('message=0')).toBe(true)
  })

  test('is 0 on multiple lines', () => {
    mockedLinterOutput = '15'
    const badge = prepareLinterBadge()
    expect(badge.includes('message=15')).toBe(true)
  })

  test('does not catch error', () => {
    mockedThrowError = true
    expect(() => prepareLinterBadge()).toThrowError('mocked error')
  })
})

// Mock package json
jest.mock('../../utils/packageJson', () => ({
  getPackageJson: () => mockedPackageJson
}))

// Mock linter command
let mockedLinterOutput = '0'
let mockedThrowError = false
jest.mock('child_process', () => ({
  spawnSync: jest.fn().mockImplementation((_cmd: string) => ({
    stdout: {
      toString: () => {
        if (mockedThrowError) throw new Error('mocked error')
        return mockedLinterOutput
      }
    }
  }))
}))
