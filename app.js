const choo    = require('choo'),
      expose  = require('choo-expose'),
      log     = require('choo-log'),
      persist = require('choo-persist'),
      css     = require('sheetify')

// Setup global CSS
css('./css/defs.css')
css('./css/common.css')
css('./css/editor.css')

const app = choo()

// App setup.
app.use(persist())
app.use(log())
app.use(expose())

// Stores
app.use(require('./stores/system')) // This is handling the UI.
app.use(require('./stores/global')) // This is for the app's global state.
app.use(require('./stores/filesystem'))
app.use(require('./stores/keychain'))
app.use(require('./stores/note'))

// State setup.
app.route('/', require('./windows/main'))
app.route('/setup', require('./windows/setup'))

app.mount('body')
