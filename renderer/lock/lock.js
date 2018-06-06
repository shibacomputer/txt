const html = require('choo/html')

const lockInput = require('./components/lockInput')

const polyglot = require('../_utils/i18n/i18n')
const i18n = polyglot.init(window.navigator.language)

module.exports = lockerModal

/**
 * Unlocker modal app.
 */

function lockerModal(state, emit, opts) {
  opts? opts : opts = {
    verb: i18n.t('verbs.unlock'),
    placeholder: i18n.t('lockscreen.default')
  }

  document.title = 'Txt'
  return html`
    <body>
      ${ lockInput(state, emit, opts) }
    </body>
  `
}
