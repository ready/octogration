import { prepareVulnerabilitiesBadge } from './vulnerabilitiesBadge'

const mockedPackageJson = {
  version: '1.2.3',
  config: {
    badgeConfigs: {
      vulnerabilities: {
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
  test('works when command returned clean report', () => {
    const badge = prepareVulnerabilitiesBadge()
    expect(badge.includes('message=0')).toBe(true)

    const color = `color=${mockedPackageJson.config.badgeConfigs.vulnerabilities.primaryColor}`
    expect(badge.includes(color)).toBe(true)
  })

  test('works when command returned dirty report', () => {
    mockedCommandOutput.metadata.vulnerabilities.info = 1
    mockedCommandOutput.metadata.vulnerabilities.low = 3
    mockedCommandOutput.metadata.vulnerabilities.moderate = 2
    mockedCommandOutput.metadata.vulnerabilities.high = 5
    mockedCommandOutput.metadata.vulnerabilities.critical = 6
    mockedCommandOutput.metadata.vulnerabilities.total = 17

    const badge = prepareVulnerabilitiesBadge()
    expect(badge.includes('message=16')).toBe(true)

    const color = `color=${mockedPackageJson.config.badgeConfigs.vulnerabilities.secondaryColor}`
    expect(badge.includes(color)).toBe(true)
  })

  test('does not catch error', () => {
    mockedThrowError = true
    expect(prepareVulnerabilitiesBadge).toThrowError('mocked error')
  })
})

// Mock package json
jest.mock('../../utils/packageJson', () => ({
  getPackageJson: () => mockedPackageJson
}))

// Mock linter command
const mockedCommandOutput = {
  metadata: {
    vulnerabilities: {
      info: 0,
      low: 0,
      moderate: 0,
      high: 0,
      critical: 0,
      total: 0
    }
  }
}

let mockedThrowError = false
jest.mock('child_process', () => ({
  spawnSync: jest.fn().mockImplementation((_cmd: string) => ({
    stdout: {
      toString: () => {
        if (mockedThrowError) throw new Error('mocked error')
        return JSON.stringify(mockedCommandOutput)
      }
    }
  }))
}))
