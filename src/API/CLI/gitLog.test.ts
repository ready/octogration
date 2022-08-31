import { retrieveRawCommits, testGitLog } from './gitLog'
const { retrieveCommitHash, retrieveCommitsSinceHash } = testGitLog

describe('Retrieve raw commits', () => {
  test('works on legit version number', () => {
    mockedVersionNumber = '0.0.2'
    mockedHash = 'b569e67f71744d08669e62c4c85ec7c821272f5b'
    const output = mockedCommits.slice(0, 4)
    expect(retrieveRawCommits()).toStrictEqual(output)
  })

  test('returns all on bad version number', () => {
    mockedVersionNumber = '2.0.0'
    mockedHash = ''
    expect(retrieveRawCommits()).toStrictEqual(mockedCommits)
    expect(console.error).toBeCalled()
  })
})

describe('Retrieve commit hash', () => {
  test('fails on empty output', () => {
    mockedHash = ''
    const msg = 'Git commit with message "empty" does not exist'
    expect(() => retrieveCommitHash('empty')).toThrowError(msg)
  })

  test('fails on short hash', () => {
    mockedHash = '1af94c'
    const msg = 'Git commit with message "short" yielded hash "1af94c" which is not 40 characters'
    expect(() => retrieveCommitHash('short')).toThrowError(msg)
  })

  test('fails on non hash', () => {
    mockedHash = 'aksjdkjshkjdafhaslduhfsajdkhfhfjheuhquki'
    const msg = 'Git commit with message "nothex" yielded hash "aksjdkjshkjdafhaslduhfsajdkhfhfjheuhquki" which is not hex'
    expect(() => retrieveCommitHash('nothex')).toThrowError(msg)
  })

  test('works on single long hash', () => {
    mockedHash = 'ca505ed9ef2bbeafd7ef15c22d0b6f7ba63a6194'
    expect(retrieveCommitHash('single')).toBe(mockedHash)
  })

  test('works on multiple long hashes', () => {
    mockedHash = '0c5b13f5b038e4d8c3d2fb6439680e548f47273f\nca505ed9ef2bbeafd7ef15c22d0b6f7ba63a6194\nd9981a24dc470401f9fce814bbd1bbb70efb1080'
    expect(retrieveCommitHash('multi')).toBe('0c5b13f5b038e4d8c3d2fb6439680e548f47273f')
  })
})

describe('Retrieve commits since hash', () => {
  test('works on first commit', () => {
    const hash = '0c5b13f5b038e4d8c3d2fb6439680e548f47273f'
    expect(retrieveCommitsSinceHash(hash)).toStrictEqual(mockedCommits.slice(0, 1))
  })

  test('works on second commit', () => {
    const hash = 'ca505ed9ef2bbeafd7ef15c22d0b6f7ba63a6194'
    expect(retrieveCommitsSinceHash(hash)).toStrictEqual(mockedCommits.slice(0, 2))
  })

  test('works on third commit', () => {
    const hash = 'd9981a24dc470401f9fce814bbd1bbb70efb1080'
    expect(retrieveCommitsSinceHash(hash)).toStrictEqual(mockedCommits.slice(0, 3))
  })

  test('works on all commits', () => {
    const hash = undefined
    expect(retrieveCommitsSinceHash(hash)).toStrictEqual(mockedCommits)
  })

  test('works on no commits', () => {
    const hash = '495a80a17bb72347788a303600e547d97f57762e'
    expect(retrieveCommitsSinceHash(hash)).toStrictEqual([])
  })
})

let mockedHash = ''
const mockedCommits = [
  '0c5b13f5b038e4d8c3d2fb6439680e548f47273f riverliway@gmail.com chore: this is a mock commit',
  'ca505ed9ef2bbeafd7ef15c22d0b6f7ba63a6194 riverliway@gmail.com chore: this is another mock commit',
  'd9981a24dc470401f9fce814bbd1bbb70efb1080 riverliway@gmail.com chore: this is the last mock commit',
  'b569e67f71744d08669e62c4c85ec7c821272f5b riverliway@gmail.com v0.0.1',
  'd63b8c6c59d6246c2cf65a72ee3d8dc8e6c9c53d riverliway@gmail.com chore: this is a secret commit'
]

jest.mock('child_process', () => ({
  execSync: (cmd: string) => ({
    toString: () => {
      if (cmd.includes('--pretty=format:"%H"')) {
        // Return hash
        return mockedHash
      } else if (cmd.includes('..HEAD')) {
        const hash = cmd.split('..HEAD')[0].substring('git log '.length)

        // Return commit since the hash
        const index = mockedCommits.findIndex(c => c.split(' ')[0] === hash)
        return mockedCommits.slice(0, index + 1).join('\n')
      } else {
        return mockedCommits.join('\n')
      }
    }
  })
}))

let mockedVersionNumber = 'v0.0.2'
jest.mock('../../utils/packageJson', () => ({
  getPackageJson: () => ({
    version: mockedVersionNumber
  })
}))

// Mock console error
let consoleSpy: jest.SpyInstance
beforeAll(() => {
  consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
})
afterAll(() => {
  consoleSpy.mockRestore()
})
afterEach(() => {
  consoleSpy.mockClear()
})
