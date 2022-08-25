
type TestPackage<I, O> = Array<[I, O]>
type MessageCallback<I> = (input: I) => string
type Map<I, O> = (input: I) => O

/**
 * Tests a function (map) on a whole list of tests
 * @param tests An array of tests in the format of [[input, output],...]
 * @param message A string using %s to name the tests, or a function that returns a string on input
 * @param map The function to test, takes in an input and produces an output to test against
 */
export default function testmap<I, O>
(tests: TestPackage<I, O>, message: string | MessageCallback<I>, map: Map<I, O>): void {
  tests.forEach((testPackage: [input: I, output: O]) => {
    const [input, output] = testPackage
    const msg = getMessage<I>(input, message)

    test(msg, () => {
      expect(map(input)).toBe(output)
    })
  })
}

function getMessage<I> (input: I, message: string | MessageCallback<I>): string {
  if (typeof message === 'string') {
    if (typeof input !== 'string') throw new Error("If testmap's message is a string formatter, the input type must be a string")
    return message.replace('%s', input)
  }
  return message(input)
}
