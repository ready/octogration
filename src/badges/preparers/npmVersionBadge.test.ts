import { prepareNPMVersionBadge } from './npmVersionBadge'

const mockedPackageJson = {
  version: '1.2.3',
  config: {
    badgeConfigs: {
      npmVersion: {
        label: 'NPM Version',
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

describe('NPM version badge', () => {
  test('works when command returned expected output', () => {
    const badge = prepareNPMVersionBadge()
    expect(badge.includes('message=1.2.3')).toBe(true)
  })

  test('works when command returned expected output with extra junk', () => {
    mockedCommandOutput = 'npm run version\n v16.14.0'
    const badge = prepareNPMVersionBadge()
    expect(badge.includes('message=16.14.0')).toBe(true)
  })

  test('does not catch error', () => {
    mockedThrowError = true
    expect(prepareNPMVersionBadge).toThrowError('mocked error')
  })
})

// Mock package json
jest.mock('../../utils/packageJson', () => ({
  getPackageJson: () => mockedPackageJson
}))

// Mock linter command
let mockedCommandOutput = '1.2.3'
let mockedThrowError = false
jest.mock('child_process', () => ({
  spawnSync: jest.fn().mockImplementation((_cmd: string) => ({
    stdout: {
      toString: () => {
        if (mockedThrowError) throw new Error('mocked error')
        return mockedCommandOutput
      }
    }
  }))
}))
