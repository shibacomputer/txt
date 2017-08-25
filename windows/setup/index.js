const path = require('path')
const html = require('choo/html')
const utils = require('../../utils/utils')
const style = require('./style')

module.exports = setupWindow

/**
 * The Setup Window handles initialisation of a
 * new app install and related functionality setup.
 */
function setupWindow(state, emit) {
  emit('log:debug', 'Rendering Setup View')

  return html`
    <body class="b-myc">
      <main class="${style}">
        <header class="w">
          <h1>Txt</h1>
          <p>Simple, private journalling</p>
        </header>
        <div>
          Let's get started. 
        </div>
      </main>
    </body>
  `

  function saveSettings(e) {
    emit('log:debug', 'Attempting an app state save')
    var phrase = document.getElementById('passphrase').value
    utils.setSetting('active', true)
    utils.setSetting('keychain', state.key.available)
    emit('keychain:create', phrase)
  }
}
