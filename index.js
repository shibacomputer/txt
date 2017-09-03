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
const window = require('electron-window')

// Browserify service for development
const Env = require('envobj')

// Window manager
const manager = require('./windows/manager')

// Get setup items.
const winCfg = require('./config/defaults')
const menuConfig = require('./config/menu')

// Settings
const settings = require('electron-settings')

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

  // @TODO: Set prod vs dev settings - including dev tools.
  .on('connect', function (ev) {
    var menu
    // Check to see whether this we have a Txt folder set up.
    if (!active) {
      menu = Menu.buildFromTemplate(menuConfig.setupMenu)
      Menu.setApplicationMenu(menu)
      setupWin = window.createWindow(winCfg.setup)
      setupWin.loadURL(ev.uri + 'setup')
      setupWin.once('ready-to-show', setupWin.show)
      setupWin.on('closed', () => {
        setupWin = null
      })
      setupWin.webContents.openDevTools({ mode: 'detach' })
    } else {
      menu = Menu.buildFromTemplate(menuConfig.commonMenu)
      Menu.setApplicationMenu(menu)
      mainWin = window.createWindow(winCfg.main)
      mainWin.loadURL(ev.uri)
      mainWin.once('ready-to-show', mainWin.show)
      mainWin.on('closed', () => {
        mainWin = null
      })

      // @TODO: Make this work.
      mainWin.on('before-quit', (e) => {
        mainWin.webContents.send('menu:file:close')
      })
      mainWin.webContents.openDevTools({ mode: 'detach' })
    }

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
    })
  })

  .on('update', function(file, contents) {

  })
})
