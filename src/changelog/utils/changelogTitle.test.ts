import { createChangelogTitle } from './changelogTitle'

describe('Change log title', () => {
  test('is prod on 0 patch number', () => {
    mockedVersionNumber = '1.2.0'
    const title = createChangelogTitle()
    expect(title).toBe('Production Deploy v1.2.0')
  })

  test('is prod on 0 patch number with two version fields', () => {
    mockedVersionNumber = '1.0'
    const title = createChangelogTitle()
    expect(title).toBe('Production Deploy v1.0')
  })

  test('is prod on 0 patch number with many version fields', () => {
    mockedVersionNumber = '1.2.3.4.5.0'
    const title = createChangelogTitle()
    expect(title).toBe('Production Deploy v1.2.3.4.5.0')
  })

  test('is dev on non 0 patch number', () => {
    mockedVersionNumber = '1.2.3'
    const title = createChangelogTitle()
    expect(title).toBe('Dev Deploy v1.2.3')
  })

  test('is dev on non 0 patch number with two version fields', () => {
    mockedVersionNumber = '1.2'
    const title = createChangelogTitle()
    expect(title).toBe('Dev Deploy v1.2')
  })

  test('is dev on non 0 patch number with multiple fields', () => {
    mockedVersionNumber = '1.2.3.4.5.6.7'
    const title = createChangelogTitle()
    expect(title).toBe('Dev Deploy v1.2.3.4.5.6.7')
  })

  test('is dev on nonsense version', () => {
    mockedVersionNumber = 'is this even a version'
    const title = createChangelogTitle()
    expect(title).toBe('Dev Deploy vis this even a version')
  })
})

// Mock version number from package JSON
let mockedVersionNumber = '0.0.0'
jest.mock('../../utils/packageJson', () => ({
  getPackageJson: () => ({
    version: mockedVersionNumber
  })
}))
