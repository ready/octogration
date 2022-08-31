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
