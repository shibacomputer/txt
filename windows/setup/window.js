const { BrowserWindow, Menu, ipcMain } = require('electron')
const window = require('electron-window')
const path = require('path')
const config = require('../../config/defaults')
const menu = require('../../config/menu')

const URL = 'file://' + path.resolve('./index.html')

var editorWindow = module.exports = {
  init,
  show,
  hide,
  win: null
}
var win = null

function init() {
  win = window.createWindow(config.setup)

  var appMenu = Menu.buildFromTemplate(menu.setup)
  Menu.setApplicationMenu(appMenu)

  // Events
  win.on('ready-to-close', (e) => {
    // Check the editor state here
  })

  win.on('blur', (e) => {
    // Refresh
  })

  win.on('focus', (e) => {
    // Refresh
  })

  win.on('hide', (e) => {
    hide()
  })

  win.on('enter-full-screen', () => {
    // Update layout
  })

  win.on('leave-full-screen', () => {
    // Update layout
  })

  win.on('closed', (e) => {
    win = null
  })

  show()
}

function show() {

  if (!win) init()

  win.loadURL(URL)
  win.webContents.on('did-finish-load', () => {
    if (process.env.NODE_ENV === 'development') {
      win.webContents.openDevTools({ mode: 'detach' })
    }
  })

  win.once('ready-to-show', win.show)
}

function hide() {

}
