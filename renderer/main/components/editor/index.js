const html = require('choo/html')
const style = require('./style')

const Composer = require('./composer')

const header = require('./header')
const footer = require('./footer')

// ${ state.status.reading? spinner(): null }

module.exports = editor

function editor(state, emit) {
  var composer = Composer()

  function spinner() {
    return html`
      <div class=${style.spinner}> </div>
    `
  }
  return html`
    <main class=${ style.main }>
      ${ header(state, emit)}
      <div class=${ style.base }>
        ${ state.composer.uri? composer.render(state, emit) : null }
        
      </div>
      ${ footer(state, emit)}
    </main>
  `
}
