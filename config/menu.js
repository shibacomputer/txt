const {app, BrowserWindow, Menu} = require('electron')
const { ipcMain } = require('electron')

const commonMenu = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New Note',
        accelerator: 'CmdOrCtrl+N',
        click (item, win, event) {
          console.log('New Note')
        }
      },
      {
        label: 'Open…',
        accelerator: 'CmdOrCtrl+O',
        click (item, win, event) {
          console.log('New Folder')
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click (item, win, event) {
          win.webContents.send('menu:note:save')
        }
      },
      {
        label: 'Save As…',
        accelerator: 'CmdOrCtrl+Shift+S',
        click (item, win, event) {
          console.log('Save As')
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
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
      {
        role: 'close'
      }
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
        label: 'Check for Update',
        click (item, win, event) {
          console.log('Import')
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Preferences…',
        click (item, win, event) {
          console.log('Preferences')
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Lock…',
        click (item, win, event) {
          console.log('Lock')
        }
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
      role: 'close'
    },
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
