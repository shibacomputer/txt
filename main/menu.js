const { app, Menu } = require('electron')

const updater = require('./updater')

module.exports = {
  buildMenu: function(menu, opts) {
    opts? opts = opts : opts = []

    switch (menu) {
      case 'setup':
        menu = [
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
            role: 'help',
            submenu: [{
              label: 'Report an Issue…',
              click: (item, win, event) => { if (win) win.webContents.send('menu:help:support') }
            }
          ]
        }
        ]
        break

      default:
        menu = [ {
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
              label: 'New Txt Window',
              accelerator: 'CmdOrCtrl+Alt+Shift+N',
              click: (item, win, event) => {
                if (!win) return
                else win.webContents.send('menu:file:new:window')
              }
            },            
            {
              type: 'separator'
            },
            {
              label: 'Lock',
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
              enabled: opts.save? opts.save : false,
              click: (item, win, event) => {
                if (!win) return
                else win.webContents.send('menu:file:save')
              }
            },
            {
              label: 'Revert Changes',
              enabled: opts.revert? opts.revert : false,
              click: (item, win, event) => {
                if (!win) return
                else win.webContents.send('menu:file:revert')
              }
            },
            {
              label: 'Rename',
              enabled: opts.rename? opts.rename : false,
              click: (item, win, event) => {
                if (!win) return
                else win.webContents.send('menu:file:rename')
              }
            },
            {
              type: 'separator'
            },
            {
              label: 'Close',
              accelerator: 'CmdOrCtrl+W',
              enabled: opts.close? opts.close : false,
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
              enabled: opts.trash? opts.trash : false,
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
                  enabled: opts.export? opts.export : false,
                  click: (item, win, event) => {
                    if (win) win.webContents.send('menu:file:duplicate')
                  }
                },
                {
                  label: 'to Encrypted File…',
                  enabled: opts.export? opts.export : false,
                  click: (item, win, event) => {
                    if (win) win.webContents.send('menu:file:duplicate')
                  }
                },
                {
                  type: 'separator'
                },
                {
                  label: 'to PDF…',
                  enabled: opts.export? opts.export : false,
                  accelerator: 'CmdOrCtrl+Shift+P',
                  click: (item, win, event) => {

                  }
                },
                {
                  type: 'separator'
                },
                {
                  label: 'to Are.na…',
                  enabled: opts.export? opts.export : false,
                  click: (item, win, event) => {

                  }
                }
              ]
            },
            {
              label: 'Print…',
              accelerator: 'CmdOrCtrl+P',
              enabled: opts.print? opts.print : false,
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
              checked: opts.library,
              click: (item, win, event) => {  win.webContents.send('menu:view:library') }
            },
            {
              label: 'Preview...',
              enabled: opts.preview? opts.preview : false,
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
        break

    }
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
              require('electron').shell.openExternal('https://txtapp.io/donate')
            }
          },
          {type: 'separator'},
          {
            label: 'Preferences…',
            accelerator: 'Cmd+,',
            enabled: menu === 'setup'? false : true,
            click: (item, win, event) => {
              console.log('prefs');
            }
          },
          {type: 'separator'},
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
}
