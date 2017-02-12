const { app, shell, Menu, ipcMain } = require('electron')
const window = require('electron-window')
const budo = require('budo')
const path = require('path')

const mainWindowSetup = {
  titleBarStyle: 'hidden-inset'
}

let mainWindow

app.on('ready', () => {
  mainWindow = window.createWindow(mainWindowSetup)
  var server = budo('./app/app.js', {
    port: 8001,
    live: true,
    stream: process.stdout
  })

  .on('connect', function (ev) {
    mainWindow.showUrl(ev.uri)
    mainWindow.webContents.openDevTools({ mode: 'detach' })
    mainWindow.once('close', function () {
      server.close()
    })
  })
  .on('update', function(file, contents) {
    mainWindow.reload()
  })
})
