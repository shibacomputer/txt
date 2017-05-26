const html = require('choo/html')

const Nanocomponent = require('nanocomponent')
const nanologger = require('nanologger')
const {EditorState} = require('prosemirror-state')
const {EditorView} = require('prosemirror-view')
const {Schema, DOMParser} = require('prosemirror-model')
const {schema, defaultMarkdownParser, defaultMarkdownSerializer} = require('prosemirror-markdown')
const {defaultSetup} = require('../utils/plugins.js')

module.exports = Editor

function Editor () {

  if (!(this instanceof Editor)) return new Editor()
  Nanocomponent.call(this)

  this._log = nanologger('Editor')
  this._element = null
  this._note = null
  this._view = null
  this._emit = null
  this._observer = null
}

Editor.prototype = Object.create(Nanocomponent.prototype)

Editor.prototype._render = function (note, emit) {
  var self = this
  if (!this._view) {
    this._element = html`<div id="editor" class="editor"></div>`
    this._note = note
    this._emit = emit
    this._createView(note, emit)
  }
  return this._element
}

Editor.prototype._update = function (note, emit) {

  return note
}

Editor.prototype._load = function () {
  this._log.info('load')
}

Editor.prototype._unload = function () {
  this._log.info('unload')
  this._body = null
  this._view = null
  this._element = null
  this._note = null
  this._observer = null

}

Editor.prototype._createView = function (note, emit) {
  this._log.info('create-view', note.title)
  var element = this._element
  var note = this._note

  let view

  if (note.body) {
    view = new EditorView(element, {
        state: EditorState.create({
          doc: defaultMarkdownParser.parse(note.body),
        plugins: defaultSetup({schema})})
    })
  }
  this._view = view
}

Editor.prototype._updateView = function (note, emit) {
  this._log.info('update-view')
}
