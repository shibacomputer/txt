const { app, shell, Menu, ipcMain } = require('electron')
const window = require('electron-window')
const budo = require('budo')

const mainWindowSetup = {
  titleBarStyle: 'hidden-inset'
}

let mainWindow

app.on('ready', () => {
  mainWindow = window.createWindow(mainWindowSetup)
  var server = budo('index.js', {
    live: true,             // live reload
    stream: process.stdout, // log to stdout
    port: 8999,             // use this as the base port
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
