const html = require('choo/html')
const pell = require('pell')

module.exports = editor

function editor (state, emit) {
  var el = html`
    <div class="editor"></div>
  `
  const editor = pell.init({
    element: el,
    onChange: contents => {
      emit('note:update', contents)
    },
    styleWithCSS: true,
    actions: [],
    classes: {
      actionbar: 'editor-actions',
      button: 'editor-button',
      content: 'editor-content'
    }
  })

  // editor.content.innerHTML = state.note.savedBody
  return el
}
