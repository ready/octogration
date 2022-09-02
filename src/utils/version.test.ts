import testmap from '../test/testmap'
import { cleanVersionNumber, decrementMinor, decrementPatch } from './version'

describe('Clean version number', () => {
  const versionTests: Array<[string, string]> = [
    ['0.0.0', '0.0.0'],
    ['0.0.1', '0.0.1'],
    ['0.1.0', '0.1.0'],
    ['1.0.0', '1.0.0'],
    ['v1.2.3', '1.2.3'],
    ['version 14.2.34', '14.2.34'],
    ['this is version 9.13.1926.', '9.13.1926'],
    ['-1.0.1', '1.0.1'],
    ['a.1.b.c', '1']
  ]

  testmap(versionTests, '%s', cleanVersionNumber)
})

describe('Decrement patch number', () => {
  const versionTests: Array<[string, string]> = [
    ['0.0.0', '0.0.0'],
    ['0.0.1', '0.0.0'],
    ['0.1.0', '0.1.0'],
    ['1.0.0', '1.0.0'],
    ['23.0.6', '23.0.5'],
    ['1.99.14993', '1.99.14992'],
    ['83.2.0', '83.2.0']
  ]

  testmap(versionTests, '%s', decrementPatch)
})

describe('Decrement minor number', () => {
  const versionTests: Array<[string, string]> = [
    ['0.0.0', '0.0.0'],
    ['0.0.1', '0.0.0'],
    ['0.1.0', '0.0.0'],
    ['1.0.0', '1.0.0'],
    ['23.0.6', '23.0.0'],
    ['1.99.14993', '1.98.0'],
    ['83.2.0', '83.1.0']
  ]

  testmap(versionTests, '%s', decrementMinor)
})
