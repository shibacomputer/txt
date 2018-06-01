const Nanocomponent = require('nanocomponent')
const html = require('choo/html')
const pell = require('pell')
const TurndownService = require('turndown')
const turndownService = new TurndownService()


const style = require('./style')

module.exports = Editor

function Editor () {
  if (!(this instanceof Editor)) return new Editor()
  this.body = ''
  this.stale = ''
  this.rendered = ''
  this.uri = null
  this.name = ''
  this.id = ''
  this.modified = false
  this.emit = null
  Nanocomponent.call(this)
}
Editor.prototype = Object.create(Nanocomponent.prototype)

Editor.prototype.createElement = function (state, emit) {
  this.body = state.composer.body || ''
  this.stale = state.composer.stale || this.body
  this.rendered = this.rendered || ''
  this.id = state.composer.id || ''
  this.uri = state.composer.uri || null
  this.name = state.composer.name || 'Untitled'
  this.modified = state.status.modified || false
  this.emit = emit
  var el = html`
    <div class="composer"></div>
  `
  const editor = pell.init({
    element: el,
    actions: ['bold', 'italic', 'heading1', 'heading2', 'olist', 'ulist'],
    onChange: (html) => {
      var contents = {
        body: editor.content.innerText? editor.content.innerText : state.composer.body,
        stale: this.stale,
        id: this.id? this.id : state.status.active.id,
        uri: this.uri,
        name: this.name,
        modified: (editor.content.innerText != this.stale)
      }
      this.body = contents.body
      this.rendered = turndownService.turndown(html)

      console.log(this.rendered)
      this.emit('state:composer:update', contents)
      
    },
    styleWithCSS: true,
    actions: [],
    classes: {
      content: 'content'
    }
  })

  editor.content.innerText = this.body

  return el
}

Editor.prototype.update = function (state) {
  if (modified) return false
  this.body = state.composer.body
}
