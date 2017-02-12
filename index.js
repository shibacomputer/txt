const { app, shell, Menu, ipcMain } = require('electron')
const window = require('electron-window')
const budo = require('budo')

// Get setup items.
const windowConfig = require('./config/defaults')
const menuConfig = require('./config/menu')

const mainWindowSetup = {
  titleBarStyle:  windowConfig.win.app.titleBar,
  width:          windowConfig.win.app.x,
  height:         windowConfig.win.app.y,
  minWidth:       windowConfig.win.app.minX,
  minHeight:      windowConfig.win.app.minY,
  frame:          windowConfig.win.app.frame
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
