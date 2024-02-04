import { IToken, Style } from '.'
import { rgb12to24 } from '../color'

export default class GenericToken implements IToken {
  style: number
  text: string

  constructor(style: number | null, text: string | null) {
    this.style = style || 0
    this.text = text || ''
  }

  toHTML(): string {
    let color = ''
    let styleStack = []
    if (this.style) {
      if (this.style & Style.COLORED) {
        color = rgb12to24(this.style & 0xfff).toString(16)
        if (color.length === 1) {
          color = `00000${color}`
        } else if (color.length === 2) {
          color = `0000${color}`
        } else if (color.length === 4) {
          color = `00${color}`
        }
        styleStack.push(`color: #${color};`)
      }
      if (this.style & Style.ITALIC) {
        styleStack.push('font-style: italic;')
      }
      if (this.style & Style.BOLD) {
        styleStack.push('font-weight: bold;')
      }
      if (this.style & Style.SHADOWED) {
        styleStack.push('text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);')
      }
      if (this.style & Style.WIDE) {
        styleStack.push('letter-spacing: .1em; font-size: 105%;')
      } else if (this.style & Style.NARROW) {
        styleStack.push('letter-spacing: -.1em; font-size: 95%;')
      }
      return `<span style="${styleStack.join(' ')}">${this.text}</span>`
    } else {
      return this.text
    }
  }

  toPlainText(): string {
    return this.text
  }
}
