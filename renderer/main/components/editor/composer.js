const Nanocomponent = require('nanocomponent')
const html = require('nanohtml')
const pell = require('pell')
const TurndownService = require('turndown')
const turndownService = new TurndownService()

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
        console.log(html)
        this.emit('state:composer:update', contents)
      },
      styleWithCSS: true,
      actions: [],
      classes: {
        content: 'content'
      }
    })
    this.editor.content.innerText = this.contents.stale
    return el 
  }

  update (contents, emit) {
    this.contents = contents
    if (this.contents.body != this.contents.stale) this.contents

    emit('state:composer:update', contents)
    this.editor.content.focus()
    console.log()
  }
}

module.exports = Composer
