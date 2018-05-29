
module.exports = {
  buildMenu: function(menu, opts) {
    opts? opts = opts : opts = []

    switch (menu) {
      case 'file':
        menu = [
          { 
            label: 'Open',
            click: (item, win, event) => {
              if (win) win.webContents.send('menu:file:open', false)
            }
          },
          { 
            label: 'Open in New Window',
            click: (item, win, event) => {
              if (win) win.webContents.send('menu:file:open', true)
            }
          },
          {
            type: 'separator'
          },
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
            label: 'Export',
            submenu: [
              {
                label: 'to Plain Text…',
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
                enabled: opts.export? opts.export : false,
                click: (item, win, event) => {

                }
              }
            ]
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
      case 'directory': 
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
      break
      case 'share':
        menu = [
          {
            label: 'to Plain Text…',
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
      break  
    }
    return menu
  }
}
