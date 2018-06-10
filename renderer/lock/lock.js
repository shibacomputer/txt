const html = require('choo/html')

const lockInput = require('./components/lockInput')

const polyglot = require('../_utils/i18n/i18n')
const i18n = polyglot.init(window.navigator.language)

module.exports = lockerModal

/**
 * Unlocker modal app.
 */

function lockerModal(state, emit) {
  let opts
  switch (state.type) {
    case 'new':
      opts = {
        verb: i18n.t('verbs.export'),
        placeholder: i18n.t('lockscreen.export'),
        error: i18n.t('lockscreen.encryptionError')
      }
    break
    default:
      opts = {
        verb: i18n.t('verbs.unlock'),
        placeholder: i18n.t('lockscreen.default'),
        error: i18n.t('lockscreen.passphraseError')
      }
    break
  }

  document.title = 'Txt'
  return html`
    <body>
      ${ lockInput(state, emit, opts) }
    </body>
  `
}
