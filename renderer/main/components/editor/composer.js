const Nanocomponent = require('nanocomponent')
const html = require('nanohtml')
const pell = require('pell')

const style = require('./style')

class Composer extends Nanocomponent {

  constructor () {
    super()
    this.editor = null
    this.contents = { }
    this.emit = null
  }

  createElement (contents, emit) {
    this.contents = contents
    this.emit = emit

    let el = html`
      <div class="composer"></div>
    `

    this.editor = pell.init({
      element: el,
      actions: ['bold', 'italic', 'heading1', 'heading2', 'olist', 'ulist'],
      onChange: (html) => {
        this.contents.body = this.editor.content.innerText
        this.contents.html = html
        emit('state:composer:update', contents)
      },
      styleWithCSS: true,
      actions: [],
      classes: {
        content: 'content'
      }
    })
    this.editor.content.innerText = this.contents.body === this.contents.stale? this.contents.body : this.contents.stale
    return el
  }

  update (contents, emit) {
    if (!this.contents) this.contents = contents
    if (this.contents.body != this.contents.stale) this.contents
    this.editor.content.focus()
  }
}

module.exports = Composer
