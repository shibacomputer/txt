const html = require('choo/html')
const pell = require('pell')

module.exports = editor

function editor (state, emit) {
  var el, editor

  init()

  function init() {
    el = html`
      <div class="editor"></div>
    `
    editor = pell.init({
      element: el,
      onChange: (contents) => {
        update(contents)
      },
      styleWithCSS: true,
      actions: [],
      classes: {
        content: 'content'
      }
    })

    function update(contents) {
      emit('note:update', editor.content.innerText)
    }

    editor.content.innerText = state.note.staleBody
  }
  return el
}
