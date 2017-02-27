const assert = require('assert')
const remote = window.require('electron').remote
const settings = remote.require('electron-settings')

module.exports = createModel

function createModel() {
  return {
    namespace: 'global',
    effects: {

    },
    state: {
      firstRun: true,
      databasePath: null,
    },
    reducers: {

    }
  }
}

function setDatabasePath (state, data, send, done) {
  var newPath = data
  assert.ok(newPath, 'global.setDatabasePath: data.path required')

  settings.set('hasDbLocationOf', newPath).then(() => {
    settings.set('isActiveInstall', true).then(() => {
      // @TODO: Tell Txt to do a full reload!
    })
  })
}
