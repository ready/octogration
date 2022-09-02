import { OctokitRequest } from '../mockedOctokit'
import { executeCreateReleaseEndpoint, testCreateRelease } from './createRelease'
const { isValidString, isValidBoolean } = testCreateRelease

describe('Mocked create release', () => {
  const request: OctokitRequest = {
    type: 'POST',
    endpoint: ['repos', 'ready', 'octogration', 'releases'],
    params: new Map<string, string>()
  }

  test('fails on non-post request type', () => {
    const response = executeCreateReleaseEndpoint({ ...request, type: 'GET' })
    expect(response.data).toBe(false)
  })

  test('fails on empty data', () => {
    const data = {}
    const response = executeCreateReleaseEndpoint({ ...request, data })
    expect(response.data).toBe(false)
  })

  test('fails on missing tag name', () => {
    const data = {
      target_commitish: 'main',
      name: 'mocked release title',
      body: 'mocked release body',
      draft: false,
      prerelease: false,
      generate_release_notes: false
    }
    const response = executeCreateReleaseEndpoint({ ...request, data })
    expect(response.data).toBe(false)
  })

  test('works on only including tag name', () => {
    const data = {
      tag_name: 'tag name'
    }
    const response = executeCreateReleaseEndpoint({ ...request, data })
    expect(response.data).toBe(true)
  })

  test('works on full data', () => {
    const data = {
      tag_name: 'mocked tag name',
      target_commitish: 'main',
      name: 'mocked release title',
      body: 'mocked release body',
      draft: false,
      prerelease: false,
      generate_release_notes: false
    }
    const response = executeCreateReleaseEndpoint({ ...request, data })
    expect(response.data).toBe(true)
  })

  test('fails on nonstring target_commitish', () => {
    const data = {
      tag_name: 'mocked tag name',
      target_commitish: 10
    }
    const response = executeCreateReleaseEndpoint({ ...request, data })
    expect(response.data).toBe(false)
  })

  test('fails on nonstring name', () => {
    const data = {
      tag_name: 'mocked tag name',
      name: 10
    }
    const response = executeCreateReleaseEndpoint({ ...request, data })
    expect(response.data).toBe(false)
  })

  test('fails on nonstring body', () => {
    const data = {
      tag_name: 'mocked tag name',
      body: 10
    }
    const response = executeCreateReleaseEndpoint({ ...request, data })
    expect(response.data).toBe(false)
  })

  test('fails on nonstring draft', () => {
    const data = {
      tag_name: 'mocked tag name',
      draft: 10
    }
    const response = executeCreateReleaseEndpoint({ ...request, data })
    expect(response.data).toBe(false)
  })

  test('fails on nonstring prerelease', () => {
    const data = {
      tag_name: 'mocked tag name',
      prerelease: 10
    }
    const response = executeCreateReleaseEndpoint({ ...request, data })
    expect(response.data).toBe(false)
  })

  test('fails on nonstring generate_release_notes', () => {
    const data = {
      tag_name: 'mocked tag name',
      generate_release_notes: 10
    }
    const response = executeCreateReleaseEndpoint({ ...request, data })
    expect(response.data).toBe(false)
  })
})

describe('Is valid string', () => {
  test('fails on undefined', () => {
    expect(isValidString(undefined, 'field', false)).toBe(false)
  })

  test('fails on number', () => {
    expect(isValidString(15, 'field', false)).toBe(false)
  })

  test('fails on string', () => {
    expect(isValidString('string', 'field', false)).toBe(false)
  })

  test('fails on boolean', () => {
    expect(isValidString(true, 'field', false)).toBe(false)
  })

  test('works on optional', () => {
    expect(isValidString({}, 'field', true)).toBe(true)
  })

  test('works on optional with other fields', () => {
    const data = { field2: 'nice', field3: true, field4: 10 }
    expect(isValidString(data, 'field', true)).toBe(true)
  })

  test('fails on nonoptional field not included', () => {
    expect(isValidString({}, 'field', false)).toBe(false)
  })

  test('fails on nonoptional field bad type', () => {
    expect(isValidString({ field: 10 }, 'field', false)).toBe(false)
  })

  test('works on valid field', () => {
    expect(isValidString({ field: 'datum' }, 'field', false)).toBe(true)
  })

  test('works on valid field with other fields', () => {
    const data = { field: 'datum', field2: 'nice', field3: true, field4: 10 }
    expect(isValidString(data, 'field', false)).toBe(true)
  })
})

describe('Is valid boolean', () => {
  test('fails on undefined', () => {
    expect(isValidBoolean(undefined, 'field', false)).toBe(false)
  })

  test('fails on number', () => {
    expect(isValidBoolean(15, 'field', false)).toBe(false)
  })

  test('fails on string', () => {
    expect(isValidBoolean('string', 'field', false)).toBe(false)
  })

  test('fails on boolean', () => {
    expect(isValidBoolean(true, 'field', false)).toBe(false)
  })

  test('works on optional', () => {
    expect(isValidBoolean({}, 'field', true)).toBe(true)
  })

  test('works on optional with other fields', () => {
    const data = { field2: 'nice', field3: true, field4: 10 }
    expect(isValidBoolean(data, 'field', true)).toBe(true)
  })

  test('fails on nonoptional field not included', () => {
    expect(isValidBoolean({}, 'field', false)).toBe(false)
  })

  test('fails on nonoptional field bad type', () => {
    expect(isValidBoolean({ field: 10 }, 'field', false)).toBe(false)
  })

  test('works on valid field', () => {
    expect(isValidBoolean({ field: true }, 'field', false)).toBe(true)
  })

  test('works on valid field with other fields', () => {
    const data = { field: false, field2: 'nice', field3: true, field4: 10 }
    expect(isValidBoolean(data, 'field', false)).toBe(true)
  })
})
