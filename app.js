const choo = require('choo')
const mount = require ('choo/mount')
const log = require('choo-log')
const persist = require('choo-persist')
const xtend = require('xtend')

const css = require('sheetify')

// Setup global CSS
css('tachyons')
css('./css/color.css')
css('./css/frame.css')
css('./css/common.css')
css('./css/editor.css')

const opts = {
  filter: (state) => {
    state = xtend(state)
    delete state.repos
    return state
  }
}

persist(opts, (p) => {
  const app = choo()
  app.use(p)
  app.use(log())

  app.router({ default: '/' }, [
    ['/', require('./windows/main')],
    ['/setup', require('./windows/setup')]
  ])

  mount('body', app.start())
})
