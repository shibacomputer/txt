'use strict'

const choo = require('choo')
const css = require('sheetify')
const html = require('yo-yo')
const nano = require('nanocomponent')
const Quill = require('quill')

module.exports = editor

const base = css`
  :host{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    max-width: 48rem;
  }
`

function editor(state, prev, send) {

  var editbox = nano({
    onload: function(el) {
      var quill = new Quill('#editbox', { theme: 'bubble' });
    },

    render: function() {
      return html`
        <div id="editbox">
        </div>
      `
    }
  })

  return html`
    <div class="${base}">
      ${editbox()}
    </div>
  `
}
