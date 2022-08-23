import { executeCommitsEndpoint } from './commits'

describe('Mocked commit endpoint', () => {
  test('filters for the author riverliway@gmail.com', () => {
    const author = 'riverliway@gmail.com'
    const response = executeCommitsEndpoint({
      type: 'GET',
      endpoint: ['commits'],
      params: new Map([['author', author]])
    })

    response.data.forEach(c => {
      expect(c.author.email).toBe(author)
    })
  })

  test('filters for the author git@ready.net', () => {
    const author = 'git@ready.net'
    const response = executeCommitsEndpoint({
      type: 'GET',
      endpoint: ['commits'],
      params: new Map([['author', author]])
    })

    response.data.forEach(c => {
      expect(c.author.email).toBe(author)
    })
  })

  test('no author search param yields multiple authors', () => {
    const response = executeCommitsEndpoint({
      type: 'GET',
      endpoint: ['commits'],
      params: new Map<string, string>()
    })

    const authors = [...new Set(response.data.map(c => c.author))]
    expect(authors.length).toBeGreaterThan(1)
  })

  test('invalid author yields no commits', () => {
    const response = executeCommitsEndpoint({
      type: 'GET',
      endpoint: ['commits'],
      params: new Map([['author', 'thisisnotanauthor']])
    })

    expect(response.data.length).toBe(0)
  })

  test('per_page of 1 limits the returned response to one result', () => {
    const response = executeCommitsEndpoint({
      type: 'GET',
      endpoint: ['commits'],
      params: new Map([['per_page', '1']])
    })

    expect(response.data.length).toBe(1)
  })

  test('per_page larger than the data works', () => {
    const response = executeCommitsEndpoint({
      type: 'GET',
      endpoint: ['commits'],
      params: new Map([['per_page', '1000']])
    })

    expect(response.data.length).toBeLessThanOrEqual(1000)
  })

  test('per_page of 0 returns no results', () => {
    const response = executeCommitsEndpoint({
      type: 'GET',
      endpoint: ['commits'],
      params: new Map([['per_page', '0']])
    })

    expect(response.data.length).toBe(0)
  })

  test('per_page of a negative number yields no results', () => {
    const response = executeCommitsEndpoint({
      type: 'GET',
      endpoint: ['commits'],
      params: new Map([['per_page', '-1']])
    })

    expect(response.data.length).toBe(0)
  })

  test('per_page of not a number yields no results', () => {
    const response = executeCommitsEndpoint({
      type: 'GET',
      endpoint: ['commits'],
      params: new Map([['per_page', 'not a number']])
    })

    expect(response.data.length).toBe(0)
  })
})
