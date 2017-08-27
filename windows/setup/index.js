const remote = window.require('electron').remote
const { ipcRenderer } = window.require('electron')

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
  var validPassphrase = false
  emit('log:debug', 'Rendering Setup View')

  return html`
    <body class="b-myc">
      <main class="${style}">
        <header class="w">
          <div class="logo">
          </div>
          <h1>Txt</h1>
          <p>Simple, private journalling</p>
        </header>
        <section>
          <label for="passphrase" class="b">Passphrase</label>
          <input type="text" name="passphrase" id="passphrase" class="b b-input" oninput=${validateInput}/>
          <label class="w tip">Txt uses this passphrase to automatically encrypt and decrypt each file you create. Choose a strong phrase to best protect your files. <span class="b">Save your passphrase somewhere safe. If you lost it, your work is gone forever!</span></label>
        </section>

        <footer>
          <button name="save" disabled=${validateInput()} onclick=${saveSettings} class="bg-m f button-m">Save & Continue</button>
        </footer>

      </main>
    </body>
  `
  function validateInput(e) {
    if (e.target.value.length >= 16) {
      validPassphrase = true
    } else {
      validPassphrase = false
    }
  }
  function saveSettings(e) {
    emit('log:debug', 'Attempting an app state save')
    var phrase = document.getElementById('passphrase').value
    utils.setSetting('active', false)
    utils.setSetting('keychain', state.key.available)
    ipcRenderer.send('window', '')
    emit('keychain:create', phrase)
  }
}
