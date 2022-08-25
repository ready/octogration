import { executeLive } from './executeLive'

test('Live executor runs callback in not test mode', () => {
  process.env.NODE_ENV = '~MOCKED~'
  const callback = jest.fn()

  executeLive(callback)
  expect(callback).toBeCalledTimes(1)
  process.env.NODE_ENV = 'test'
})

test('Live executor does not run callback in test mode', () => {
  const callback = jest.fn()

  executeLive(callback)
  expect(callback).not.toBeCalled()
})
