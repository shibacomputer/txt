const { ipcRenderer } = require('electron')

const settings = require('electron-settings')

module.exports = createModel()

function createModel() {
  return {
    namespace: 'global',
    state: {
      setup: false,
      currentNote: null,
      locked: false,
      usesKeychain: false,
      theme: 'dark',
      url: null
    },
    reducers: {
      setup: (state, data) => data,
      currentNote: (state, data) => data,
      url: (state, data) => data
    }
  }
}
