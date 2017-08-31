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
const budo = require('budo')
const Env = require('envobj')

// Get setup items.
const winCfg = require('./config/defaults')
const menuConfig = require('./config/menu')

// Settings
const settings = require('electron-settings')

global.settings = settings

// Setup windows
const opts = {
  debug: process.env.NODE_ENVIRONMENT !== 'production',
  verbose: true,
  port: 8001,
  host: 'localhost',
  live: true,
  stream: process.stdout,
  pushstate: true,
  browserify: {
    transform: [ 'sheetify/transform' ],
    exclude: ['openpgp'],
    ignore: ['buffer'],
    insertGlobalVars: {
      process: function() { return; },
    }
  },
  browserifyArgs: ['--ignore-missing', '--no-builtins', '--no-commondir', '--node']
}

let mainWin
let lockWin
let setupWin

app.on('ready', () => {

  // Check for settings defaults
  if (!settings.has('active')) {
    settings.setAll({
      'active': false,
      'keychain': false
    })
  }

  var active = settings.get('active')

  // Get our windows in order, since any of the three can be called at any time.

  // Start the dev server
  var server = budo('app.js', opts)

  // @TODO: Set prod vs dev settings - including dev tools.
  .on('connect', function (ev) {
    var menu
    // Check to see whether this we have a Txt folder set up.
    if (!active) {
      setupWin = window.createWindow(winCfg.setup)
      menu = Menu.buildFromTemplate(menuConfig.setupMenu)
      Menu.setApplicationMenu(menu)
      setupWin.showUrl(ev.uri + 'setup')
      setupWin.webContents.openDevTools({ mode: 'detach' })
    } else {
      mainWin = window.createWindow(winCfg.main)
      menu = Menu.buildFromTemplate(menuConfig.commonMenu)
      Menu.setApplicationMenu(menu)
      mainWin.showUrl(ev.uri)
      mainWin.webContents.openDevTools({ mode: 'detach' })
      mainWin.once('close', function () {
        server.close()
      })
    }

    ipcMain.on('window', function(event, arg) {
      switch (arg) {
        case 'setup':
          menu = Menu.buildFromTemplate(menuConfig.setupMenu)
          Menu.setApplicationMenu(menu)
          setupWin = window.createWindow(winCfg.setup)
          setupWin.loadURL(ev.uri + 'setup')
          setupWin.once('ready-to-show', setupWin.show)
          mainWin.close()
          break
        case 'main':
          menu = Menu.buildFromTemplate(menuConfig.commonMenu)
          Menu.setApplicationMenu(menu)
          mainWin = window.createWindow(winCfg.main)
          mainWin.loadURL(ev.uri)
          mainWin.once('ready-to-show', mainWin.show)
          setupWin.close()
          break
        default:
          return
      }
    })
  })

  .on('update', function(file, contents) {
    mainWin.reload()
  })
})
