const Nanocomponent = require('nanocomponent')
const html = require('choo/html')
const pell = require('pell')

module.exports = Editor

function Editor () {
  if (!(this instanceof Editor)) return new Editor()
  this.body = ''
  this.staleBody = ''
  this.modified = false
  this.emit = null
  Nanocomponent.call(this)
}
Editor.prototype = Object.create(Nanocomponent.prototype)

Editor.prototype.createElement = function (note, emit) {
  this.body = note.body || ''
  this.staleBody = note.staleBody || ''
  this.modified = note.modified || false
  this.emit = emit
  return html`
    <div class="editor"></div>
  `
}

Editor.prototype.load = function (el) {
  const editor = pell.init({
    element: el,
    onChange: (contents) => {

      var note = {
        body: editor.content.innerText,
        staleBody: this.staleBody,
        modified: (editor.content.innerText != this.staleBody)
      }

      this.emit('note:update', note)
    },
    styleWithCSS: true,
    actions: [],
    classes: {
      content: 'content'
    }
  })

  editor.content.innerText = this.staleBody

}

Editor.prototype.update = function (state) {

}
