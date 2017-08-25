const remote = window.require('electron').remote
const { app, ipc, dialog } = remote.require('electron')
const path = require('path')

module.exports = {
  showOpenDialog: function(opts, cb) {
    opts = typeof opts === 'object' ? opts : defaults
    dialog.showOpenDialog({
      title: 'Open encytped text file',
      buttonLabel: 'Open',
      properties: ['openFile'],
      filters: [
        { name: 'Encrypted Text', extensions: ['gpg', 'txt.gpg'] }
      ]
    }, function(filePath) {
      if (filePath) {
        // @TODO: Move decryption out of the renderer.
        win.webContents.send('menu:note:open', path.normalize(filePath[0]))
      }
    })
  },
  showSaveDialog: function(opts, cb) {
    opts = typeof opts === 'object' ? opts : defaults

  },
  showErrorDialog: function(opts, cb) {
    opts = typeof opts === 'object' ? opts : defaults

  },
  showQuestionDialog: function(opts, cb) {
    opts = typeof opts === 'object' ? opts : defaults
  }
}
