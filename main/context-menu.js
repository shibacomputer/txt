
module.exports = {
  buildMenu: function(menu, opts) {
    opts? opts = opts : opts = []

    switch (menu) {
      case 'browser-cell':
        menu = [
          {
            label: 'Reveal in Finder...',
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
      }
    return menu
  }
}
