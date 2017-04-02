'use strict'

const html = require('choo/html')
const css = require('sheetify')
const nano = require('nanocomponent')
const Quill = require('quill')

module.exports = editor

const base = css`
  :host {
    width: auto;
    height: 100%;
    color: white;
    display: flex;
    flex: auto;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
`

const box = css`
  :host{
    width: 100%;
    max-width: 48rem;
  }
`

css('../css/editor.css')

function editor (state, emit) {

  var editbox = nano({
    onload: function(el) {
      var quill = new Quill('#editbox', {
        theme: 'bubble'
      });
      quill.setText(state.note.body, '\n');
    },

    render: function() {
      return html`
        <div id="editbox" class="${box}"></div>
      `
    }
  })

  return html`
    <div class="${base}">
      <header class="title">
      ${ state.note.title }
      </header>
      ${editbox()}
    </div>
  `
}
