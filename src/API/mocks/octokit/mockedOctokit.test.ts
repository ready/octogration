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

  describe('fails on', () => {
    test('empty string', () => {
      testParserError('', PaserErrorMsg.Space)
    })

    test('multiple spaces', () => {
      testParserError('GET /repos/ready/octogration/pulls INVALID', PaserErrorMsg.Space)
    })

    test('double space', () => {
      testParserError('GET  /repos/ready/octogration/pulls', PaserErrorMsg.Space)
    })

    test('leading space', () => {
      testParserError(' GET /repos/ready/octogration/pulls', PaserErrorMsg.Space)
    })

    test('trailing space', () => {
      testParserError('GET /repos/ready/octogration/pulls ', PaserErrorMsg.Space)
    })

    test('invalid type', () => {
      testParserError('INVALID /repos/ready/octogration/pulls', PaserErrorMsg.Type)
    })

    test('multiple question marks', () => {
      testParserError('GET /repos/ready/octogration/pulls?key=value?key=value', PaserErrorMsg.Question)
    })

    test('missing parameter key', () => {
      const input = 'GET /repos/ready/octogration/pulls?key=value&=value'
      const expectedError = `Mocked octokit request "${input}" has parameter "=value" missing key`
      expect(() => parseOctokitRequest(input)).toThrowError(expectedError)
    })

    test('missing parameter value', () => {
      const input = 'GET /repos/ready/octogration/pulls?key=value&key='
      const expectedError = `Mocked octokit request "${input}" has parameter "key=" missing value`
      expect(() => parseOctokitRequest(input)).toThrowError(expectedError)
    })

    test('too many equals', () => {
      const input = 'GET /repos/ready/octogration/pulls?key=value=value2'
      const expectedError = `Mocked octokit request "${input}" has parameter "key=value=value2" malformatted key=value`
      expect(() => parseOctokitRequest(input)).toThrowError(expectedError)
    })

    test('empty parameter', () => {
      const input = 'GET /repos/ready/octogration/pulls?key=value&&key2=value2'
      const expectedError = `Mocked octokit request "${input}" has parameter "" malformatted key=value`
      expect(() => parseOctokitRequest(input)).toThrowError(expectedError)
    })

    test('leading &', () => {
      const input = 'GET /repos/ready/octogration/pulls?&key=value'
      const expectedError = `Mocked octokit request "${input}" has parameter "" malformatted key=value`
      expect(() => parseOctokitRequest(input)).toThrowError(expectedError)
    })

    test('trailing &', () => {
      const input = 'GET /repos/ready/octogration/pulls?key=value&'
      const expectedError = `Mocked octokit request "${input}" has parameter "" malformatted key=value`
      expect(() => parseOctokitRequest(input)).toThrowError(expectedError)
    })

    test('solo &', () => {
      const input = 'GET /repos/ready/octogration/pulls?&'
      const expectedError = `Mocked octokit request "${input}" has parameter "" malformatted key=value`
      expect(() => parseOctokitRequest(input)).toThrowError(expectedError)
    })
  })

  describe('succeeds with', () => {
    test('GET', () => {
      const input = 'GET /repos/ready/octogration/pulls'
      const output = {
        type: 'GET',
        endpoint: ['repos', 'ready', 'octogration', 'pulls'],
        params: new Map<string, string>()
      }
      expect(parseOctokitRequest(input)).toEqual(output)
    })

    test('POST', () => {
      const input = 'POST /repos/ready/octogration/pulls'
      const output = {
        type: 'POST',
        endpoint: ['repos', 'ready', 'octogration', 'pulls'],
        params: new Map<string, string>()
      }
      expect(parseOctokitRequest(input)).toEqual(output)
    })

    test('no leading /', () => {
      const input = 'POST repos/ready/octogration/pulls'
      const output = {
        type: 'POST',
        endpoint: ['repos', 'ready', 'octogration', 'pulls'],
        params: new Map<string, string>()
      }
      expect(parseOctokitRequest(input)).toEqual(output)
    })

    test('trailing /', () => {
      const input = 'GET /repos/ready/octogration/commits/?key=value'
      const output = {
        type: 'GET',
        endpoint: ['repos', 'ready', 'octogration', 'commits'],
        params: new Map<string, string>([['key', 'value']])
      }
      expect(parseOctokitRequest(input)).toEqual(output)
    })

    test('single parameter', () => {
      const input = 'GET /repos/ready/octogration/commits?key=value'
      const output = {
        type: 'GET',
        endpoint: ['repos', 'ready', 'octogration', 'commits'],
        params: new Map<string, string>([['key', 'value']])
      }
      expect(parseOctokitRequest(input)).toEqual(output)
    })

    test('multiple parameters', () => {
      const input = 'POST /some/endpoint/path?key1=value1&key2=value2&key3=value3'
      const output = {
        type: 'POST',
        endpoint: ['some', 'endpoint', 'path'],
        params: new Map<string, string>([['key1', 'value1'], ['key2', 'value2'], ['key3', 'value3']])
      }
      expect(parseOctokitRequest(input)).toEqual(output)
    })

    test('no endpoint including parameters', () => {
      const input = 'POST ?key1=value1&key2=value2&key3=value3'
      const output = {
        type: 'POST',
        endpoint: [],
        params: new Map<string, string>([['key1', 'value1'], ['key2', 'value2'], ['key3', 'value3']])
      }
      expect(parseOctokitRequest(input)).toEqual(output)
    })

    test('no endpoint excluding parameters', () => {
      const input = 'POST '
      const output = {
        type: 'POST',
        endpoint: [],
        params: new Map<string, string>()
      }
      expect(parseOctokitRequest(input)).toEqual(output)
    })

    test('solo endpoint', () => {
      const input = 'GET endpoint'
      const output = {
        type: 'GET',
        endpoint: ['endpoint'],
        params: new Map<string, string>()
      }
      expect(parseOctokitRequest(input)).toEqual(output)
    })

    test('double /', () => {
      const input = 'GET endpoint//path'
      const output = {
        type: 'GET',
        endpoint: ['endpoint', 'path'],
        params: new Map<string, string>()
      }
      expect(parseOctokitRequest(input)).toEqual(output)
    })
  })
})
