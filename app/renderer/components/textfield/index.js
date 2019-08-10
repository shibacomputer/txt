import React from 'react'
import { Component } from 'monoapp-react'
import style from './style'

class Textfield extends Component {
  constructor (props) {
    super(props)
    this.state = { ...props }
  }

  render () {
    const { value, error, placeholder, valid, passphrase, enabled, onChange, type='text' } = this.props

    return (
      <input className={ `${ style.input } ${ error? style.error : '' } ${ error? 'headShake' : null }` } placeholder={ placeholder } onChange={ onChange } type={ type }/>
    )
  }
}

export default Textfield
