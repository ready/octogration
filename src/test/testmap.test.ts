import testmap from './testmap'

// An example function to run through test map
const doubler = (num: number): number => num * 2

const doubleTests: Array<[number, number]> = [
  [2, 4],
  [0, 0],
  [1, 2],
  [0.5, 1],
  [-4, -8],
  [1024, 2048]
]

// Testmap works for numeric I/O
const msg = (num: number): string => `Doubler on ${num}`
testmap(doubleTests, msg, doubler)

test('Testmap fails with string message on non-string I/O', () => {
  const err = "If testmap's message is a string formatter, the input type must be a string"
  expect(() => testmap(doubleTests, 'Doubler on %s', doubler)).toThrowError(err)
})

const repeater = (str: string): string => `${str}${str}`

const repeaterTests: Array<[string, string]> = [
  ['', ''],
  ['a', 'aa'],
  [' ', '  '],
  ['test', 'testtest']
]

// Testmap works for string message
testmap(repeaterTests, 'Repeater on %s', repeater)
