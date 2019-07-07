const { app, Menu, ipcMain, protocol } = require('electron')
const path = require('path')

// TODO: Add the fork of electron-window-manager to this project?
// TODO: Move menu to its own service.

// Set up utilities
const i18n = require('../i18n')

const windows = require('./windows')
const filesystem = require('./filesystem')
const modal = require('./modal')
const menu = require('./menu')
const events = require('./events')
const store = require('./prefs')
const author = require('./author')

let locale, firstLaunch, translate

app.on('will-finish-launching', () => {
  locale = app.getLocale()
  store.set({
    'userHomeDirectory': app.getPath('home'),
    'locale': locale,
    'workingDirectory': path.join(app.getPath('home'), '.txtapp')
  })

  translate = i18n.init(locale)
  if (store.get('isFirstLaunch')) firstLaunch = true

  app.on('open-file', (e, filePath) => {
    console.log('Trying to open ', filePath)
  })
})

app.on('ready', async () => {
  events.init()
  filesystem.init()
  author.init()
  modal.init(translate)
  initMenu()
  launch()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.exit(0)
  }
})

app.on('browser-window-created', (e, win) => {
  initMenu() // Need this here to push an ipc Event.
})

function launch() {
  let appWindow = windows.init()
}

function initMenu() {
  Menu.setApplicationMenu(Menu.buildFromTemplate(menu.buildMenu(translate, 'main', null)))

  ipcMain.on('menu:update', (e, type, opts) => {
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu.buildMenu(translate, type.toString(), opts)))
  })
}
