const choo  = require('choo')
const store = require('./store/sys')

const app = choo()

// App setup.
app.use(require('choo-expose')())
app.use(require('choo-persist')())

if (process.env.NODE_ENV === 'dev') {
  app.use(require('choo-devtools')())
}

app.use(store)

// Route setup.
app.route('/', require('./main'))
app.mount('body')
