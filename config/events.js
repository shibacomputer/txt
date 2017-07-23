const { ipcMain } = require('electron')

module.exports = events

function events (state, emit) {
  ipcRenderer.on('command', (event) => {

  })
}
