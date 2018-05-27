// App setup
const { app } = require('electron')

const path = require('path')
// Preferences
const store = require('./prefs/prefs')

// Window manager
const winManager = require('electron-window-manager')
const windows = require('./windows')

const APP_NAME = process.env.npm_package_name

// Setup windows
function launch() {
  windows.init(APP_NAME)

  let win

  if(!store.get('app.ready') || !store.get('app.path')) {
    win = windows.prepare('setup')
  } else {
    win = windows.prepare('main')
  }
  win.object.on('ready-to-show', () => {
    win.object.show()
  })
}

app.on('ready', () => {
  if (!store.get('author.homedir') || store.get('author.homedir') === app.getPath('home')) store.set('author.homedir', app.getPath('home'))
  launch()
})

app.on('will-finish-launching', (event) => {
  app.on('open-file', (e, filePath) => {
    console.log('Trying to open ', filePath)
  })
})

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.exit(0)
  }
})

app.on('browser-window-focus', (event, win) => {
  if (win) {
    win.webContents.send('sys:focus')
  }
})

app.on('activate', function() {
  // Pop open a new window.
})
