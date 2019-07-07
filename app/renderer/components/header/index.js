import React from 'react'
import { Component } from 'monoapp-react'
import style from './style'

class Header extends Component {
  constructor (props) {
    super(props)
    this.state = { ...props }
  }

  render () {
    const { title } = this.props


    return (
      <header className={ style.header }>
        <h1 className={ style.title }>{ title }</h1>
      </header>
    )
  }
}

export default Header
