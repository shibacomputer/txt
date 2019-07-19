import React from 'react'
import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/addon/selection/mark-selection'

require('codemirror/mode/markdown/markdown')

import { Component } from 'monoapp-react'
import 'codemirror/lib/codemirror.css'
import './style.css'

class Textbox extends Component {
  constructor (props) {
    super(props)
    this.state = { ...props }

    this.handleFocus = this.handleFocus.bind(this)
    this.handleChange = this.handleChange.bind(this)

  }

  handleFocus(e) {
    let newState = this.state
    let focus = e.type === 'focus' ? true : false
    newState.context.editorHasFocus = focus

    this.setState(newState)
    this.emit('context:update', [{editorHasFocus: focus}])
  }

  handleChange(editor, data, value) {
    this.emit('doc:update', {contents: value})
  }

  render () {
    const {doc, context, prefs} = this.props
    return (
      <section className="box">
        <CodeMirror
          value= {doc.contents}
          onBeforeChange={(editor, data, value) => {
            this.handleChange(editor, data, value)
          }}
          options={{
            disableSpellcheck: false,
            lineWrapping: true,
            lineNumbers: false,
            mode: 'markdown',
            theme: prefs.hasTheme,
            styleSelectedText: true
          }
        }
        />
      </section>
    )
  }
}

export default Textbox
