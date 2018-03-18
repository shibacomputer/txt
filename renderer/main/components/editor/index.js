const html = require('choo/html')
const style = require('./style')

const Composer = require('./composer')

const header = require('./header')
const footer = require('./footer')


module.exports = editor

function editor(state, emit) {
  var composer = Composer()
  return html`
    <main class=${ style.main }>
      ${ header(state, emit)}
      <div class=${ style.base }>
        ${ state.data.text.path? composer.render(state, emit) : null }
      </div>
      ${ footer(state, emit)}
    </main>
  `
}
