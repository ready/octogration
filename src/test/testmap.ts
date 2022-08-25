/**
 * This is a Jest utility file that makes creating multiple test cases
 * for a single function very simple. Start by creating an array of test
 * cases that are formatted as a tuple.
 *
 * This example will create three unit tests and
 * test the parseInt function with each input
 *
 * const testCases = [
 *  ['1234567', 1234567], // means parseInt('1234567') should be 1234567 (number)
 *  ['-12', -12],
 *  ['0', 0]
 * ]
 *
 * testmap(testCases, 'Test parseInt with %s', parseInt)
 *
 * The message will replace all instances of %s with the input for that case
 * The parameter can also be a callback that takes the input and creates the name
 */

type TestPackage<I, O> = Array<[I, O]>
type MessageCallback<I> = (input: I) => string
type Map<I, O> = (input: I) => O

/**
 * Tests a function (map) on a whole list of tests
 * @param tests - An array of tests in the format of [[input, output],...]
 * @param message - A string using %s to name the tests, or a function that returns a string on input
 * @param map - The function to test, takes in an input and produces an output to test against
 */
export default function testmap<I, O>
(tests: TestPackage<I, O>, message: string | MessageCallback<I>, map: Map<I, O>): void {
  tests.forEach(([input, output]: [input: I, output: O]) => {
    const msg = getMessage<I>(input, message)

    test(msg, () => {
      expect(map(input)).toBe(output)
    })
  })
}

/**
 * Gets the message that is used as the name of the test
 * @param input - the input to the map for the test case
 * @param message - the string or callback used to create the message
 * @returns the message
 */
function getMessage<I> (input: I, message: string | MessageCallback<I>): string {
  if (typeof message === 'string') {
    if (typeof input !== 'string') {
      throw new Error("If testmap's message is a string formatter, the input type must be a string")
    }
    return message.replace('%s', input)
  }
  return message(input)
}
