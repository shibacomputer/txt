import React from 'react'
import { Component } from 'monoapp-react'
import style from './style'

class Toolbar extends Component {

  constructor (props) {
    super(props)
    this.state = { ...props }
  }
  render () {
    const { words, isWorking } = this.props
    return (

      <nav className={ style.toolbar }>
        <section className={ style.section }>
        </section>
        <section className={ style.section }>
          <span className={ style.num }>{ words }</span> words
        </section>
        <section className={ style.section }>
          { isWorking && (
            <div className={ style.spinner }></div>
          )}
        </section>
      </nav>
    )
  }
}

export default Toolbar
