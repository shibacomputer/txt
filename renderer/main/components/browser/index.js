const html = require('choo/html')
const style = require('./style')

const header = require('./header')
const footer = require('./footer')
const tree = require('./tree')

module.exports = browser

function browser(state, emit) {
  return html`
    <aside class="${ style.browser } ${state.sidebar.visible? '' : style.disabled}" >
      ${ header(state, emit) }
      ${ state.lib? tree(state, emit) : null }
      ${ footer(state, emit) }
    </aside>

  `

}
