const html = require('bel')

const Nanocomponent = require('nanocomponent')
const nanologger = require('nanologger')
const {EditorState} = require("prosemirror-state")
const {EditorView} = require("prosemirror-view")
const {Schema, DOMParser} = require("prosemirror-model")
const {schema, defaultMarkdownParser, defaultMarkdownSerializer} = require("prosemirror-markdown")


module.exports = Editor

function Editor () {

  if (!(this instanceof Editor)) return new Editor()
  Nanocomponent.call(this)

  this._log = nanologger('Editor')
  this._element = null
  this._contents = null
  this._view = null
}

Editor.prototype = Object.create(Nanocomponent.prototype)

Editor.prototype._render = function (body) {
  var self = this

  if (!this._view) {
    this._element = html`<div id="editor" class="editor"></div>`
    this._content = body
    this._createView()
  }
  return this._element
}

Editor.prototype._update = function (body) {
  return body
}

Editor.prototype._load = function () {
  this._log.info('load')
}

Editor.prototype._unload = function () {
  this._log.info('unload')

  this._content = null
  this._body = null
  this._view = null
  this._element = null
}

Editor.prototype._createView = function (body) {
  var element = this._element
  var content = this._content

  console.log(content)

  this._log.info('create-view', body)
  let view = new EditorView(element, {
      state: EditorState.create({
        doc: defaultMarkdownParser.parse(content) })
  })
  this._view = view
}

Editor.prototype._updateView = function () {
  var content = this._content
  this._log.info('update-view', content)
}
