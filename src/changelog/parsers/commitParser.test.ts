import { getCommitsByType } from './commitParser'
import { retrieveRawCommits } from '../../API/CLI/gitLog'

test('Parsed feature commits', () => {
  const parsedCommits = [{
    hash: 'd777f320a1c818eb07847d474723e2c30fb90e01',
    email: 'riverliway@gmail.com',
    type: 'feat',
    scope: '#1',
    subject: 'mocked feature commit'
  }, {
    hash: 'dafed8ea28de9706d3f9d68195a3d3711e5c9970',
    email: 'riverliway@gmail.com',
    type: 'feat',
    scope: '#2',
    subject: 'mocked feature commit'
  }, {
    hash: 'c96870a1e925de3755fdd01811dd81db464a28d8',
    email: 'riverliway@gmail.com',
    type: 'feat',
    scope: '#3',
    subject: 'mocked feature commit'
  }, {
    hash: 'a4ef2cc53d993f5e03cf0be8237d2cfc21d09240',
    email: 'riverliway@gmail.com',
    type: 'feat',
    scope: '',
    subject: 'mocked empty scope feature commit'
  }, {
    hash: 'aa90c29f92b29c8f2ba900ba3cebbeca12d1076b',
    email: 'riverliway@gmail.com',
    type: 'feat',
    subject: 'mocked emptier scope feature commit'
  }]

  expect(getCommitsByType('feat')).toStrictEqual(parsedCommits)
  expect(retrieveRawCommits).toBeCalledTimes(1)
})

test('Parsed typo commits', () => {
  const parsedCommits = [{
    hash: 'd777f320a1c818eb07847d474723e2c30fb90e01',
    email: 'riverliway@gmail.com',
    type: 'typo',
    scope: 'mockscope',
    subject: 'mocked typo commit'
  }]

  expect(getCommitsByType('typo')).toStrictEqual(parsedCommits)
  expect(retrieveRawCommits).toBeCalledTimes(1)
})

test('Double paren scope', () => {
  const parsedCommits = [{
    hash: '7332bb22234e84c735dcda62d007811e2acbe798',
    email: 'riverliway@gmail.com',
    type: 'style',
    scope: '(parenscope)',
    subject: 'double parens'
  }]

  expect(getCommitsByType('style')).toStrictEqual(parsedCommits)
  expect(retrieveRawCommits).toBeCalledTimes(1)
})

test('Parsed chore commits', () => {
  const parsedCommits = [{
    hash: 'd777f320a1c818eb07847d474723e2c30fb90e01',
    email: 'riverliway@gmail.com',
    type: 'typo',
    scope: 'mockscope',
    subject: 'mocked typo commit'
  }]

  expect(getCommitsByType('typo')).toStrictEqual(parsedCommits)
  expect(retrieveRawCommits).toBeCalledTimes(1)
})

test('Not found type is empty array', () => {
  expect(getCommitsByType('UNUSED TYPE')).toStrictEqual([])
  expect(retrieveRawCommits).toBeCalledTimes(1)
})

const mockedCommits = [
  'd777f320a1c818eb07847d474723e2c30fb90e01 riverliway@gmail.com feat(#1): mocked feature commit',
  'dafed8ea28de9706d3f9d68195a3d3711e5c9970 riverliway@gmail.com feat(#2): mocked feature commit',
  'c96870a1e925de3755fdd01811dd81db464a28d8 riverliway@gmail.com feat(#3): mocked feature commit',
  'a4ef2cc53d993f5e03cf0be8237d2cfc21d09240 riverliway@gmail.com feat(): mocked empty scope feature commit',
  'aa90c29f92b29c8f2ba900ba3cebbeca12d1076b riverliway@gmail.com feat: mocked emptier scope feature commit',
  'd777f320a1c818eb07847d474723e2c30fb90e01 riverliway@gmail.com typo(mockscope): mocked typo commit',
  '7332bb22234e84c735dcda62d007811e2acbe798 riverliway@gmail.com style((parenscope)): double parens',
  '0c5b13f5b038e4d8c3d2fb6439680e548f47273f riverliway@gmail.com chore: this is a mock commit',
  'ca505ed9ef2bbeafd7ef15c22d0b6f7ba63a6194 riverliway@gmail.com chore: this is another mock commit',
  'd9981a24dc470401f9fce814bbd1bbb70efb1080 riverliway@gmail.com chore: this is the last mock commit',
  'b569e67f71744d08669e62c4c85ec7c821272f5b riverliway@gmail.com v0.0.1'
]

jest.mock('../../API/CLI/gitLog', () => ({
  retrieveRawCommits: jest.fn().mockImplementation(() => mockedCommits)
}))
