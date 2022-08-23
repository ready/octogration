import { testMockedOctokit } from './mockedOctokit'

const { parseOctokitRequest } = testMockedOctokit

describe('Mocked Octokit request parsing', () => {
  enum PaserErrorMsg {
    Space = 'does not have a single space',
    Type = 'type is not GET or POST',
    Question = 'has too many question marks'
  }

  /**
   * Checks to make sure that a given input throws the specified error
   * @param input - the input to the parser for testing
   * @param errorSuffix - the error message expected to throw
   */
  function testParserError (input: string, errorSuffix: string): void {
    const expectedError = `Mocked octokit request "${input}" ${errorSuffix}`
    expect(() => parseOctokitRequest(input)).toThrowError(expectedError)
  }

  test('fails on empty string', () => {
    testParserError('', PaserErrorMsg.Space)
  })

  test('fails on multiple spaces', () => {
    testParserError('GET /repos/ready/octogration/pulls INVALID', PaserErrorMsg.Space)
  })

  test('fails on double space', () => {
    testParserError('GET  /repos/ready/octogration/pulls', PaserErrorMsg.Space)
  })

  test('fails on leading space', () => {
    testParserError(' GET /repos/ready/octogration/pulls', PaserErrorMsg.Space)
  })

  test('fails on trailing space', () => {
    testParserError('GET /repos/ready/octogration/pulls ', PaserErrorMsg.Space)
  })

  test('fails on invalid type', () => {
    testParserError('INVALID /repos/ready/octogration/pulls', PaserErrorMsg.Type)
  })

  test('fails on multiple question marks', () => {
    testParserError('GET /repos/ready/octogration/pulls?key=value?key=value', PaserErrorMsg.Question)
  })

  test('fails on missing parameter key', () => {
    const input = 'GET /repos/ready/octogration/pulls?key=value&=value'
    const expectedError = `Mocked octokit request "${input}" has parameter "=value" missing key`
    expect(() => parseOctokitRequest(input)).toThrowError(expectedError)
  })

  test('fails on missing parameter value', () => {
    const input = 'GET /repos/ready/octogration/pulls?key=value&key='
    const expectedError = `Mocked octokit request "${input}" has parameter "key=" missing value`
    expect(() => parseOctokitRequest(input)).toThrowError(expectedError)
  })

  test('fails on too many equals', () => {
    const input = 'GET /repos/ready/octogration/pulls?key=value=value2'
    const expectedError = `Mocked octokit request "${input}" has parameter "key=value=value2" malformatted key=value`
    expect(() => parseOctokitRequest(input)).toThrowError(expectedError)
  })

  test('fails on empty parameter', () => {
    const input = 'GET /repos/ready/octogration/pulls?key=value&&key2=value2'
    const expectedError = `Mocked octokit request "${input}" has parameter "" malformatted key=value`
    expect(() => parseOctokitRequest(input)).toThrowError(expectedError)
  })

  test('fails on leading &', () => {
    const input = 'GET /repos/ready/octogration/pulls?&key=value'
    const expectedError = `Mocked octokit request "${input}" has parameter "" malformatted key=value`
    expect(() => parseOctokitRequest(input)).toThrowError(expectedError)
  })

  test('fails on trailing &', () => {
    const input = 'GET /repos/ready/octogration/pulls?key=value&'
    const expectedError = `Mocked octokit request "${input}" has parameter "" malformatted key=value`
    expect(() => parseOctokitRequest(input)).toThrowError(expectedError)
  })

  test('fails on solo &', () => {
    const input = 'GET /repos/ready/octogration/pulls?&'
    const expectedError = `Mocked octokit request "${input}" has parameter "" malformatted key=value`
    expect(() => parseOctokitRequest(input)).toThrowError(expectedError)
  })
})
