import { formatFileHasVariable, getFormatFile, replaceVariables } from './releaseFormatParser'

describe('Release format parser', () => {
  test('Check format file has real variable', () => {
    expect(formatFileHasVariable('branch')).toBe(true)
  })

  test('Check format file does not have fake variable', () => {
    expect(formatFileHasVariable('blahbloop')).toBe(false)
  })

  test('Getting the format file has HTML variable in it', () => {
    const formatFile = getFormatFile()
    expect(formatFile.includes('<!--')).toBe(true)
    expect(formatFile.includes('-->')).toBe(true)
  })

  test('Replacing variables works', () => {
    const changelog = replaceVariables({ branch: 'blahbloop' })
    expect(changelog.includes('blahbloop')).toBe(true)
  })
})
