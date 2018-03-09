const html = require('choo/html')
const style = require('./style')

const header = require('./header')
const footer = require('./footer')
const tree = require('./tree')

module.exports = browser

function browser(state, emit) {
  return html`
    <aside class=${ style.browser }>
      ${ header(state, emit) }
      ${ tree(state, emit) }
      ${ footer(state, emit) }
    </aside>

  `

}
