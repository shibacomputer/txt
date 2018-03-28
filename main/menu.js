const { app, Menu } = require('electron')

const updater = require('./updater')

const main = [ {
  label: 'File',
  submenu: [
    {
      label: 'New',
      accelerator: 'CmdOrCtrl+N',
      click: (item, win, event) => {
        if (!win) return
        else win.webContents.send('menu:file:new:file')
      }
    },
    {
      label: 'New Folder',
      accelerator: 'CmdOrCtrl+Shift+N',
      click: (item, win, event) => {
        if (!win) return
        else win.webContents.send('menu:file:new:dir')
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Lock Txt',
      accelerator: 'Shift+CmdOrCtrl+L',
      click: (item, win, event) => {
        if (!win) return
        else win.webContents.send('menu:file:lock')
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Save',
      accelerator: 'CmdOrCtrl+S',
      enabled: opts.file.save? opts.file.save : false,
      click: (item, win, event) => {
        if (!win) return
        else win.webContents.send('menu:file:save')
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Revert Changes',
      enabled: opts.file.revertChanges? opts.file.revertChanges : false,
      click: (item, win, event) => {
        if (!win) return
        else win.webContents.send('menu:file:revert')
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
      enabled: opts.file.close? opts.file.close : false,
      click: (item, win, event) => {
        if (!win) return
        else win.webContents.send('menu:file:close')
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Move to Trash',
      enabled: opts.file.trash opts.file.trash : false,
      accelerator: 'CmdOrCtrl+Backspace',
      click: (item, win, event) => {
        if (!win) return
        else win.webContents.send('menu:file:trash')
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Export',
      submenu: [
        {
          label: 'to Plain Text…',
          enabled: opts.file.export? opts.file.export : false,
          click: (item, win, event) => {
            if (win) win.webContents.send('menu:file:duplicate')
          }
        },
        {
          label: 'to Encrypted File…',
          click: (item, win, event) => {
            if (win) win.webContents.send('menu:file:duplicate')
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'to PDF…',
          accelerator: 'CmdOrCtrl+Shift+P',
          click: (item, win, event) => {

          }
        },
        {
          type: 'separator'
        },
        {
          label: 'to Are.na…',
          click: (item, win, event) => {

          }
        }
      ]
    },
    {
      label: 'Print…',
      accelerator: 'CmdOrCtrl+P',
      enabled: opts.file.print? opts.file.print : false,
      click: (item, win, event) => {

      }
    }
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
      type: 'checkbox',
      label: 'Show Library',
      accelerator: 'CmdOrCtrl+Shift+L',
      checked: true,
      click: (item, win, event) => {
        console.log('Theme')
      }
    },
    {
      label: 'Preview...',
      enabled: opts.view.preview? opts.view.preview : false,
      click: (item, win, event) => {
        console.log('Preview')
      }
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
  submenu: [{
    role: 'minimize'
  }]
},
{
  role: 'help',
  submenu: [{
    label: 'Report an Issue…',
    click: (item, win, event) => { if (win) win.webContents.send('menu:help:support') }
    }
  ]
}]

const setup = [{
  role: 'help',
  submenu: [{
    label: 'Report an Issue…',
    click: (item, win, event) => { if (win) win.webContents.send('menu:help:support') }
    }
  ]
}]

function buildMenu(menu) {
  if (process.platform === 'darwin') {
    menu.unshift({
      label: app.getName(),
      submenu: [
        {role: 'about'},
        {
          label: 'Check for Update…',
          click: updater.checkForUpdates
        },
        {
          label: 'Donate…',
          click: () => {
            require('electron').shell.openExternal('https://txtapp.io/')
          }
        },
        {type: 'separator'},
        {
          label: 'Preferences…',
          accelerator: 'Cmd+,',
          click: (item, win, event) => {
            console.log('prefs');
          }
        },
        {role: 'services', submenu: []},
        {type: 'separator'},
        {role: 'hide'},
        {role: 'hideothers'},
        {role: 'unhide'},
        {type: 'separator'},
        {role: 'quit'}
      ]
    })
  }

  if (process.env.NODE_ENV !== 'production') {
    menu.push({
      label: 'Debug',
      submenu: [{
        label: 'Show Dev Tools',
        accelerator: 'CmdOrCtrl+OptionOrAlt+I',
        click: (item, win, event) => {
          if (win) win.webContents.toggleDevTools()
        }
      }]
    })
  }

  return menu
}

module.exports = {
  main: buildMenu(main, opts),
  setup: buildMenu(setup, opts)
}
