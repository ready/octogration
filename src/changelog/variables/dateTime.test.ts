import { evaluateDatetime } from './dateTime'

test('Formatting datetime with defaults works', () => {
  expect(evaluateDatetime()).toBe('Wednesday, 08/31/22, 8:19 AM PDT')
})

// Mock the system time for consistency
jest.useFakeTimers().setSystemTime(1661959195485)

// Mock the filesystem to return default configurations
const mockedMinimalPackageJson = {
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
  readFileSync: jest.fn().mockImplementation((fn: string) => {
    if (fn !== 'package.json' && fn !== '.octogrationdata') {
      throw new Error('Unexpected file')
    }

    return {
      toString: () => {
        if (fn === 'package.json') return JSON.stringify(mockedMinimalPackageJson)
        const p: any = mockedMinimalPackageJson
        return JSON.stringify(p['@ready/octogration'])
      }
    }
  }),
  existsSync: jest.fn().mockImplementation((fn: string): boolean => {
    return fn === 'package.json'
  })
}))
