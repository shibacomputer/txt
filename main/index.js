// App setup
const { app } = require('electron')

const path = require('path')
// Preferences
const store = require('./prefs/prefs')

// Window manager
const winManager = require('electron-window-manager')
const windows = require('./windows')

const APP_NAME = "Txt"

// Setup windows
function launch(target, cb) {
  windows.init(APP_NAME)

  if(!store.get('app.ready') || !store.get('app.path')) {
    windows.prepare('setup').open()
  } else {
    windows.prepare('main').open()
  }
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

app.on('activate', function() {
  // Pop open a new window.
})
