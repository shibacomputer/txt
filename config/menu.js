const { app, BrowserWindow, Menu } = require('electron')
const { ipcMain } = require('electron')

const commonMenu = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New',
        accelerator: 'CmdOrCtrl+N',
        click (item, win, event) {
          win.webContents.send('menu:file:new')
        }
      },
      {
        label: 'Open…',
        accelerator: 'CmdOrCtrl+O',
        click (item, win, event) {
          win.webContents.send('menu:file:open')
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click (item, win, event) {
          win.webContents.send('menu:file:save')
        }
      },
      {
        label: 'Save As…',
        accelerator: 'CmdOrCtrl+Shift+S',
        click (item, win, event) {
          win.webContents.send('menu:file:duplicate')
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Close',
        click (item, win, event) {
          console.log('Export')
        }
      },
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'delete'
      },
      {
        role: 'selectall'
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        role: 'zoomin'
      },
      {
        role: 'zoomout'
      },
      {
        role: 'resetzoom'
      },
      {
        type: 'separator'
      },
      {
        role: 'togglefullscreen'
      }
    ]
  },
  {
    role: 'window',
    submenu: [
      {
        role: 'minimize'
      },
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Send Feedback…',
        click () { require('electron').shell.openExternal('https://txtapp.io/feedback') }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  commonMenu.unshift({
    label: app.getName(),
    submenu: [
      {
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        role: 'services', submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  })
  // Edit menu
  commonMenu[2].submenu.push(
    {
      type: 'separator'
    },
    {
      label: 'Speech',
      submenu: [
        {
          role: 'startspeaking'
        },
        {
          role: 'stopspeaking'
        }
      ]
    }
  )

  // Window menu
  commonMenu[3].submenu = [
    {
      role: 'minimize'
    },
    {
      role: 'zoom'
    },
    {
      type: 'separator'
    },
    {
      role: 'front'
    }
  ]
}

module.exports = {
  commonMenu: commonMenu
}
