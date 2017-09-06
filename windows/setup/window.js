var { BrowserWindow, Menu, ipcMain } = require('electron')
const window = require('electron-window')
const path = require('path')
const config = require('../../config/defaults')
const menu = require('../../config/menu')

const URL = 'file://' + path.resolve('./index.html')

var editorWindow = module.exports = {
  init
}

function init () {
  const setupWindow = window.createWindow(config.setup)
  menu = Menu.buildFromTemplate(menu.setup)
  Menu.setApplicationMenu(menu)

  setupWindow.loadURL(URL)

  // Events
  setupWindow.once('ready-to-show', setupWindow.show)

  setupWindow.on('ready-to-close', (e) => {
    // Check the setup state
  })

  setupWindow.on('closed', (e) => {
    setupWindow = null
  })
}
