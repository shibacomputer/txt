const { BrowserWindow } = require('electron')
const { format } = require('url')
const { resolve } = require('app-root-path')
const isDev = require('electron-is-dev')

const config = require('./utils/config')

const devPath = 'http://localhost:9008/'
const prodPath = format({
  pathname: resolve('app/renderer/.parcel/production/'),
  protocol: 'file:',
  slashes: true
})

const url = isDev ? devPath : prodPath

export function init() {
  let win = makeWindow(config.dialog({ type: 'app' }))
  win.on('ready-to-show', () => {
    win.show()
  })
  return win
}

export function makeWindow(opts, source, parent) {
  if (parent) opts.window.parent = parent

  let win = new BrowserWindow(opts.window)
  let target = source? url + '#' + source : url

  // if (isDev) { win.webContents.openDevTools() }

  win.loadURL(target)

  win.on('close', () => {

  })

  win.on('closed', () => {

  })

  return win
}