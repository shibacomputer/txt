
module.exports = {
  buildMenu: function(menu, opts) {
    opts? opts = opts : opts = []

    switch (menu) {
      case 'browser-cell':
        menu = [
          {
            label: 'New...',
            submenu: [
              {
                label: 'New File',
                click: (item, win, event) => {
                  if (win) win.webContents.send('menu:file:new:file')
                }
              },
              {
                label: 'New Folder',
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
            label: 'Reveal...',
            click: (item, win, event) => {
              if (win) win.webContents.send('menu:context:reveal')
            }
          },
          {
            label: 'Rename',
            click: (item, win, event) => {
              if (win) win.webContents.send('menu:file:rename')
            },
          },
          {
            type: 'separator'
          },
          {
            label: 'Move to Trash',
            click: (item, win, event) => {
              if (win) win.webContents.send('menu:file:trash')
            }
          }
        ]
        break
      case 'footer':
        menu = [
          {
            label: 'Reveal...',
            click: (item, win, event) => {
              if (win) win.webContents.send('menu:context:reveal:library')
            }
          }
        ]
      }
    return menu
  }
}
