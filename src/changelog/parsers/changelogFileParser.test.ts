import { appendToChangelogFile } from './changelogFileParser'

describe('Appending to the changelog file', () => {
  const examplePost = {
    title: 'Mocked post title',
    body: 'Mocked post body',
    env: 'Dev',
    version: '1.2.3',
    timestamp: 'tstamp1'
  }
  const examplePost2 = {
    title: 'Mocked post title2',
    body: 'Mocked post body2',
    env: 'Dev',
    version: '1.2.3',
    timestamp: 'tstamp2'
  }

  test('is just the post when file does not exist', () => {
    appendToChangelogFile(examplePost)
    expect(mockedOutputFile).toBe(JSON.stringify([examplePost]))
  })

  test('is just the post when file exists but is not an array', () => {
    mockedInputFile = JSON.stringify('badfile')
    appendToChangelogFile(examplePost)
    expect(mockedOutputFile).toBe(JSON.stringify([examplePost]))
  })

  test('is more than just the post when file does exist and is populated', () => {
    mockedInputFile = JSON.stringify([examplePost2])
    appendToChangelogFile(examplePost)
    expect(mockedOutputFile).toBe(JSON.stringify([examplePost, examplePost2]))
  })
})

// Mock reading and writing to file
let mockedInputFile = ''
let mockedOutputFile = ''
jest.mock('fs', () => ({
  readFileSync: jest.fn().mockImplementation((_cmd: string) => {
    return {
      toString: () => mockedInputFile
    }
  }),
  writeFileSync: jest.fn().mockImplementation((_cmd: string, content: string, _options: any) => {
    mockedOutputFile = content
  })
}))

// Mock package JSON
jest.mock('../../utils/packageJson', () => ({
  getPackageJson: () => ({
    version: '1.2.3',
    config: {
      changelogFileName: ''
    }
  })
}))
