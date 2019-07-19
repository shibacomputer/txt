const { BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')
const config = require('./utils/config')
const errors = require('./utils/errors')
const windows = require('./windows')

export function init(t) {

  ipcMain.on('modal:show', (e, name, obj) => {
    let win = BrowserWindow.getFocusedWindow()
    let cfg = config.dialog(name, obj, t)
    if (win) {
      create(e, win, cfg, obj)
    } else return
  })

  ipcMain.on('modal:close', (e, sender) => {
    let win = BrowserWindow.getFocusedWindow()
    if (win) {
      e.sender.send('modal:hide', response)
      win.hide()
    } else return
  })
}

function create(e, win, cfg, obj) {
  let response
  // TODO: Make this conditional based on darwin process
  switch (cfg.modal) {

    case 'open':
      dialog.showOpenDialog(win, cfg, (response) => {

        if (response) {
          let pathParsed = path.parse(response[0])

          let newOpts = {
            uri: response[0],
            fn: pathParsed.name,
            ext: pathParsed.ext
          }
          e.sender.send('modal:show', newOpts)
        } else e.sender.send('modal:show', null)
      })
    break

    case 'save':
      dialog.showSaveDialog(win, cfg, (response) => {
        if (response) {
          let pathParsed = path.parse(response)

          let newOpts = {
            uri: response,
            fn: pathParsed.name,
            ext: pathParsed.ext
          }
          e.sender.send('modal:show', newOpts)
        } else e.sender.send('modal:show', null)
      })
    break

    case 'error':
      dialog.showMessageBox(win, opts, (response) => {
        e.sender.send('event:error:reply', { id: response, label: opts.buttons[response].toLowerCase() })
      })
    break

    case 'modal':
      let modal = windows.makeWindow(cfg, obj.payload.resource, win)
      modal.once('ready-to-show', () => {
        modal.show()
        win.show()
      })
    break

    default:
      dialog.showMessageBox(win, cfg, (response) => {
        e.sender.send('modal:show', response)
      })
    break
  }
}
