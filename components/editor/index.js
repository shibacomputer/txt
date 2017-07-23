const html = require('choo/html')
const pell = require('pell')

module.exports = editor

function editor (state, emit) {
  var el = html`
    <div id="pell"></div>
  `
  const editor = pell.init({
    element: el,
    onChange: contents => {
      emit('note:update', contents)
    },
    styleWithCSS: true,
    classes: {
      actionbar: 'pell-actionbar-custom-name',
      button: 'pell-button-custom-name',
      content: 'pell-content-custom-name'
    }
  })

  editor.content.innerHTML = state.note.savedBody
  return el

}
