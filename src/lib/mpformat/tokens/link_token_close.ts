import { IToken } from '.'

export default class LinkTokenClose implements IToken {
  toHTML(): string {
    return '</a>'
  }

  toPlainText(): string {
    return ''
  }
}
