export type RGBColor = [number, number, number]

export function hex2rgb(hexColor: string): RGBColor {
  const color = parseInt(hexColor, 16)
  return [(color & 0xff0000) >> 16, (color & 0xff00) >> 8, color & 0xff]
}

export function rgb12to24(color: number): number {
  return (
    (color & 0xf00) * 0x1100 + (color & 0xf0) * 0x110 + (color & 0xf) * 0x11
  )
}

export function rgbToLuminance(rgb: RGBColor): number {
  return (
    0.2126 * Math.pow(rgb[0] / 255, 2.2) +
    0.7151 * Math.pow(rgb[1] / 255, 2.2) +
    0.0721 * Math.pow(rgb[2] / 255, 2.2)
  )
}

export function getContrastRatio(hex1: string, hex2: string): number {
  return (
    (rgbToLuminance(hex2rgb(hex1)) + 0.05) /
    (rgbToLuminance(hex2rgb(hex2)) + 0.05)
  )
}

const UPPER = 255 + 74
export function invertLight(hexColor: string): string {
  let r = parseInt(hexColor[0], 16) * 17
  let g = parseInt(hexColor[1], 16) * 17
  let b = parseInt(hexColor[2], 16) * 17
  const grey = (r + g + b) / 3
  if (grey > 160) {
    r = Math.min(15, Math.floor((UPPER - r) / 17))
    g = Math.min(15, Math.floor((UPPER - g) / 17))
    b = Math.min(15, Math.floor((UPPER - b) / 17))
    return r.toString(16) + g.toString(16) + b.toString(16)
  }
  return hexColor
}
