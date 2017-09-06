/*
    _______  ________
   /_  __/ |/ /_  __/
    / /  |   / / /
   / /  /   | / /
  /_/  /_/|_|/_/

*/

// App setup
const { app, shell, Menu, ipcMain } = require('electron')
const path = require('path')

// Settings
const settings = require('electron-settings')

const manager = require('./windows/manager')

global.settings = settings

// Setup windows
app.on('ready', () => {

  // Check for settings defaults
  if (!settings.has('active')) {
    settings.setAll({
      'active': false,
      'keychain': false
    })
  }
  var active = settings.get('active')
  manager.init()
  if (active) {
    manager.show('editor')
  } else {
    manager.show('setup')
  }
})
    /*
    // @TODO: Clean this terrible code up.
    ipcMain.on('window', function(event, arg) {
      switch (arg) {
        case 'setup':
          menu = Menu.buildFromTemplate(menuConfig.setupMenu)
          Menu.setApplicationMenu(menu)
          setupWin = window.createWindow(winCfg.setup)
          setupWin.loadURL(ev.uri + 'setup')
          setupWin.once('ready-to-show', setupWin.show)
          setupWin.on('closed', () => {
            setupWin = null
          })

          mainWin.close()
          break

        case 'main':
          menu = Menu.buildFromTemplate(menuConfig.commonMenu)
          Menu.setApplicationMenu(menu)
          mainWin = window.createWindow(winCfg.main)
          mainWin.loadURL(ev.uri)
          mainWin.once('ready-to-show', mainWin.show)
          mainWin.on('closed', () => {
            mainWin = null
          })

          mainWin.on('before-quit', () => {
            mainWin.webContents.send('menu:file:close')
          })
          setupWin.close()
          break
        default:
          return
      }
      */
