const choo  = require('choo')
const state = require('./state')

const app = choo()

// App setup.
if (process.env.NODE_ENV === 'dev') {
  app.use(require('choo-devtools')())
}

app.use(state)

// Route setup.
app.route('/', require('./lock'))
app.mount('body')
