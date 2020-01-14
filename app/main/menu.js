const { app, shell } = require('electron')
const windows = require('./windows')
export function buildMenu(t, type, opts) {

  opts? opts = opts : opts = []
  let menu = [ {
    label: t.t('systemMenu.file'),
    submenu: [
      {
        label: t.t('systemMenu.fileMenu.new'),
        accelerator: 'CmdOrCtrl+N',
        click: (item, win, event) => {
          if (!win) win = windows.init()
          win.webContents.send('doc:new')
        }
      },
      {
        label: t.t('systemMenu.fileMenu.newWindow'),
        accelerator: 'CmdOrCtrl+Shift+N',
        click: (item, win, event) => {
          let newWin = windows.init()
        }
      },
      {
        type: 'separator'
      },
      {
        label: t.t('systemMenu.fileMenu.open'),
        accelerator: 'CmdOrCtrl+O',
        click: (item, win, event) => {
          if (!win) return
          else win.webContents.send('doc:load')
        }
      },
      {
        type: 'separator'
      },
      {
        label: t.t('systemMenu.fileMenu.save'),
        accelerator: 'CmdOrCtrl+S',
        enabled: opts.editorHasChanges? opts.editorHasChanges : false,
        click: (item, win, event) => {
          if (!win) return
          else win.webContents.send('doc:save')
        }
      },
      {
        label: t.t('systemMenu.fileMenu.saveAs'),
        accelerator: 'CmdOrCtrl+Shift+S',
        click: (item, win, event) => {
          if (!win) return
          else win.webContents.send('doc:save', true)
        }
      },
      {
        label: t.t('systemMenu.fileMenu.revert'),
        enabled: opts.editorHasChanges? opts.editorHasChanges : false,
        click: (item, win, event) => {
          if (!win) return
          else win.webContents.send('doc:revert')
        }
      },
      {
        type: 'separator'
      },
      {
        label: t.t('systemMenu.fileMenu.preview'),
        enabled: opts.editorHasChanges? opts.editorHasChanges : false,
        click: (item, win, event) => {
          if (!win) return
          else win.webContents.send('doc:preview')
        }
      },
      {
        label: t.t('systemMenu.fileMenu.print'),
        accelerator: 'CmdOrCtrl+P',
        enabled: opts.editorHasChanges? opts.editorHasChanges : false,
        click: (item, win, event) => {
          if (!win) return
          else win.webContents.send('doc:print')
        }
      },
      {
        type: 'separator'
      },
      {
        label: t.t('systemMenu.fileMenu.send'),
        enabled: opts.editorHasChanges? opts.editorHasChanges : false,
        click: (item, win, event) => {
          if (!win) return
          else win.webContents.send('pub:send')
        }
      },
      {
        label: t.t('systemMenu.fileMenu.export'),
        submenu: [
          {
            label: t.t('systemMenu.fileMenu.exportMenu.exportToEncryptedFile'),
            // enabled: opts.editorHasContent? opts.editorHasContent : false,
            enabled: false,
            click: (item, win, event) => {
              if (!win) return
              else win.webContents.send('doc:export', '.gpg')
            }
          },
          {
            label: t.t('systemMenu.fileMenu.exportMenu.exportToPlainText'),
            enabled: opts.editorHasContent? opts.editorHasContent : false,
            click: (item, win, event) => {
              if (!win) return
              else win.webContents.send('doc:export', '.txt')
            }
          },
          {
            label: t.t('systemMenu.fileMenu.exportMenu.exportToPdf'),
            // enabled: opts.editorHasContent? opts.editorHasContent : false,
            enabled: false,
            click: (item, win, event) => {
              if (!win) return
              else win.webContents.send('doc:export', '.pdf')
            }
          },
          {
            type: 'separator'
          },
          {
            label: t.t('systemMenu.fileMenu.exportMenu.exportToArena'),
            // enabled: opts.editorHasContent? opts.editorHasContent : false,
            enabled: false,
            click: (item, win, event) => {
              if (!win) return
              else win.webContents.send('doc:post', 'arena')
            }
          },
        ]
      },
      {
        type: 'separator'
      },
      {
        label: t.t('systemMenu.fileMenu.close'),
        accelerator: 'CmdOrCtrl+W',
        enabled: opts.canClose? opts.canClose : false,
        click: (item, win, event) => {
          if (!win) return
          else win.webContents.send('doc:close')
        }
      },
      {
        type: 'separator'
      },
    ]
  },
  {
    label: t.t('systemMenu.edit'),
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
        role: 'selectall'
      },
      {
        label: t.t('systemMenu.editMenu.clearAll'),
        click: (item, win, event) => {
          if (!win) return
          else win.webContents.send('doc:clear')
        }
      },
      {
        type: 'separator'
      },
      {
        type: 'checkbox',
        enabled: opts.editorHasContent ? opts.editorHasContent : false,
        label: t.t('systemMenu.editMenu.trackChanges'),
        accelerator: 'CmdOrCtrl+Shift+T',
        click: (item, win, event) => {
          if (!win) return
          else win.webContents.send('doc:changes:track', item.checked)
        }
      },
      {
        label: t.t('systemMenu.editMenu.acceptChanges'),
        enabled: false,
        click: (item, win, event) => {
          if (!win) return
          else win.webContents.send('')
        }
      },
      {
        label: t.t('systemMenu.editMenu.rejectChanges'),
        enabled: false,
        click: (item, win, event) => {
          if (!win) return
          else win.webContents.send('')
        }
      },
    ]
  },
  {
    label: t.t('systemMenu.view'),
    submenu: [
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    role: 'window',
    submenu: [
      { role: 'minimize' },
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: t.t('systemMenu.helpMenu.support'),
        click: (item, win, event) => {
          if (!win) return
          else shell.openExternal('https://txt.shiba.computer/support')
        }
      },
    ]
  }]

  if (process.platform === 'darwin') {
    menu.unshift({
      label: app.getName(),
      submenu: [
        {role: 'about'},
        {type: 'separator'},
        {
          label: t.t('systemMenu.appMenu.donate'),
          click: () => {
            shell.openExternal('https://txt.shiba.computer/donate')
          }
        },
        {
          label: t.t('systemMenu.appMenu.checkForUpdates'),
          click: () => { console.log('Checking...')
          }
        },
        {type: 'separator'},
        {
          label: t.t('systemMenu.appMenu.preferences'),
          accelerator: 'Cmd+,',
          click: (item, win, event) => {
            if (!win) return
            else win.webContents.send('prefs:show')
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
      label: t.t('systemMenu.debug'),
      submenu: [{
        label: t.t('systemMenu.debugMenu.showTools'),
        accelerator: 'CmdOrCtrl+OptionOrAlt+I',
        click: (item, win, event) => {
          if (win) win.webContents.toggleDevTools()
        }
      }]
    })
  }

  return menu
}
