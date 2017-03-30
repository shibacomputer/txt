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

  function update (phrase) {
    state.keychain.save = false
    state.keychain.available = false
    console.log('🔏 ', appId, ' ♽ ', accountname)
    keytar.replacePassword(appId, accountname, phrase)
    phrase = null
    state.keychain.save = true
    state.keychain.available = true
  }

  function destroy () {
    state.keychain.save = false
    state.keychain.available = false
    keytar.replacePassword(appId, accountname)
    console.log('🔏 ', appId, ' 💣 ', accountname)
    emitter.emit('global:deauth')
  }
}
