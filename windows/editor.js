'use strict'

const choo = require('choo')
const css = require('sheetify')
const html = require('yo-yo')
const nano = require('nanocomponent')
const Quill = require('quill')

module.exports = editor


function editor(state, prev, send) {
  var container = document.getElementById('editor');
  var editor = new Quill(container);

  return html`
    <div id="editor">
    </div>
  `
}
