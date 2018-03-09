  // Event listener library
const {app, ipcMain } = require('electron')
const keytar = require('keytar')

const winManager = require('electron-window-manager')
const store = require('./prefs/prefs')
const defs = require('./defaults')

module.exports = {
  init: function () {
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
        keytar.setPassword('Txt', prefs.selectedKey ? prefs.selectedKey.name : 'user', prefs.string )
      }
      event.sender.send('done:setup')
    })

    // Gets a preference and returns it.
    ipcMain.on('get:pref', (event, arg) => {
      let res = store.get(arg)
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
