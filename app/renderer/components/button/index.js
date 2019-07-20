import React from 'react'
import { Component } from 'monoapp-react'
import style from './style'

class Button extends Component {
  constructor (props) {
    super(props)
    this.state = { ...props }
  }

  render () {
    const {type, label, className, disabled, onClick} = this.props
    return (
      <button
        className={ `${ className? classname : '' } ${ disabled? style.disabled : '' } ${ style.base } ${ style[type] }` }
        disabled={ disabled }
        name={ label }
        onClick={ onClick }
        type='button'>
          { label }
      </button>
    )
  }
}

export default Button
