import React from 'react'
import { Component } from 'monoapp-react'
import style from './style'

class Checkbox extends Component {
  constructor (props) {
    super(props)
    this.state = { ...props }
  }

  render () {
    const {action, className, disabled, defaultChecked = false, label, onChange, type, } = this.props
    return (
      <React.Fragment>
        <input
          className={ `${ className } ${ style.base } ${ style[type] }` }
          defaultChecked={ defaultChecked }
          disabled={ disabled }
          name={ label }
          onChange={ onChange }
          type='checkbox'
        />
        <label className={ style.label }>{ label }</label>
      </React.Fragment>
    )
  }
}

export default Checkbox
