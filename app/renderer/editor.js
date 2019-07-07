import React from 'react'
import Appbar from './components/appbar'
import Textbox from './components/textbox'
import Toolbar from './components/toolbar'
import './utils/definitions.css'

const editor = (state, emit) => (
  <main className='container'>
    <Appbar
      title={state.doc.title}
      respondsToChanges={true}
      hasChanges={state.context.editorHasChanges}
      date={state.doc.lastUpdated? state.doc.lastUpdated : state.doc.created}
      author={state.author.name }
    />
    <Textbox
      doc={state.doc}
      context={state.context}
      prefs={state.prefs}
    />
    <Toolbar
      words={state.doc.words}
      isWorking={state.context.working}
    />
  </main>
)

export default editor
