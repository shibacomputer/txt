const { app, BrowserWindow, dialog, ipcMain, Menu } = require('electron')

const winManager = require('electron-window-manager')
const store = require('./prefs/prefs')
const defs = require('./defaults')
const menu = require('./menu')

const keytar = require('keytar')
const appId = 'Txt'

module.exports = {
  init: function(title) {

    // Doing all of this setup stuff
    winManager.init({
      'layouts': {
        'main': '/renderer/main/index.html',
        'prefs': '/renderer/prefs/index.html',
        'mini': '/renderer/mini/index.html',
        'setup': '/renderer/setup/index.html',
        'tray': '/renderer/tray/index.html'
      },
      'onLoadFailure': function() {
        console.log('FAILED!')
      }
    })

    winManager.templates.set('main', {
      'backgroundColor': '#1B1B20',
      'frame': true,
      'height': 700,
      'menu': menu.main,
      'minHeight': 320,
      'minWidth': 600,
      'resizable': true,
      'scrollBounce': true,
      'titleBarStyle': 'hiddenInset',
      'width': 1000
    })

    winManager.templates.set('prefs', {
      closable: true,
      frame: false,
      titleBarStyle: 'hidden',
      resizable: false,
      modal: true
    })

    winManager.templates.set('mini', {
      backgroundColor: '#1B1B20',
      titleBarStyle: 'hidden',
      width: 512,
      height: 128,
      frame: false,
      center: true,
      movable: false,
      fullscreenable: false,
      minimizable: false,
      maximizable: false
    })

    winManager.templates.set('setup', {
      'backgroundColor': '#1B1B20',
      'center': true,
      'frame': true,
      'fullscreenable': false,
      'height': 526,
      'maximizable': false,
      'menu': menu.setup,
      'minimizable': true,
      'resizable': false,
      'titleBarStyle': 'hiddenInset',
      'width': 448,
    })

    winManager.templates.set('tray', {
      closable: true,
      frame: false,
      titleBarStyle: 'hiddenInset',
      resizable: false,
      minimizable: false,
      maximizable: false
    })

    // Set up live defaults
    defs.app.path = store.get('app.path') ? store.get('app.path') : app.getPath('home')
    console.log(defs.app.path)
    module.exports.initEvents()
  },
  prepare: function(winName) {
    let thisWindow = winManager.createNew(winName,
      'Txt',
      `file://${__dirname}/../renderer/${winName}/index.html`,
      winName)
    return thisWindow
  },
  // Event listener library
  // @TODO: Split into its own file
  // @TODO: Move all crypto into the event listening library.
  initEvents: function () {
  // Take the user's first preferences, and create a new install.
    ipcMain.on('do:firstSetup', (event, prefs) => {
      store.set({
        app: {
          path: prefs.workingPath,
          ready: true,
          launchAtLogin: true
        },
        encryption: {
          useKey: prefs.useKey,
          useKeychain: true
        }
      })

      // Set up & save the key in the user's keychain.
      if (prefs.string && prefs.useKey === false) {
        keytar.setPassword(appId, prefs.selectedKey ? prefs.selectedKey.name : 'user', prefs.string )
      }
      event.sender.send('done:setup')
    })

    // Gets a preference and returns it.
    ipcMain.on('get:pref', (event, arg) => {
      let res = store.get(arg)
      event.sender.send('done:getPref', arg, res)
    })

    ipcMain.on('get:allPref', (event, arg) => {
      let res = store.store
      event.sender.send('done:getPref', arg, res)
    })

    ipcMain.on('set:pref', (event, key, value) => {
      let res = store.set(key, value)
      event.sender.send('done:setPref', arg, res)
    })

    ipcMain.on('get:file', (event, arg) => {
      let win = BrowserWindow.getFocusedWindow()
      dialog.showOpenDialog(win, {
        title: arg.title ? arg.title : defs.dialog.title,
        defaultPath: arg.path ? arg.path : defs.app.path,
        buttonLabel: arg.button ? arg.button : defs.dialog.button,
        filters: arg.filters ? arg.filters : defs.dialog.filters,
        properties: arg.props,
        message: arg.msg ? arg.msg : defs.dialog.msg
      }, (f) => {
        if (f) event.sender.send('done:getFile', f)
        else event.sender.send('done:getFile', null)
      })
    })

    ipcMain.on('dialog:new', (event, arg) => {
      let win = BrowserWindow.getFocusedWindow()
      dialog.showMessageBox(win, arg, (response) => {
        if (response) event.sender.send('dialog:response', response)
        else event.sender.send('dialog:response', null)
      })
    })

    ipcMain.on('do:openWindow', (event, newWin, nextEvent) => {
      let thisWin = winManager.getCurrent()
      if (newWin) module.exports.prepare(newWin).open()
      event.sender.send('done:openWindow', nextEvent, thisWin)
    })

    ipcMain.on('do:closeWin', (event, win) => {
      winManager.close(win.name)
    })
  }
}