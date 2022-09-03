import { writeChangelogPost } from './writePost'
import { appendToChangelogFile } from '../parsers/changelogFileParser'

test('Writing the post yields the proper data', async () => {
  await writeChangelogPost()
  expect(mockedOutputPost).toEqual({
    body: '',
    env: 'Dev',
    timestamp: '2022-08-31T15:19:55.485Z',
    title: '',
    version: '1.2.3'
  })
})

test('Having writeChangelogToFile config option disabled prevents writing posts', () => {
  mockedWriteConfig = false
  expect(appendToChangelogFile).not.toBeCalled()
})

// Mock system time
jest.useFakeTimers().setSystemTime(1661959195485)

// Mock appender
let mockedOutputPost = {}
jest.mock('../parsers/changelogFileParser', () => ({
  appendToChangelogFile: jest.fn().mockImplementation((post: any) => {
    mockedOutputPost = post
  })
}))

// Mock package JSON
let mockedWriteConfig = true
jest.mock('../../utils/packageJson', () => ({
  getPackageJson: () => ({
    version: '1.2.3',
    config: {
      writeChangelogToFile: mockedWriteConfig
    }
  })
}))

afterEach(() => {
  jest.clearAllMocks()
})
