import { findEndpointExecutor, testMockedEndpoints } from './mockedEndpoints'

describe('Find endpoint executor', () => {
  test('able to find the commits executor', () => {
    const executor = findEndpointExecutor({
      type: 'GET',
      endpoint: ['repos', 'ready', 'octogration', 'commits'],
      params: new Map<string, string>()
    })

    expect(typeof executor).toBe('function')
  })

  test('throw error upon invalid endpoint', () => {
    expect(() => findEndpointExecutor({
      type: 'GET',
      endpoint: ['this', 'is', 'not', 'an', 'endpoint'],
      params: new Map<string, string>()
    })).toThrow('The endpoint this/is/not/an/endpoint does not match any known endpoint')
  })
})

describe('Check matching endpoint', () => {
  const { isMatchingEndpoint } = testMockedEndpoints

  test('path of literals matches', () => {
    expect(isMatchingEndpoint('endpoint/path', ['endpoint', 'path'])).toBe(true)
  })

  test('path of literals fails', () => {
    expect(isMatchingEndpoint('endpoint/path', ['endpoint', 'notpath'])).toBe(false)
  })

  test('too long path of literals fails', () => {
    expect(isMatchingEndpoint('endpoint/long/path', ['endpoint', 'path'])).toBe(false)
  })

  test('too short path of literals fails', () => {
    expect(isMatchingEndpoint('endpointpath', ['endpoint', 'path'])).toBe(false)
  })

  test('numeric paths matches', () => {
    expect(isMatchingEndpoint('endpoint/###', ['endpoint', '35'])).toBe(true)
  })

  test('non numeric paths fails', () => {
    expect(isMatchingEndpoint('endpoint/###', ['endpoint', 'path'])).toBe(false)
  })

  test('multiple numeric paths matches', () => {
    expect(isMatchingEndpoint('endpoint/###/path/###', ['endpoint', '35', 'path', '120'])).toBe(true)
  })

  test('generic paths matches', () => {
    expect(isMatchingEndpoint('endpoint/<generic>/path', ['endpoint', 'cool', 'path'])).toBe(true)
  })

  test('complex path matches', () => {
    expect(isMatchingEndpoint('<g>/endpoint/###/<>/generic/###', ['oh hey', 'endpoint', '35', 'nice', 'generic', '650'])).toBe(true)
  })

  test('remainder path matches nothing', () => {
    expect(isMatchingEndpoint('endpoint/path/<^>', ['endpoint', 'path'])).toBe(true)
  })

  test('remainder path matches literal', () => {
    expect(isMatchingEndpoint('endpoint/path/<^>', ['endpoint', 'path', 'yeah'])).toBe(true)
  })

  test('remainder path matches number', () => {
    expect(isMatchingEndpoint('endpoint/path/<^>', ['endpoint', 'path', '454'])).toBe(true)
  })

  test('remainder path matches multiple steps', () => {
    expect(isMatchingEndpoint('endpoint/path/<^>', ['endpoint', 'path', 'to', 'infinity', 'and', 'beyond'])).toBe(true)
  })

  test('remainder path does not act as remainder when not at end', () => {
    expect(isMatchingEndpoint('endpoint/path/<^>/data', ['endpoint', 'path', 'to', 'infinity', 'and', 'beyond'])).toBe(false)
  })

  test('remainder path acts as normal literal when not at end', () => {
    expect(isMatchingEndpoint('endpoint/path/<^>/data', ['endpoint', 'path', 'pqkduwbssalAJHjfja1', 'data'])).toBe(true)
  })
})

describe('Check matching endpoint step', () => {
  const { isMatchingStep } = testMockedEndpoints

  test('empty string is a literal', () => {
    expect(isMatchingStep('', '')).toBe(true)
  })

  test('empty string does not match a nonempty string', () => {
    expect(isMatchingStep('', 'nonempty')).toBe(false)
  })

  test('literal matches correct literal', () => {
    expect(isMatchingStep('literal', 'literal')).toBe(true)
  })

  test('literal not matches incorrect literal', () => {
    expect(isMatchingStep('literal', 'wrongliteral')).toBe(false)
  })

  test('literal not matches number', () => {
    expect(isMatchingStep('literal', '912')).toBe(false)
  })

  test('generic matches string', () => {
    expect(isMatchingStep('<generic>', 'literal')).toBe(true)
  })

  test('generic matches empty string', () => {
    expect(isMatchingStep('<generic>', '')).toBe(true)
  })

  test('number matches number', () => {
    expect(isMatchingStep('###', '12')).toBe(true)
  })

  test('number matches negative number', () => {
    expect(isMatchingStep('###', '-12')).toBe(true)
  })

  test('number not matches fraction', () => {
    expect(isMatchingStep('###', '4.5')).toBe(false)
  })

  test('number not matches complex fraction', () => {
    expect(isMatchingStep('###', '4.52235101')).toBe(false)
  })

  test('number matches zero', () => {
    expect(isMatchingStep('###', '0')).toBe(true)
  })

  test('number not matches nonnumber', () => {
    expect(isMatchingStep('###', '1b')).toBe(false)
  })

  test('number not matches string', () => {
    expect(isMatchingStep('###', 'number')).toBe(false)
  })

  test('number not matches nan', () => {
    expect(isMatchingStep('###', 'NaN')).toBe(false)
  })

  test('#### rule is literal', () => {
    expect(isMatchingStep('####', '6')).toBe(false)
  })

  test('## rule is literal', () => {
    expect(isMatchingStep('##', '6')).toBe(false)
  })

  test('# rule is literal', () => {
    expect(isMatchingStep('#', '6')).toBe(false)
  })

  test('missing trailing > rule is literal', () => {
    expect(isMatchingStep('generic>', 'anystring')).toBe(false)
  })

  test('missing leading < rule is literal', () => {
    expect(isMatchingStep('<generic', 'anystring')).toBe(false)
  })

  test('obscured leading < rule is literal', () => {
    expect(isMatchingStep('a<generic>', 'anystring')).toBe(false)
  })

  test('obscured trailing > rule is literal', () => {
    expect(isMatchingStep('<generic>b', 'anystring')).toBe(false)
  })

  test('double leading << rule is generic', () => {
    expect(isMatchingStep('<<generic>', 'anystring')).toBe(true)
  })

  test('double trailing >> rule is generic', () => {
    expect(isMatchingStep('<generic>>', 'anystring')).toBe(true)
  })

  test('nested <<>> rule is generic', () => {
    expect(isMatchingStep('<<generic>>', 'anystring')).toBe(true)
  })

  test('double <><> rule is generic', () => {
    expect(isMatchingStep('<>generic<>', 'anystring')).toBe(true)
  })

  test('remaining rule matches anything', () => {
    expect(isMatchingStep('<^>', 'anystring')).toBe(true)
  })

  test('remaining rule matches numbers', () => {
    expect(isMatchingStep('<^>', '111')).toBe(true)
  })
})
