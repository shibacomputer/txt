const { ipcMain } = require('electron')

const editor = require('./editor/window')
const setup = require('./setup/window')

var manager = module.exports = {
  init,
  show
}

function init() {
  registerIpc()
}

function show(win) {
  if (typeof win === 'undefined') return
  switch (win) {
    case 'editor':
      editor.init()
      break
    case 'setup':
      setup.init()
      break
    default:
      return
  }
}

function registerIpc() {
  ipcMain.on('make-window', function(event, arg) {
    switch (arg) {
      case 'editor':
        editor.init()
        break
      case 'setup':
        setup.init()
        break
      default:
        return
    }
  })

  ipcMain.on('kill-window', function(event, arg) {
    switch (arg) {
      case 'editor':
        editor.kill()
        break
      case 'setup':
        setup.kill()
        break
      default:
        break
    }
  })
}
