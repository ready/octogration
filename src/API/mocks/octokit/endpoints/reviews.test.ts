import { executeReviewsEndpoint } from './reviews'

describe('Mocked reviews endpoint', () => {
  test('passing an invalid id responds with a 404', () => {
    const response = executeReviewsEndpoint({
      type: 'GET',
      endpoint: ['repos', 'ready', 'octogration', 'pulls', '938967801', 'reviews'],
      params: new Map<string, string>()
    })

    expect(response.status).toBe(404)
  })

  test('no params yields all reviews', () => {
    const response = executeReviewsEndpoint({
      type: 'GET',
      endpoint: ['repos', 'ready', 'octogration', 'pulls', '13', 'reviews'],
      params: new Map<string, string>()
    })

    expect(response.status).toBe(200)
    expect(response.data.length).toBe(3)
  })

  test('call can succeed with nothing returned', () => {
    const response = executeReviewsEndpoint({
      type: 'GET',
      endpoint: ['repos', 'ready', 'octogration', 'pulls', '1', 'reviews'],
      params: new Map<string, string>()
    })

    expect(response.status).toBe(200)
    expect(response.data.length).toBe(0)
  })

  test('per_page of 1 limits the returned response to one result', () => {
    const response = executeReviewsEndpoint({
      type: 'GET',
      endpoint: ['repos', 'ready', 'octogration', 'pulls', '13', 'reviews'],
      params: new Map([['per_page', '1']])
    })

    expect(response.data.length).toBe(1)
  })

  test('per_page larger than the data works', () => {
    const response = executeReviewsEndpoint({
      type: 'GET',
      endpoint: ['repos', 'ready', 'octogration', 'pulls', '13', 'reviews'],
      params: new Map([['per_page', '1000']])
    })

    expect(response.data.length).toBeLessThanOrEqual(1000)
  })

  test('per_page of 0 returns no results', () => {
    const response = executeReviewsEndpoint({
      type: 'GET',
      endpoint: ['repos', 'ready', 'octogration', 'pulls', '13', 'reviews'],
      params: new Map([['per_page', '0']])
    })

    expect(response.data.length).toBe(0)
  })

  test('per_page of a negative number yields no results', () => {
    const response = executeReviewsEndpoint({
      type: 'GET',
      endpoint: ['repos', 'ready', 'octogration', 'pulls', '13', 'reviews'],
      params: new Map([['per_page', '-1']])
    })

    expect(response.data.length).toBe(0)
  })

  test('per_page of not a number yields no results', () => {
    const response = executeReviewsEndpoint({
      type: 'GET',
      endpoint: ['repos', 'ready', 'octogration', 'pulls', '13', 'reviews'],
      params: new Map([['per_page', 'not a number']])
    })

    expect(response.data.length).toBe(0)
  })
})
