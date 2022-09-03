import { readFileSync } from 'fs'
import { defaultConfig, getPackageJson, PackageJson, testPackageJson } from './packageJson'

// Mock the filesystem to return a custom package JSON
const mockedMinimalPackageJson: any = {
  version: '0.0.0',
  scripts: {
    testSummary: ''
  },
  dependencies: {
    dep: '1.1.1'
  },
  devDependencies: {
    dep: '1.1.1'
  }
}

jest.mock('fs', () => ({
  readFileSync: jest.fn().mockImplementation((cmd: string) => {
    if (cmd !== 'package.json') {
      throw new Error('Unexpected file')
    }

    return {
      toString: () => JSON.stringify(mockedMinimalPackageJson)
    }
  })
}))

afterEach(() => {
  jest.clearAllMocks()
  testPackageJson.reset()
})

const defaultPackageJson: PackageJson = {
  ...mockedMinimalPackageJson,
  config: defaultConfig
}

test('Getting the package returns the package', () => {
  const packageJson = getPackageJson()
  expect(packageJson).toEqual(defaultPackageJson)
})

test('Getting the package mutliple times caches it', () => {
  getPackageJson()
  getPackageJson()
  getPackageJson()
  expect(readFileSync).toBeCalledTimes(1)
})

test('Setting a field with invalid type yields default value', () => {
  mockedMinimalPackageJson['@ready/octogration'] = {
    datetimeLocal: 1
  }
  const packageJson = getPackageJson()
  expect(packageJson.config.datetimeLocal).toBe(defaultPackageJson.config.datetimeLocal)
})

test('Setting a field with valid type yields non-default value', () => {
  mockedMinimalPackageJson['@ready/octogration'] = {
    datetimeLocal: 'THIS IS A MOCKED FIELD'
  }
  const datetimeLocal = getPackageJson().config.datetimeLocal
  expect(datetimeLocal).not.toBe(defaultPackageJson.config.datetimeLocal)
  expect(datetimeLocal).toBe('THIS IS A MOCKED FIELD')
})

test('Setting config to nonobject yields default config', () => {
  mockedMinimalPackageJson['@ready/octogration'] = 'config'
  const packageJson = getPackageJson()
  expect(packageJson).toEqual(defaultPackageJson)
})

test('Not setting commit section yields default false value', () => {
  mockedMinimalPackageJson['@ready/octogration'] = {}
  const commitSections = getPackageJson().config.commitSections
  expect(commitSections).toBe(false)
})

test('Setting commit section to true is valid', () => {
  mockedMinimalPackageJson['@ready/octogration'] = {
    commitSections: true
  }
  const commitSections = getPackageJson().config.commitSections
  expect(commitSections).toBe(true)
})

test('Setting commit section to empty object is valid', () => {
  mockedMinimalPackageJson['@ready/octogration'] = {
    commitSections: {}
  }
  const commitSections = getPackageJson().config.commitSections
  expect(commitSections).toEqual({})
})

test('Setting commit section with normal sections is valid', () => {
  mockedMinimalPackageJson['@ready/octogration'] = {
    commitSections: {
      Features: ['feat', 'perf'],
      'Bug Fixes': ['fix']
    }
  }
  const commitSections = getPackageJson().config.commitSections
  expect(commitSections).toEqual({
    Features: ['feat', 'perf'],
    'Bug Fixes': ['fix']
  })
})

test('Setting commit section with non-array type gets filtered out', () => {
  mockedMinimalPackageJson['@ready/octogration'] = {
    commitSections: {
      Features: ['feat', 'perf', 'cool'],
      Fixes: 'fix'
    }
  }
  const commitSections = getPackageJson().config.commitSections
  expect(commitSections).toEqual({
    Features: ['feat', 'perf', 'cool']
  })
})

test('Setting commit section with non-string types gets filtered out', () => {
  mockedMinimalPackageJson['@ready/octogration'] = {
    commitSections: {
      Features: ['feat', 'perf', 'nice'],
      Tests: [{}, 'test', false, 55, NaN, ['nice']]
    }
  }
  const commitSections = getPackageJson().config.commitSections
  expect(commitSections).toEqual({
    Features: ['feat', 'perf', 'nice'],
    Tests: ['test']
  })
})

test('Not setting the badge config still has the defaults', () => {
  mockedMinimalPackageJson['@ready/octogration'] = {}
  const badgeConfigs = getPackageJson().config.badgeConfigs
  expect(badgeConfigs.version.label).toBe('Version')
})

test('Setting the badge config to non-object still has the defaults', () => {
  mockedMinimalPackageJson['@ready/octogration'] = {
    badgeConfigs: 'invalid configurations'
  }
  const badgeConfigs = getPackageJson().config.badgeConfigs
  expect(badgeConfigs.version.label).toBe('Version')
})

test('Setting the badge config fields to non-object still has the defaults', () => {
  mockedMinimalPackageJson['@ready/octogration'] = {
    badgeConfigs: {
      version: 'invalid configurations'
    }
  }
  const badgeConfigs = getPackageJson().config.badgeConfigs
  expect(badgeConfigs.version.label).toBe('Version')
})

test('Setting the version badge config overrides defaults', () => {
  mockedMinimalPackageJson['@ready/octogration'] = {
    badgeConfigs: {
      version: {
        label: 'Version Badge'
      }
    }
  }
  const badgeConfigs = getPackageJson().config.badgeConfigs
  expect(badgeConfigs.version.label).toBe('Version Badge')
  expect(badgeConfigs.version.label).not.toBe(defaultConfig.badgeConfigs.version.label)
})

test('Setting the version badge config allows defaults to populate other fields', () => {
  mockedMinimalPackageJson['@ready/octogration'] = {
    badgeConfigs: {
      version: {
        label: 'Version Badge',
        primaryColor: 'ffffff'
      }
    }
  }
  const badgeConfigs = getPackageJson().config.badgeConfigs
  expect(badgeConfigs.version.primaryColor).toBe('ffffff')
  expect(badgeConfigs.version.secondaryColor).toBe(defaultConfig.badgeConfigs.version.secondaryColor)
})

test('Setting the badge config gradient to non-object still has the defaults', () => {
  mockedMinimalPackageJson['@ready/octogration'] = {
    badgeConfigs: {
      coverage: {
        gradient: 'bad gradient'
      }
    }
  }
  const badgeConfigs = getPackageJson().config.badgeConfigs
  expect(badgeConfigs.coverage.gradient).toEqual(defaultConfig.badgeConfigs.coverage.gradient)
})

test('Setting the badge config gradient to long array still has the defaults', () => {
  mockedMinimalPackageJson['@ready/octogration'] = {
    badgeConfigs: {
      coverage: {
        gradient: [1, 2, 3]
      }
    }
  }
  const badgeConfigs = getPackageJson().config.badgeConfigs
  expect(badgeConfigs.coverage.gradient).toEqual(defaultConfig.badgeConfigs.coverage.gradient)
})

test('Setting the badge config gradient to short array still has the defaults', () => {
  mockedMinimalPackageJson['@ready/octogration'] = {
    badgeConfigs: {
      coverage: {
        gradient: [0]
      }
    }
  }
  const badgeConfigs = getPackageJson().config.badgeConfigs
  expect(badgeConfigs.coverage.gradient).toEqual(defaultConfig.badgeConfigs.coverage.gradient)
})

test('Setting the badge config gradient to non integer array still has the defaults', () => {
  mockedMinimalPackageJson['@ready/octogration'] = {
    badgeConfigs: {
      coverage: {
        gradient: ['6', '14']
      }
    }
  }
  const badgeConfigs = getPackageJson().config.badgeConfigs
  expect(badgeConfigs.coverage.gradient).toEqual(defaultConfig.badgeConfigs.coverage.gradient)
})

test('Setting the badge config with property that does not exist allows through', () => {
  mockedMinimalPackageJson['@ready/octogration'] = {
    badgeConfigs: {
      coverage: {
        something: 'hello'
      }
    }
  }
  const badgeConfigs = getPackageJson().config.badgeConfigs
  const defaultC = defaultConfig.badgeConfigs.coverage
  expect(badgeConfigs.coverage).toEqual({ ...defaultC, something: 'hello' })
})

test('Setting a badge config that does not exist allows through', () => {
  mockedMinimalPackageJson['@ready/octogration'] = {
    badgeConfigs: {
      madeUpBadge: {
        something: 'hello'
      }
    }
  }
  const badgeConfigs = getPackageJson().config.badgeConfigs
  expect(badgeConfigs).toEqual({ ...defaultConfig.badgeConfigs, madeUpBadge: { something: 'hello' } })
})
