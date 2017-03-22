const remote = window.require('electron').remote
const keytar = remote.require('keytar')

module.exports = createModel

function createModel() {
  return {
    namespace: 'keychain',
    state: {
      hasKeychain: true,
      useKeychain: false,
      hasKeychainEntry: false
    },
    reducers: {
      toggle: function (state, data) {
        if (keychain === data) {
          { return state.useKeychain = !data }
        } else {
          { return state.useKeychain = data }
        }
      },
      clear: function (state, data) {
        // keytar.replacePassword('KeytarTest', 'AccountName', secret);
      }
    }
  }
}
