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

// State
app.use(require('./stores/system')) // This is handling the UI.
app.use(require('./stores/global')) // This is for the app's global state.
app.use(require('./stores/filesystem')) // This is all file IO
app.use(require('./stores/keychain')) // This handles the keychain and passphrase.
app.use(require('./stores/note')) // This is where you store your note.

// State setup.
app.route('/', require('./windows/editor/'))
app.route('/setup', require('./windows/setup'))

app.mount('body')
