import { prepareTestsBadge } from './testsBadge'

test('Badge is red on failed unit tests', () => {
  const badge = prepareTestsBadge()
  expect(badge).toBe('https://img.shields.io/static/v1?label=Tests&color=cf3b36&labelColor=555555&logo=TestCafe&logoColor=ffffff&logoWidth=14&style=for-the-badge&message=1')
})

test('Badge is green on passed unit tests', () => {
  mockedTestOutput = 'Tests: 250 passed, 250 total'
  const badge = prepareTestsBadge()
  expect(badge).toBe('https://img.shields.io/static/v1?label=Tests&color=33ab53&labelColor=555555&logo=TestCafe&logoColor=ffffff&logoWidth=14&style=for-the-badge&message=250')
})

let mockedTestOutput = `
Suites:    1 passed, 1 total
Tests: 1 failed, 1 passed, 2 total
Tests: 2 total
Tests: 2 passed,
Tests: a passed, 1 total
Tests: 1 passed, b total
`

jest.mock('child_process', () => ({
  spawnSync: (_cmd: string, _args: string[]) => ({
    stderr: {
      toString: () => mockedTestOutput
    }
  })
}))

jest.mock('../../utils/packageJson', () => ({
  getPackageJson: () => ({
    config: {
      badgeConfigs: {
        tests: {
          label: 'Tests',
          labelColor: '555555',
          primaryColor: '33ab53',
          secondaryColor: 'cf3b36',
          logo: 'TestCafe',
          logoColor: 'ffffff',
          logoWidth: '14',
          style: 'for-the-badge'
        }
      }
    }
  })
}))
