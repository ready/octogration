import { executePullsEndpoint } from './pulls'

describe('Mocked PRs endpoint', () => {
  test('passing open state only provides open PRs', () => {
    const response = executePullsEndpoint({
      type: 'GET',
      endpoint: ['repos', 'ready', 'octogration', 'pulls'],
      params: new Map([['state', 'open']])
    })

    response.data.forEach(pr => {
      expect(pr.state).toBe('open')
    })
  })

  test('passing closed state only provides closed PRs', () => {
    const response = executePullsEndpoint({
      type: 'GET',
      endpoint: ['repos', 'ready', 'octogration', 'pulls'],
      params: new Map([['state', 'closed']])
    })

    response.data.forEach(pr => {
      expect(pr.state).toBe('closed')
    })
  })

  test('not passing any state parameters provides all PRs', () => {
    const openResponse = executePullsEndpoint({
      type: 'GET',
      endpoint: ['repos', 'ready', 'octogration', 'pulls'],
      params: new Map([['state', 'open']])
    })
    const closedResponse = executePullsEndpoint({
      type: 'GET',
      endpoint: ['repos', 'ready', 'octogration', 'pulls'],
      params: new Map([['state', 'closed']])
    })
    const neitherResponse = executePullsEndpoint({
      type: 'GET',
      endpoint: ['repos', 'ready', 'octogration', 'pulls'],
      params: new Map<string, string>()
    })

    expect(openResponse.data.length + closedResponse.data.length).toBe(neitherResponse.data.length)
  })
})
