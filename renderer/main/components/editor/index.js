const html = require('choo/html')
const style = require('./style')

const header = require('./header')
const footer = require('./footer')

var Composer = require('./composer')
var composer = new Composer()

module.exports = editor

function editor(state, emit) {

  function spinner() {
    return html`
      <div class=${style.spinner}> </div>
    `
  }
  return html`
    <main class=${ style.main }>
      ${ header(state, emit)}
      <div class=${ style.base }>
        ${ state.composer.uri? composer.render(state.composer, emit) : null }
        
      </div>
      ${ footer(state, emit)}
    </main>
  `
}
