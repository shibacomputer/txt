import React from 'react'
import { Component } from 'monoapp-react'
import style from './style'

class Textfield extends Component {
  constructor (props) {
    super(props)
    this.state = { ...props }
  }

  render () {
    const { value, placeholder, valid, passphrase, enabled, onChange } = this.props

    return (
      <input className={ `${ style.input }` } placeholder={ placeholder } onChange={ onChange } />
    )
  }
}

export default Textfield
