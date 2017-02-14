'use strict'

const choo = require('choo')
const css = require('sheetify')
const html = require('yo-yo')
const Quill = require('quill')
const widget = require('cache-element/widget')

module.exports = editor

function editor(state, prev, send) {
  var container = document.getElementsByClassName('editor')
  var editor = new Quill('editor');

  return html`
    <div class="editor">
    </div>
  `

}
