
/**
 * Interpolates a hexcolor where 0 is red, 0.5 is yellow, and 1 is green
 * @param percent - A number between 0 and 1
 * @returns a 6 digit hexcolor code string without the leading #
 */
export function interpolateProgessColor (percent: number): string {
  const p = Math.min(Math.max(percent, 0), 1)

  const good = { red: 51, green: 171, blue: 83 }
  const ok = { red: 221, green: 255, blue: 54 }
  const bad = { red: 207, green: 59, blue: 54 }

  if (p > 0.5) {
    // Interpolate between yellow and green
    const newPercent = (p - 0.5) * 2
    const color = interpolateColor(newPercent, ok, good)
    return rgbToHex(color)
  }

  // Interpolate between red and yellow
  const newPercent = p * 2
  const color = interpolateColor(newPercent, bad, ok)
  return rgbToHex(color)
}

interface RGB {
  red: number
  green: number
  blue: number
}

/**
 * @param color - An RGB color
 * @returns the equivalent hex color code as a string
 */
function rgbToHex (color: RGB): string {
  const red = color.red.toString(16)
  const green = color.green.toString(16)
  const blue = color.blue.toString(16)
  return red + green + blue
}

/**
 * Interpolates a color percent% between color 1 and color 2
 * @param percent - A number between 0 and 1
 * @param color1 - An RGB color which represents 0%
 * @param color2 - An RGB color which represents 100%
 * @returns an integer RGB color percent% between color 1 and color 2
 */
function interpolateColor (percent: number, color1: RGB, color2: RGB): RGB {
  return {
    red: Math.round(linearInterp(percent, color1.red, color2.red)),
    green: Math.round(linearInterp(percent, color1.green, color2.green)),
    blue: Math.round(linearInterp(percent, color1.blue, color2.blue))
  }
}

/**
 * Linearlly interpolates a number percent% between point1 and point2
 * @param percent - A number between 0 and 1
 * @param point1 - Any number representing 0%
 * @param point2 - Any number presenting 100%
 * @returns the linear interpolation between point1 and point2 at percent%
 */
function linearInterp (percent: number, point1: number, point2: number): number {
  const range = point2 - point1
  return percent * range + point1
}

export const testInterpolateColor = {
  interpolateColor,
  linearInterp
}
