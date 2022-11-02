import { writeChangelogPost } from './writePost'
import { appendToChangelogFile } from '../parsers/changelogFileParser'

test('Writing the post yields the proper data', async () => {
  await writeChangelogPost()
  expect(mockedOutputPost).toEqual({
    body: 'Mocked body',
    env: 'Dev',
    timestamp: '2022-08-31T15:19:55.485Z',
    title: 'This is a mocked title',
    version: '1.2.3'
  })
})

test('The pr title will not include markdown header', async () => {
  mockedPrTitle = 'No markdown'
  mockedPrBody = 'No markdown body'
  await writeChangelogPost()
  expect(mockedOutputPost).toEqual({
    body: 'No markdown body',
    env: 'Dev',
    timestamp: '2022-08-31T15:19:55.485Z',
    title: 'No markdown',
    version: '1.2.3'
  })
})

test('Overriding true from PR body writes changelog', async () => {
  mockedWriteConfig = false
  mockedPrBody = '<!-- changelogFile=true -->\nbody'
  await writeChangelogPost()
  expect(appendToChangelogFile).toBeCalled()
})

test('Overriding false from PR body does not changelog', async () => {
  mockedWriteConfig = true
  mockedPrBody = '<!-- changelogFile=false -->\nbody'
  await writeChangelogPost()
  expect(appendToChangelogFile).not.toBeCalled()
})

test('Having writeChangelogToFile config option disabled prevents writing posts', async () => {
  mockedPrBody = 'No markdown body'
  mockedWriteConfig = false
  await writeChangelogPost()
  expect(appendToChangelogFile).not.toBeCalled()
})

test('Having writeEmptyChangelogs config option disabled prevents writing posts', async () => {
  mockedWriteConfig = true
  mockedWriteEmptyConfig = false
  mockedPrTitle = ''
  mockedPrBody = ''
  await writeChangelogPost()
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
let mockedWriteEmptyConfig = true
jest.mock('../../utils/packageJson', () => ({
  getPackageJson: () => ({
    version: '1.2.3',
    config: {
      writeChangelogToFile: mockedWriteConfig,
      writeEmptyChangelogs: mockedWriteEmptyConfig
    }
  })
}))

let mockedPrTitle = '\n# This is a mocked title'
jest.mock('../variables/prTitle', () => ({
  evaluatePrTitle: () => mockedPrTitle
}))

let mockedPrBody = 'Mocked body'
jest.mock('../variables/prBody', () => ({
  evaluatePrBody: () => mockedPrBody
}))

afterEach(() => {
  jest.clearAllMocks()
})
