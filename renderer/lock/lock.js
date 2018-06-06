const html = require('choo/html')
const style = require('./style')

const lock = require('./components/lock')
const icons = require('../_components/icons')

module.exports = lockerModal

/**
 * Unlocker modal app.
 */

function lockerModal(state, emit) {
  document.title = 'Txt'
  return html`
    <body>
      ${ lock(state, emit) }
      ${ icons() }
    </body>
  `
}
