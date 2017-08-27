const remote = window.require('electron').remote
const { dialog } = remote.require('electron')
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
          <input type="text" name="passphrase" id="passphrase" class="b b-input"/>
          <label class="w tip">Txt uses this passphrase to automatically encrypt and decrypt each file you create. Choose a strong phrase to best protect your files. <span class="b">Save your passphrase somewhere safe. If you lose it, your work is gone forever!</span></label>
        </section>

        <footer>
          <button name="save" onclick=${saveSettings} class="bg-m f button-m">Save & Continue</button>
        </footer>

      </main>
    </body>
  `
  function saveSettings(e) {
    emit('log:debug', 'Attempting an app state save')
    var phrase = document.getElementById('passphrase').value || ''
    if (phrase.length <= 15) {
      dialog.showMessageBox(remote.getCurrentWindow(), {
        type: 'warning',
        buttons: [
          'Continue',
          'Help',
          'Back'
        ],
        defaultId: 0,
        title: 'Insecure Passphrase',
        message: 'This is an insecure passphrase.',
        detail: 'Txt uses PGP to protect your work, but this encryption is only as strong as the passphrase you choose. You should seriously consider using something stronger.'
      }, (response) => {
        switch (response) {
          case 0:
            completeSetup(phrase)
            break
          default:
            return
        }
      })
    } else {
      completeSetup(phrase)
    }
  }
  function completeSetup(phrase) {
    utils.setSetting('active', true)
    utils.setSetting('keychain', true)
    ipcRenderer.send('window', 'main')
    emit('keychain:create', phrase)
  }
}
