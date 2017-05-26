const remote = window.require('electron').remote
const keytar = remote.require('keytar')
const { app } = remote.require('electron')

const accountname = app.getPath('home').split('/').slice(-1)[0]
const appId = 'Txt'

module.exports = keychainStore

function keychainStore (state, emitter) {
  if (!state.keychain) {
    state.keychain = {}
    state.keychain.save = true
    state.keychain.available = true
  }

  emitter.on('DOMContentLoaded', function () {
    emitter.emit('log:debug', 'Loading Keychain Store')

    // Handle the keychain
    emitter.on('keychain:create', create)
    emitter.on('keychain:update', update)
    emitter.on('keychain:destroy', destroy)
  })

  // :: create
  // Generates they keychain element, saves it to the user's keychain, and
  // then sets a preference allowing for a saved state.
  // @params: phrase (string):   The passphrase string supplied by the user.
  function create (phrase) {
    state.keychain.save = false
    state.keychain.available = false
    console.log('🔏 ', appId, ' → ', accountname)
    keytar.addPassword(appId, accountname, phrase)
    phrase = null
    state.keychain.save = true
    state.keychain.available = true

    // Tell the global we're good to go.
    emitter.emit('global:auth')
  }

  // :: update
  // Update then save the existing authentication in the user's keychain.
  // @params: phrase (string):  The new passphrase supplied by the user.
  function update (phrase) {
    state.keychain.save = false
    state.keychain.available = false
    console.log('🔏 ', appId, ' ♽ ', accountname)
    keytar.replacePassword(appId, accountname, phrase)
    phrase = null
    state.keychain.save = true
    state.keychain.available = true
  }

  // :: destroy
  // Destroys the keychain element and tells the user's keychain that the app
  // cannot be auto-logged in again.
  function destroy () {
    state.keychain.save = false
    state.keychain.available = false
    keytar.replacePassword(appId, accountname)
    console.log('🔏 ', appId, ' 💣 ', accountname)
    emitter.emit('global:deauth')
  }
}
