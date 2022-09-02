import testmap from '../test/testmap'
import { interpolateProgessColor, RGB, testInterpolateColor } from './interpolateColor'
const { rgbToHex, interpolateColor, linearInterp } = testInterpolateColor

describe('Interpolate progress color', () => {
  const interpolateProgessColorTests: Array<[number, string]> = [
    [0, 'cf3b36'],
    [0.25, 'd69d36'],
    [0.5, 'ddff36'],
    [0.75, '88d545'],
    [1, '33ab53'],
    [-1, 'cf3b36'],
    [12, '33ab53']
  ]

  const interpolateProgressMsg = (p: number): string => `${p * 100}%`
  testmap(interpolateProgessColorTests, interpolateProgressMsg, interpolateProgessColor)
})

describe('Interpolate color', () => {
  test('Every percentage between two indentical interpolation colors yields the same', () => {
    const color = { red: 24, green: 190, blue: 2 }
    const percents = [0, 0.1, 0.2, 0.34551, 0.5, 0.75, 1]

    percents.forEach(p => {
      expect(interpolateColor(p, color, color)).toEqual(color)
    })
  })

  test('Halfway between white and black is gray', () => {
    const white = { red: 255, green: 255, blue: 255 }
    const black = { red: 0, green: 0, blue: 0 }
    const gray = { red: 128, green: 128, blue: 128 }

    expect(interpolateColor(0, white, black)).toEqual(white)
    expect(interpolateColor(1, white, black)).toEqual(black)
    expect(interpolateColor(0.5, white, black)).toEqual(gray)
  })
})

describe('Convert color to hex', () => {
  const rgbToHexTests: Array<[RGB, string]> = [
    [{ red: 0, green: 0, blue: 0 }, '000000'],
    [{ red: 255, green: 255, blue: 255 }, 'ffffff'],
    [{ red: 255, green: 0, blue: 0 }, 'ff0000'],
    [{ red: 0, green: 255, blue: 0 }, '00ff00'],
    [{ red: 0, green: 0, blue: 255 }, '0000ff'],
    [{ red: 91, green: 128, blue: 1 }, '5b8001'],
    [{ red: 6, green: 200, blue: 127 }, '06c87f'],
    [{ red: 9, green: 55, blue: 142 }, '09378e'],
    [{ red: 213, green: 45, blue: 46 }, 'd52d2e'],
    [{ red: 100, green: 200, blue: 30 }, '64c81e']
  ]

  const rgbToHexMsg = (color: RGB): string => {
    return `r: ${color.red} g: ${color.green} b: ${color.blue}`
  }
  testmap(rgbToHexTests, rgbToHexMsg, rgbToHex)

  // Generate 100 random tests to make sure the output is valid hex
  const randByte = (): number => Math.round(Math.random() * 255)

  for (let i = 0; i < 100; i++) {
    const color = { red: randByte(), green: randByte(), blue: randByte() }
    test(rgbToHexMsg(color) + 'is validated', () => {
      const hex = rgbToHex(color)
      expect(hex.length).toBe(6)
      expect(hex).toMatch(/^[a-fA-F0-9]+$/)
    })
  }
})

describe('Linear Interpolation', () => {
  type LinearInterpParams = [number, number, number]
  const linearInterpTests: Array<[LinearInterpParams, number]> = [
    [[0, 0, 0], 0],
    [[1, 0, 0], 0],
    [[0.5, 0, 0], 0],
    [[0, 0, 1], 0],
    [[1, 0, 1], 1],
    [[0.5, 0, 1], 0.5],
    [[0.5, 10, 20], 15],
    [[0.25, 100, 200], 125],
    [[0.5, -100, 100], 0],
    [[0.75, -100, 100], 50],
    [[0.2, 1000, 3000], 1400]
  ]

  const linearInterpMsg = (params: LinearInterpParams): string => {
    return `between ${params[1]} and ${params[2]} at ${params[0] * 100}%`
  }
  const testMapper = (params: LinearInterpParams): number => {
    return linearInterp(params[0], params[1], params[2])
  }
  testmap(linearInterpTests, linearInterpMsg, testMapper)
})
