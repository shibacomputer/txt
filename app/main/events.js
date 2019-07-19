const { BrowserWindow, ipcMain, shell } = require('electron')
const store = require('./prefs') // Better referencing here

export function init() {

  ipcMain.on('window:title', (e, title) => {
    let win = BrowserWindow.getFocusedWindow()
    if (win) win.setTitle(title)
  })

  ipcMain.on('find', (e, uri) => {
    shell.showItemInFolder(uri)
  })

  ipcMain.on('open', (e, uri) => {
    shell.openExternal(uri)
  })

  ipcMain.on('prefs:read', (e) => {
    e.sender.send('prefs:read', store.store)
  })

  ipcMain.on('prefs:write', (e, newPrefs) => {
    store.set(newPrefs)
  })
}
