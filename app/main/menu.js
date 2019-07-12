const { app } = require('electron')
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
        enabled: true,
        click: (item, win, event) => {
          if (!win) return
          else win.webContents.send('doc:revert')
        }
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
      }
    ]
  },
  {
    label: t.t('systemMenu.view'),
    submenu: [
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
        label: t.t('systemMenu.helpMenu.support'),
        click: (item, win, event) => {
          if (!win) return
          else win.webContents.send('event:menu')
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
            require('electron').shell.openExternal('https://txtapp.io/donate')
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
            else {
              let opts = {
                shouldPrepend: true,
                shouldStart: true
              }

              win.webContents.send('prefs:show')
            }
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
