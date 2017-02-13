const choo = require('choo')
const mount = require ('choo/mount')
const html = require('bel')
const yo = require('yo-yo')
const css = require('sheetify')

const persist = require('choo-persist')

css('tachyons')
css('./css/color.css')
css('./css/frame.css')

const app = choo()

persist((persist) => {
  app.use(persist)

  app.router([
    '/', require('./windows/main')
  ])
  
  mount('body', app.start())
})
