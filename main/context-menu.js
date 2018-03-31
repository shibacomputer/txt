
module.exports = {
  buildMenu: function(menu, opts) {
    opts? opts = opts : opts = []

    switch (menu) {
      case 'browser-cell':
        menu = [
          {
            label: 'Rename',
            click: (item, win, event) => {
              if (win) win.webContents.send('menu:file:rename')
            },
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
