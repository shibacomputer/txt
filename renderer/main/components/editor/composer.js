const Nanocomponent = require('nanocomponent')
const html = require('choo/html')
const pell = require('pell')

const style = require('./style')

module.exports = Editor

function Editor () {
  if (!(this instanceof Editor)) return new Editor()
  this.body = ''
  this.stale = ''
  this.path = null
  this.title = 'Untitled'
  this.id = ''
  this.modified = false
  this.emit = null
  Nanocomponent.call(this)
}
Editor.prototype = Object.create(Nanocomponent.prototype)

Editor.prototype.createElement = function (state, emit) {
  this.body = state.data.text.body || ''
  this.stale = state.data.text.stale || this.body
  this.id = state.data.text.id || ''
  this.path = state.data.text.path || null
  this.title = state.data.text.title || 'Untitled'
  this.modified = state.data.modified || false
  this.emit = emit
  var el = html`
    <div class="composer"></div>
  `
  const editor = pell.init({
    element: el,
    onChange: (contents) => {
      var contents = {
        body: editor.content.innerText? editor.content.innerText : state.data.text.body,
        stale: this.stale,
        id: this.id? this.id : state.data.ui.sidebar.activeId,
        path: this.path,
        title: this.title,
        modified: (editor.content.innerText != this.stale)
      }
      this.body = contents.body
      console.log(this)
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
  this.body = state.data.text.body
}
