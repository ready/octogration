import { prepareLastProdBadge } from './lastProdBadge'

const mockedPackageJson = {
  version: '1.2.3',
  config: {
    badgeConfigs: {
      lastProd: {
        label: 'Last Prod',
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

describe('Last prod badge', () => {
  test('Date remains the same on dev deploy', () => {
    const lastBadge = 'https://img.shields.io/static/v1?label=Last%20Prod&color=3caf51&labelColor=555555&logo=Android%20Auto&logoColor=ffffff&logoWidth=14&style=for-the-badge&message=9/4/22'
    const badge = prepareLastProdBadge(lastBadge)
    expect(badge.includes('message=9/4/22')).toBe(true)
  })

  test('Shows ? on malformatted badge', () => {
    const lastBadge = 'malformatted'
    const badge = prepareLastProdBadge(lastBadge)
    expect(badge.includes('message=?/?/??')).toBe(true)
  })

  test('Shows ? on missing param', () => {
    const lastBadge = 'https://img.shields.io/static/v1?label=Last%20Prod&color=3caf51&labelColor=555555&logo=Android%20Auto&logoColor=ffffff&logoWidth=14&style=for-the-badge'
    const badge = prepareLastProdBadge(lastBadge)
    expect(badge.includes('message=?/?/??')).toBe(true)
  })

  test('Date changes on prod deploy', () => {
    mockedPackageJson.version = '1.3.0'
    const lastBadge = 'https://img.shields.io/static/v1?label=Last%20Prod&color=3caf51&labelColor=555555&logo=Android%20Auto&logoColor=ffffff&logoWidth=14&style=for-the-badge&message=9/4/22'
    const badge = prepareLastProdBadge(lastBadge)
    console.log(badge)
    expect(badge.includes('message=10/4/22')).toBe(true)
  })
})

// Mock package json
jest.mock('../../utils/packageJson', () => ({
  getPackageJson: () => mockedPackageJson
}))

// Mock system time
jest.useFakeTimers().setSystemTime(1664834409000)
