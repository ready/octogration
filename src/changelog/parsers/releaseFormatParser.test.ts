import { formatFileHasVariable, getFormatFile, replaceVariable } from './releaseFormatParser'

test('Release format parser substitutes variables', () => {
  const prTitle = '~~This is a mocked prTitle~~'
  expect(formatFileHasVariable('prTitle')).toBe(true)
  replaceVariable('prTitle', prTitle)
  expect(getFormatFile().includes(prTitle)).toBe(true)
})
