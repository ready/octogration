import { readFileSync } from 'fs'
import { getPackageJson } from './packageJson'

// Mock the filesystem to return a custom package JSON
const mockedPackageJson = {
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
      toString: () => JSON.stringify(mockedPackageJson)
    }
  })
}))

test('Getting the package returns the package', () => {
  const packageJson = getPackageJson()
  expect(packageJson).toEqual(mockedPackageJson)
})

test('Getting the package mutliple times caches it', () => {
  getPackageJson()
  getPackageJson()
  getPackageJson()
  expect(readFileSync).toBeCalledTimes(1)
})
