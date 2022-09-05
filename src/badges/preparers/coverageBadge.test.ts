import { prepareCoverageBadge } from './coverageBadge'

const mockedPackageJson = {
  config: {
    badgeConfigs: {
      coverage: {
        label: 'Coverage',
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

describe('Coverage badge', () => {
  test('is secondary color on 0%', () => {
    const preparedBadge = prepareCoverageBadge()
    const color = `color=${mockedPackageJson.config.badgeConfigs.coverage.secondaryColor}`
    expect(preparedBadge.includes(color)).toBe(true)
  })

  test('is primary color on 100%', () => {
    mockedSummaryFile.total.statements.pct = 100
    mockedSummaryFile.total.lines.pct = 100
    mockedSummaryFile.total.functions.pct = 100
    mockedSummaryFile.total.branches.pct = 100

    const preparedBadge = prepareCoverageBadge()
    const color = `color=${mockedPackageJson.config.badgeConfigs.coverage.primaryColor}`
    expect(preparedBadge.includes(color)).toBe(true)
  })

  test('is rounded to integer on whole number', () => {
    mockedSummaryFile.total.statements.pct = 66
    mockedSummaryFile.total.lines.pct = 66
    mockedSummaryFile.total.functions.pct = 66
    mockedSummaryFile.total.branches.pct = 66

    const preparedBadge = prepareCoverageBadge()
    expect(preparedBadge.includes('message=66%')).toBe(true)
    expect(preparedBadge.includes('message=66.0%')).toBe(false)
    expect(preparedBadge.includes('message=66.00%')).toBe(false)
  })

  test('is rounded to 2 decimal places on float', () => {
    mockedSummaryFile.total.statements.pct = 54.32924
    mockedSummaryFile.total.lines.pct = 54.32924
    mockedSummaryFile.total.functions.pct = 54.32924
    mockedSummaryFile.total.branches.pct = 54.32924

    const preparedBadge = prepareCoverageBadge()
    expect(preparedBadge.includes('message=54.33%')).toBe(true)
    expect(preparedBadge.includes('message=54%')).toBe(false)
    expect(preparedBadge.includes('message=54.32924%')).toBe(false)
    expect(preparedBadge.includes('message=54.32%')).toBe(false)
  })

  test('takes the minimum of the different stats', () => {
    mockedSummaryFile.total.statements.pct = 54.32924
    mockedSummaryFile.total.lines.pct = 33.21
    mockedSummaryFile.total.functions.pct = 88
    mockedSummaryFile.total.branches.pct = 9.2333

    const preparedBadge = prepareCoverageBadge()
    expect(preparedBadge.includes('message=9.23%')).toBe(true)
    expect(preparedBadge.includes('message=54.33%')).toBe(false)
    expect(preparedBadge.includes('message=33.21%')).toBe(false)
    expect(preparedBadge.includes('message=88%')).toBe(false)
  })

  test('is 0% invalid file format', () => {
    mockedThrowError = true
    const preparedBadge = prepareCoverageBadge()
    expect(preparedBadge.includes('message=0%')).toBe(true)
  })
})

// Mock package json
jest.mock('../../utils/packageJson', () => ({
  getPackageJson: () => mockedPackageJson
}))

// Mock summary file
const mockedSummaryFile: any = {
  total: {
    statements: {
      pct: 0
    },
    lines: {
      pct: 0
    },
    functions: {
      pct: 0
    },
    branches: {
      pct: 0
    }
  }
}

let mockedThrowError = false
jest.mock('fs', () => ({
  readFileSync: jest.fn().mockImplementation((_cmd: string) => ({
    toString: () => {
      if (mockedThrowError) throw new Error('mocked error')
      return JSON.stringify(mockedSummaryFile)
    }
  }))
}))
