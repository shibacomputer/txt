const choo = require('choo')
const mount = require ('choo/mount')
const html = require('yo-yo')
const css = require('sheetify')
const persist = require('choo-persist')
const app = choo()

// Setup global CSS
css('tachyons')
css('./css/color.css')
css('./css/frame.css')
css('./css/common.css')

persist((persist) => {
  app.use(persist)


  app.router([
    '/', require('./windows/main')
  ])

  mount('body', app.start())
})
