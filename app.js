const choo = require('choo')
const mount = require ('choo/mount')
const log = require('choo-log')
const persist = require('choo-persist')

const css = require('sheetify')

// Setup global CSS
css('tachyons')
css('./css/color.css')
css('./css/frame.css')
css('./css/common.css')
css('./css/editor.css')

persist((persist) => {
  const app = choo()
  app.use(persist)
  app.use(log())

  app.model(require('./models/global')())

  app.router({ default: '/' }, [
    ['/', require('./windows/main')],
    ['/setup', require('./windows/setup')]
  ])

  mount('body', app.start())
})
