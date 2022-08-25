import { readFileSync, writeFileSync } from 'fs'
import { getSource, setSource, writeSources } from './readmeParser'

test('setting source before getting any sources fails', () => {
  const err = 'The alt text was not gotten before attempting to set'
  expect(() => setSource('', '')).toThrowError(err)
})

test('writing sources before getting any sources fails', () => {
  const err = 'No sources have been read before attempting to write'
  expect(writeSources).toThrowError(err)
})

test('multiple calls to getSource only reads the file once', () => {
  getSource('alt1')
  getSource('alt2')
  getSource('alt3')
  expect(readFileSync).toBeCalledTimes(1)
})

test('non-existant alt text does not get found', () => {
  const source = getSource('THIS_SOURCE_DOESNT_EXIST')
  expect(source).toBe(undefined)
})

test('reversed alt and source does not get found', () => {
  const source = getSource('reversed-alt')
  expect(source).toBe(undefined)
})

test('no image alt does not get found', () => {
  const source = getSource('no-image-alt')
  expect(source).toBe(undefined)
})

test('images with only an alt does not get found', () => {
  const source = getSource('solo-alt')
  expect(source).toBe(undefined)
})

test('non-first alt text does not get found', () => {
  const source = getSource('non-first-alt')
  expect(source).toBe(undefined)
})

test('missing quote alt does not get found', () => {
  const source = getSource('missing-quote-alt')
  expect(source).toBe(undefined)
})

test('good alt gets found', () => {
  const source = getSource('good-alt')
  expect(source).toBe('good-src')
})

test('setting good alt before getting it fails', () => {
  const err = 'The alt text was not gotten before attempting to set'
  expect(() => setSource('good-alt2', 'new-source')).toThrowError(err)
})

test('setting good alt after getting it works', () => {
  const goodSource = getSource('good-alt')
  expect(goodSource).toBe('good-src')

  setSource('good-alt', 'new-good-src')
  expect(getSource('good-alt')).toBe('new-good-src')

  setSource('good-alt', 'good-src')
  expect(goodSource).toBe('good-src')
})

test('writing good alt works', () => {
  const goodSource = getSource('good-alt')
  expect(goodSource).toBe('good-src')

  setSource('good-alt', 'super-great-new-good-src')
  expect(getSource('good-alt')).toBe('super-great-new-good-src')

  const oldOutput = mockedReadmeOutput
  writeSources()
  expect(writeFileSync).toBeCalled()

  const html = '<img alt="good-alt" src="super-great-new-good-src" />'
  expect(count(mockedReadmeOutput, html)).toBe(1)
  mockedReadmeOutput = oldOutput

  setSource('good-alt', 'good-src')
  expect(goodSource).toBe('good-src')
})

test('writing to duplicate alt works for all sources', () => {
  const goodSource = getSource('duplicate-alt')
  expect(goodSource).toBe('duplicate-src')

  setSource('duplicate-alt', 'still-duplicate-src')
  expect(getSource('duplicate-alt')).toBe('still-duplicate-src')

  const oldOutput = mockedReadmeOutput
  writeSources()
  expect(writeFileSync).toBeCalled()

  const html = '<img alt="duplicate-alt" src="still-duplicate-src" />'
  expect(count(mockedReadmeOutput, html)).toBe(2)
  mockedReadmeOutput = oldOutput
})

test('not finished image does not get found', () => {
  const source = getSource('not-finished-alt')
  expect(source).toBe(undefined)
})

const mockedReadme = `
This is a mocked readme for testing purposes.
<img src="reversed-src" alt="reversed-alt" />

Hey this isn't an image alt="no-image-alt" src="no-image-src"

This is just an alt <img alt="solo-alt" />

<img width="200" alt="non-first-alt" src="non-first-src" />

<img alt="missing-quote-alt" src="missing-quote-src />

<img alt="good-alt" src="good-src" />

<img alt="good-alt2" src="good-src" />

<img alt="duplicate-alt" src="duplicate-src" />
<img alt="duplicate-alt" src="duplicate-src" />

<img alt="not-finished-alt" src="not-finished-src"`

let mockedReadmeOutput = ''

jest.mock('fs', () => ({
  readFileSync: jest.fn().mockImplementation((cmd: string) => {
    if (cmd !== 'README.md') {
      throw new Error('Unexpected file')
    }

    return {
      toString: () => mockedReadme
    }
  }),
  writeFileSync: jest.fn().mockImplementation((cmd: string, content: string) => {
    if (cmd !== 'README.md') {
      throw new Error('Unexpected file')
    }

    mockedReadmeOutput = content
  })
}))

/**
 * Counts the number of occurances of a substring in a string
 * Does not count overlapping substrings
 * @param str - the string to search
 * @param substr - the substring to search for
 * @returns the number of times substrt appears in str
 */
function count (str: string, substr: string): number {
  return str.split(substr).length - 1
}
