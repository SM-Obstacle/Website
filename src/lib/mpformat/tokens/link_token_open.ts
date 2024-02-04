import { IToken } from '.'

export default class LinkTokenOpen implements IToken {
  manialink: boolean
  link: string
  external: boolean

  constructor(
    manialink: boolean,
    link: string | null,
    external: boolean = false
  ) {
    this.manialink = manialink
    this.link = link || ''
    this.external = external
  }

  toHTML(): string {
    let link = this.link

    if (this.manialink && !/^maniaplanet:/i.test(link)) {
      link = `maniaplanet://#manialink=${link}`
    }
    if (!this.manialink && !/^http:/i.test(link)) {
      link = `http://${link}`
    }

    const externalAtrs =
      this.external && !this.manialink
        ? ' target="_blank" rel="noopener noreferrer"'
        : ''
    return `<a href="${link}"${externalAtrs}>`
  }

  toPlainText(): string {
    return ''
  }
}
