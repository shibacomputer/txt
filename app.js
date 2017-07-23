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
app.use(require('./state/sys')) // This is handling the UI.
app.use(require('./state/key')) // This handles the keychain and passphrase.
app.use(require('./state/note')) // This is where you store your note.
app.use(require('./state/fs')) // This is all file IO

// State setup.
app.route('/', require('./windows/editor/'))
app.route('/setup', require('./windows/setup'))

app.mount('body')
