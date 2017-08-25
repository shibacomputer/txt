const choo    = require('choo')
const expose  = require('choo-expose')
const log     = require('choo-log')
const persist = require('choo-persist')
const css     = require('sheetify')
const tools   = require('choo-devtools')

// Setup global CSS
css('./css/defs.css')
css('./css/editor.css')
css('./css/common.css')

const app = choo()

// App setup.
app.use(persist())
app.use(log())
app.use(expose())
app.use(tools())

// State
app.use(require('./state/sys')) // This is handling the UI.
app.use(require('./state/key')) // This handles the keychain and passphrase.
app.use(require('./state/note')) // This is where you store your note.

// Route setup.
app.route('/', require('./windows/editor/'))
app.route('/setup', require('./windows/setup/'))

app.mount('body')
