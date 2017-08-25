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
        <section>
          <label for="passphrase" class="b">Passphrase</label>
          <input type="text" name="passphrase" id="passphrase" class="b b-input"/>
          <label class="w tip">Txt uses GPG to encrypt your work. Choose a strong phrase to best protect your entires.
            <span>Make sure you write your passphrase down and save it somewhere safe. If you lost it, your work is gone forever!</span></label>
        </section>

        <footer>
          <button name="save" onclick=${saveSettings} class="bg-m f button-m">Save</button>
        </footer>

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
