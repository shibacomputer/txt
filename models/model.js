const path = require('path')
const utils = require('../utils/utils')

module.exports = createModel

function createModel() {
  return {
    namespace: 'model',
    state: {
      locked: true,
      path: null
    },
    reducers: {
      setDbPath: setDatabasePath
    }
  }
}

function setDatabasePath (state, data) {
  utils.setSetting('hasDbLocationOf', data, () => {
    return { path: data }
  })
}

function getDatabasePath () {
  utils.getSettings('hasDbLocationOf', (dbPath) => {
    return dbPath
  })
}
