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
        ${ composer.render(state, emit) }
      </div>
      ${ footer(state, emit)}
    </main>
  `
}
