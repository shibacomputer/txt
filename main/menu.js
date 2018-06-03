const { app, Menu } = require('electron')
const i18n = require('../renderer/_utils/i18n/i18n')
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
              label: i18n.t('applicationBar.help.reportAnIssue'),
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
              label: i18n.t('applicationBar.file.newFile'),
              accelerator: 'CmdOrCtrl+N',
              click: (item, win, event) => {
                if (!win) return
                else win.webContents.send('menu:file:new:file')
              }
            },
            {
              label: i18n.t('applicationBar.file.newFolder'),
              accelerator: 'CmdOrCtrl+Shift+N',
              click: (item, win, event) => {
                if (!win) return
                else win.webContents.send('menu:file:new:dir')
              }
            },
            {
              label: i18n.t('applicationBar.file.newWindow'),
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
              label: i18n.t('applicationBar.file.lock'),
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
              label: i18n.t('applicationBar.file.deleteFromLibrary'),
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
              label: i18n.t('applicationBar.file.save'),
              accelerator: 'CmdOrCtrl+S',
              enabled: opts.save? opts.save : false,
              click: (item, win, event) => {
                if (!win) return
                else win.webContents.send('menu:file:save')
              }
            },
            {
              label: i18n.t('applicationBar.file.revertChanges'),
              enabled: opts.revert? opts.revert : false,
              click: (item, win, event) => {
                if (!win) return
                else win.webContents.send('menu:file:revert')
              }
            },
            {
              label: i18n.t('applicationBar.file.rename'),
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
              label: i18n.t('applicationBar.file.close'),
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
              label: i18n.t('applicationBar.file.export'),
              submenu: [
                {
                  label: i18n.t('applicationBar.file.exportItems.exportToPlainText'),
                  enabled: opts.export? opts.export : false,
                  click: (item, win, event) => {
                    if (win) win.webContents.send('menu:file:duplicate')
                  }
                },
                {
                  label: i18n.t('applicationBar.file.exportItems.exportToEncryptedFile'),
                  enabled: opts.export? opts.export : false,
                  click: (item, win, event) => {
                    if (win) win.webContents.send('menu:file:duplicate')
                  }
                },
                {
                  type: 'separator'
                },
                {
                  label: i18n.t('applicationBar.file.exportItems.exportToPDF'),
                  enabled: opts.export? opts.export : false,
                  accelerator: 'CmdOrCtrl+Shift+P',
                  click: (item, win, event) => {

                  }
                },
                {
                  type: 'separator'
                },
                {
                  label: i18n.t('applicationBar.file.exportItems.exportToArena'),
                  enabled: opts.export? opts.export : false,
                  click: (item, win, event) => {

                  }
                }
              ]
            },
            {
              label: i18n.t('applicationBar.file.print'),
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
              label: i18n.t('applicationBar.view.showLibrary'),
              accelerator: 'CmdOrCtrl+Shift+L',
              checked: opts.library,
              click: (item, win, event) => {  win.webContents.send('menu:view:library') }
            },
            {
              type: 'separator'
            },
            {
              label: i18n.t('applicationBar.view.preview'),
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
          submenu: [
            {
              label: i18n.t('applicationBar.help.reportAnIssue'),
              click: (item, win, event) => { if (win) win.webContents.send('menu:help:support') }
            },
            {
              label: i18n.t('applicationBar.help.getNews', {app_name: 'Txt'}),
              click: (item, win, event) => { if (win) win.webContents.send('menu:help:news') }
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
            label: i18n.t('applicationBar.others.checkForUpdate'),
            click: updater.checkForUpdates
          },
          {
            label: i18n.t('applicationBar.others.donate'),
            click: () => {
              require('electron').shell.openExternal('https://txtapp.io/donate')
            }
          },
          { type: 'separator' },
          {
            label: i18n.t('applicationBar.others.preferences'),
            accelerator: 'Cmd+,',
            enabled: menu === 'setup'? false : true,
            click: (item, win, event) => {
              if (!win) return
              else win.webContents.send('menu:about:prefs')
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
        label: i18n.t('applicationBar.debug.title'),
        submenu: [{
          label: i18n.t('applicationBar.debug.showConsole'),
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
