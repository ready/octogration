import { HELP_MSG, main } from './index'
import { updateBadges } from './badges/badges'
import { changelog } from './changelog/changelog'

// Mock imports from subprocessors
jest.mock('./badges/badges', () => ({
  updateBadges: jest.fn()
}))
jest.mock('./changelog/changelog', () => ({
  changelog: jest.fn()
}))

// Mock console log
let consoleSpy: jest.SpyInstance
beforeAll(() => {
  consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
})
afterAll(() => {
  consoleSpy.mockRestore()
})

// Mock process exit
let processSpy: jest.SpyInstance
beforeAll(() => {
  processSpy = jest.spyOn(process, 'exit').mockImplementation(code => code as never)
})
afterAll(() => {
  processSpy.mockRestore()
})

// Clear mocks between tests
afterEach(() => {
  jest.clearAllMocks()
})

test('Main prints help when no args are passed in', () => {
  process.argv = ['node', 'octogration']
  main()

  expect(consoleSpy).toBeCalledWith(HELP_MSG)
  expect(processSpy).toBeCalledWith(1)
})

test('Main prints help when invalid args are passed in', () => {
  process.argv = ['node', 'octogration', 'INVALID SUBPROCESS']
  main()

  expect(consoleSpy).toBeCalledWith(HELP_MSG)
  expect(processSpy).toBeCalledWith(1)
})

interface SubprocessData {
  name: string
  executor: () => void | Promise<void>
}

const subprocesses: SubprocessData[] = [
  { name: 'badges', executor: updateBadges },
  { name: 'changelog', executor: changelog }
]

subprocesses.forEach(subprocess => {
  test(`Main calls ${subprocess.name}`, () => {
    process.argv = ['node', 'octogration', subprocess.name]
    main()

    expect(consoleSpy).not.toBeCalled()
    expect(processSpy).not.toBeCalled()
    expect(subprocess.executor).toBeCalled()

    // Expect that the other subprocesses have not been called
    subprocesses.forEach(sub => {
      if (sub.name !== subprocess.name) {
        expect(sub.executor).not.toBeCalled()
      }
    })
  })
})
