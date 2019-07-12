import regeneratorRuntime from 'regenerator-runtime/runtime' // LOL

import monoapp from 'monoapp'
import withReact from 'monoapp-react'
import devTools from 'choo-devtools'
import persist from 'choo-persist'

import core from './data/core'
import context from './data/context'
import doc from './data/doc'
import prefs from './data/prefs'
import author from './data/author'

import interfaceEditor from './editor'
import interfacePrefs from './prefs'

const app = monoapp()

app.use(withReact)
app.use(devTools()) // TODO Make this import in line with devDependencies

app.use(core)
app.use(context)
app.use(doc)
app.use(prefs)
app.use(author)

// app.use(persist())

app.mount('#txt')

app.route('/', interfaceEditor)
app.route('/prefs', interfacePrefs)
