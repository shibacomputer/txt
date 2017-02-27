/*
    _______  ________
   /_  __/ |/ /_  __/
    / /  |   / / /
   / /  /   | / /
  /_/  /_/|_|/_/

*/

// App setup
const { app, shell, Menu, ipcMain } = require('electron')
const window = require('electron-window')

// Browserify service for development
const budo = require('budo')

// Get setup items.
const windowConfig = require('./config/defaults')
const menuConfig = require('./config/menu')

// Settings
const settings = require('electron-settings')

global.settings = settings

// Setup windows
const mainWindowConfig = {
  titleBarStyle:  windowConfig.win.app.titleBar,
  width:          windowConfig.win.app.x,
  height:         windowConfig.win.app.y,
  minWidth:       windowConfig.win.app.minX,
  minHeight:      windowConfig.win.app.minY,
  frame:          windowConfig.win.app.frame
}

const setupWindowConfig = {
  titleBarStyle:  windowConfig.win.setup.titleBar,
  width:          windowConfig.win.setup.x,
  height:         windowConfig.win.setup.y,
  minWidth:       windowConfig.win.setup.minX,
  minHeight:      windowConfig.win.setup.minY,
  frame:          windowConfig.win.setup.frame,
  center:         windowConfig.win.setup.centered,
  resizable:      windowConfig.win.setup.canResize,
  fullscreenable: windowConfig.win.setup.fullscreen,
  minimizable:    windowConfig.win.setup.minimizable,
  maximizable:    windowConfig.win.setup.maximizable
}

const lockWindowConfig = {
  titleBarStyle:  windowConfig.win.lock.titleBar,
  width:          windowConfig.win.lock.x,
  height:         windowConfig.win.lock.y,
  minWidth:       windowConfig.win.lock.minX,
  minHeight:      windowConfig.win.lock.minY,
  frame:          windowConfig.win.lock.frame,
  center:         windowConfig.win.lock.centered,
  movable:        windowConfig.win.lock.moveable,
  fullscreenable: windowConfig.win.lock.fullscreen,
  minimizable:    windowConfig.win.lock.minimizable,
  maximizable:    windowConfig.win.lock.maximizable
}

const opts = {
  debug: process.env.NODE_ENVIRONMENT !== 'production',
  verbose: true,
  live: true,
  stream: process.stdout,
  pushstate: true,
  browserify: {
    transform: [ 'sheetify/transform' ],
  },
  browserifyArgs: ['--ignore-missing', '--no-builtins', '--no-commondir', '--insert-global-vars=\"global\"', '--no-browser-field']
}

let mainWin
let lockWin
let setupWin

app.on('ready', () => {

  // Check for settings defaults
  settings.defaults({
    hasDbLocationOf: app.getPath('home') + '/Txt', // Default location
    isActiveInstall: false, // Have we performed setup?
    usesKeychain: false, // Save passphrase in the keychain?
    usesTheme: 'dark' // What theme are we using?
  })

  // Get our windows in order, since any of the three can be called at any time.
  mainWin = window.createWindow(mainWindowConfig)
  setupWin = window.createWindow(setupWindowConfig)
  lockWin = window.createWindow(lockWindowConfig)

  // Start the dev server
  var server = budo('app.js', opts)

  // @TODO: Set prod vs dev settings - including dev tools.
  .on('connect', function (ev) {
    // Check to see whether this we have a Txt folder set up.
    settings.get('isActiveInstall').then(val => {
      if(val === false) {
        setupWin.showUrl(ev.uri + 'setup')
      } else {
        mainWin.showUrl(ev.uri)
        mainWin.webContents.openDevTools({ mode: 'detach' })
        mainWin.once('close', function () {
          server.close()
        })
      }
    })
  })

  .on('update', function(file, contents) {
    mainWin.reload()
  })
})
