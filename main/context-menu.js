const { app } = require('electron')

const polyglot = require('../renderer/_utils/i18n/i18n')
const i18n = polyglot.init(app.getLocale())

module.exports = {
  
  buildMenu: function(menu, opts) {
    opts? opts = opts : opts = []

    switch (menu) {
      case 'file':
        menu = [
          {
            label: i18n.t('contextMenu.open'),
            click: (item, win, event) => {
              if (win) win.webContents.send('menu:file:open', false)
            }
          },
          {
            label: i18n.t('contextMenu.openInNewWindow'),
            click: (item, win, event) => {
              if (win) win.webContents.send('menu:file:open', true)
            }
          },
          {
            type: 'separator'
          },
          {
            label: i18n.t('contextMenu.new'),
            submenu: [
              {
                label: i18n.t('contextMenu.newItems.newFile'),
                click: (item, win, event) => {
                  if (win) win.webContents.send('menu:file:new:file')
                }
              },
              {
                label: i18n.t('contextMenu.newItems.newFolder'),
                click: (item, win, event) => {
                  if (win) win.webContents.send('menu:file:new:dir')
                }
              }
            ]
          },
          {
            type: 'separator'
          },
          {
            label: i18n.t('contextMenu.reveal'),
            click: (item, win, event) => {
              if (win) win.webContents.send('menu:context:reveal')
            }
          },
          {
            label: i18n.t('contextMenu.rename'),
            click: (item, win, event) => {
              if (win) win.webContents.send('menu:file:rename')
            },
          },
          {
            type: 'separator'
          },
          {
            label: i18n.t('contextMenu.moveToTrash'),
            click: (item, win, event) => {
              if (win) win.webContents.send('menu:file:trash')
            }
          }
        ]
      break
      case 'directory':
        menu = [
          {
            label: i18n.t('contextMenu.new'),
            submenu: [
              {
                label: i18n.t('contextMenu.newItems.newFile'),
                click: (item, win, event) => {
                  if (win) win.webContents.send('menu:file:new:file')
                }
              },
              {
                label: i18n.t('contextMenu.newItems.newFolder'),
                click: (item, win, event) => {
                  if (win) win.webContents.send('menu:file:new:dir')
                }
              }
            ]
          },
          {
            type: 'separator'
          },
          {
            label: i18n.t('contextMenu.reveal'),
            click: (item, win, event) => {
              if (win) win.webContents.send('menu:context:reveal')
            }
          },
          {
            label: i18n.t('contextMenu.rename'),
            click: (item, win, event) => {
              if (win) win.webContents.send('menu:file:rename')
            },
          },
          {
            type: 'separator'
          },
          {
            label: i18n.t('contextMenu.moveToTrash'),
            click: (item, win, event) => {
              if (win) win.webContents.send('menu:file:trash')
            }
          }
        ]
      break
      case 'footer':
        menu = [
          {
            label: i18n.t('contextMenu.reveal'),
            click: (item, win, event) => {
              if (win) win.webContents.send('menu:context:reveal:library')
            }
          }
        ]
      break
      case 'share':
        menu = [
          {
            label: i18n.t('contextMenu.exportItems.exportToPlainText'),
            click: (item, win, event) => {
              if (win) win.webContents.send('menu:file:export', 'plaintext')
            }
          },
          {
            label: i18n.t('contextMenu.exportItems.exportToEncryptedFile'),
            click: (item, win, event) => {
              if (win) win.webContents.send('menu:file:export', 'encrypted')
            }
          },
          {
            type: 'separator'
          },
          {
            label: i18n.t('contextMenu.exportItems.exportToPDF'),
            click: (item, win, event) => {
              if (win) win.webContents.send('menu:file:export', 'pdf')
            }
          },
          {
            type: 'separator'
          },
          {
            label: i18n.t('contextMenu.exportItems.exportToArena'),
            click: (item, win, event) => {
              if (win) win.webContents.send('menu:file:export', 'arena')
            }
          }
        ]
      break
    }
    return menu
  }
}
