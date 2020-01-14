import React from 'react'
// import { Controlled as CodeMirror } from 'react-codemirror2'
// import 'codemirror/addon/selection/mark-selection'

// require('codemirror/mode/markdown/markdown')

import { Component } from 'monoapp-react'
import style from './style'

// import 'codemirror/lib/codemirror.css'
// import './style.css'

class Textbox extends Component {
  constructor (props) {
    super(props)
    this.state = { ...props }

    this.handleFocus = this.handleFocus.bind(this)
    this.handleChange = this.handleChange.bind(this)

  }

  componentDidMount() {
    this.ref.focus()
  }

  componentDidUpdate(prevProps, prevState) {
    this.ref.setSelectionRange(this.state.doc.selectStart, this.state.doc.selectEnd) // Fix this later
  }

  handleFocus(e) {
    this.emit('context:update', [{editorHasFocus: true}])
  }
  
  handleBlur(e) {
    this.emit('context:update', [{editorHasFocus: false}])
  }

  handleChange(e) {
    let value = e.target.value
    this.emit('doc:update', {
      contents: value,
      selectStart: this.ref.selectionStart,
      selectEnd: this.ref.selectionEnd
    })
  }

  render () {
    const {doc, context, prefs} = this.props
    return (
      <section className={ style.box }>
        <textarea 
          className={ style.area } 
          onChange={ this.handleChange }
          onFocus={ this.handleFocus }
          ref={ref => {
            this.ref = ref
          }}
          value={ doc.contents }
        ></textarea>

        {/* <CodeMirror
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
        /> */}
      </section>
    )
  }
}

export default Textbox
