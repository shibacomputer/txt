const choo    = require('choo'),
      expose  = require('choo-expose'),
      log     = require('choo-log'),
      persist = require('choo-persist'),
      css     = require('sheetify')

// Setup global CSS
/*
css('./css/color.css')
css('./css/frame.css')
css('./css/common.css')
css('./css/editor.css')
*/

css('./css/defs.css')
css('./css/common.css')

const app = choo()
app.use(persist())
app.use(log())
app.use(expose())

app.route('/', require('./windows/setup'))
app.route('/setup', require('./windows/setup'))

app.mount('body')
