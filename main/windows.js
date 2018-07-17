const { app, BrowserWindow, dialog, ipcMain, Menu, Notification } = require('electron')

const winManager = require('electron-window-manager')
const store = require('./prefs/prefs')
const defs = require('./defaults')
const errors = require('./errors')
const menu = require('./menu')
const contextMenu = require('./context-menu')

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
      'autoHideMenuBar': true,
      'backgroundColor': '#0D1317',
      'frame': true,
      'height': 700,
      'menu': menu.buildMenu('main', null),
      'minHeight': 480,
      'minWidth': 640,
      'resizable': true,
      'scrollBounce': true,
      'sandbox': true,
      'sharedWorker': true,
      'titleBarStyle': 'hiddenInset',
      'width': 1000
    })

    winManager.templates.set('setup', {
      'autoHideMenuBar': true,
      'backgroundColor': '#1B1B20',
      'center': true,
      'frame': true,
      'fullscreenable': false,
      'height': 526,
      'maximizable': false,
      'menu': menu.buildMenu('setup', null),
      'minimizable': true,
      'resizable': false,
      'sandbox': true,
      'sharedWorker': true,
      'titleBarStyle': 'hiddenInset',
      'width': 448,
    })

    // Set up live defaults
    defs.app.path = store.get('app.path') ? store.get('app.path') : app.getPath('home')
    console.log(defs.app.path)

    initEvents()
  },
  prepare: function(winName) {
    let thisWindow = winManager.createNew(
      null, 'Txt',
      `file://${__dirname}/../renderer/${winName}/index.html`,
      winName)

    thisWindow.create()

    let win = thisWindow.object
    win.on('blur', () => {
      win.webContents.send('window:event:blur')
    })
    win.on('focus', () => {
      win.webContents.send('window:event:focus')
    })
    win.on('enter-full-screen', () => {
      win.webContents.send('window:event:fullscreen', true)
    })
    win.on('leave-full-screen', () => {
      win.webContents.send('window:event:fullscreen', false)
    })

    return thisWindow
  }
}

// Event listener library
// @TODO: Split into its own file
function initEvents () {
  let result
  // Take the user's first preferences, and create a new install.
  ipcMain.on('app:setup:init', (event, data) => {
    store.set({
      app: {
        path: data.uri,
        ready: true,
        launchAtLogin: true
      },
      author: data.author,
      encryption: {
        useKeychain: true
      }
    })
    event.sender.send('app:setup:done')
  })

  // Gets a preference and returns it.
  ipcMain.on('pref:get', (event, arg) => {
    let res = store.get(arg)
    event.sender.send('pref:get:done', arg, res)
  })

  ipcMain.on('pref:get:all', (event, arg) => {
    let res = store.store
    event.sender.send('pref:get:done', arg, res)
  })

  ipcMain.on('pref:set', (event, arg) => {
    console.log(arg)
    let res = store.set(arg.key, arg.value)
    console.log(res)
    event.sender.send('pref:set:done', arg, res)
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

  ipcMain.on('menu:new', (event, type, opts) => {
    let win = BrowserWindow.getFocusedWindow()
    if (win) {
      var newMenu = Menu.buildFromTemplate(menu.buildMenu(type.toString(), opts))
      Menu.setApplicationMenu(newMenu)
    }
  })

  ipcMain.on('menu:context:new', (event, type) => {
    let win = BrowserWindow.getFocusedWindow()
    if (win) {
      var context = Menu.buildFromTemplate(contextMenu.buildMenu(type.toString()))
      context.popup(win)
    }
  })

  ipcMain.on('dialog:new', (event, arg) => {
    let win = BrowserWindow.getFocusedWindow()
    if (win) {
      dialog.showMessageBox(win, arg, (response) => {
        if (response) event.sender.send('dialog:response', response)
        else event.sender.send('dialog:response', null)
      })
    }
  })

  ipcMain.on('dialog:new:error', (event, arg) => {
    let win = BrowserWindow.getFocusedWindow()
    if (win) {
      var err = errors.parseErr(arg)
      var opts = {
        type: 'error',
        buttons: [err.action, err.assist],
        defaultId: 0,
        cancelId: 1,
        message: err.message,
        detail: err.detail
      }
      dialog.showMessageBox(win, opts, (response) => {
        if (response) event.sender.send('dialog:response', response)
        else event.sender.send('dialog:response', null)
      })
    }
  })

  ipcMain.on('dialog:new:save', (event, arg) => {
    let win = BrowserWindow.getFocusedWindow()
    if(win) {
      var opts = {
        title: arg.title,
        defaultPath: app.getPath('home') + '/' + arg.filename,
        buttonLabel: arg.buttonLabel,
        filters: [arg.filter],
      }
      dialog.showSaveDialog(win, opts, (response) => {
        if (response) event.sender.send('dialog:response', response)
        else event.sender.send('dialog:response', null)
      })
    }
  })

  ipcMain.on('window:open', (event, newWin, nextEvent) => {
    let thisWin = winManager.getCurrent()
    if (newWin) {
      let win = module.exports.prepare(newWin)

      win.object.on('ready-to-show', () => {
        win.object.show()

      })
    }
    event.sender.send('window:open:done', nextEvent, thisWin)
  })

  ipcMain.on('window:close', (event, win) => {
    if(win) winManager.close(win.name)
  })

  ipcMain.on('notification:new', (event, arg) => {
    let notify = new Notification( {
      title: arg.title,
      body: arg.body,
      silent: arg.silent
    })
    notify.show()

    notify.on('click', () => {
      event.sender.send('notification:clicked', arg.next)
    })
  })

  ipcMain.on('notification:new', (event, arg) => {
    let notify = new Notification( {
      title: arg.title,
      body: arg.body,
      silent: arg.silent
    })
    notify.show()

    notify.on('click', () => {
      event.sender.send('notification:clicked', arg.next)
    })
  })

  ipcMain.on('modal:new', (event, modal) => {
    let thisWin = winManager.getCurrent()
    
    if (!thisWin) return
    
    let parent = thisWin.object

    let child

    if(parent.getChildWindows().length === 0) {
      child = new BrowserWindow( { 
        parent: parent, 
        modal: true, 
        show: false
      })

      ipcMain.on('modal:parent:send', (modal, arg) => {
        parent.send('modal:message', arg)
      })

      ipcMain.on('modal:parent:response', (event, arg) => {
        child.webContents.send('modal:parent:response', arg)
      })

      ipcMain.on('modal:done', (event, arg) => {
        parent.send('modal:closed', modal)
        child.hide()
      })
    }
    else {
      child = parent.getChildWindows()[0]
    }

    child.loadURL(`file://${__dirname}/../renderer/${modal.name}/index.html`)
    
    child.setSize(modal.width, modal.height)

    child.once('ready-to-show', () => {
      child.webContents.send('modal:init', modal.opts)
      parent.send('modal:new:open', modal)
      child.show()
    })
  })
}
