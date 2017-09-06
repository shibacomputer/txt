const { ipcMain } = require('electron')

var winManager = module.exports = {
  init,
  dealloc,
  manager: null
}
