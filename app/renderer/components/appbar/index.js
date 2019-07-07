import React from 'react'
import { Component } from 'monoapp-react'
import moment from 'moment'
import style from './style'

class Appbar extends Component {
  constructor (props) {
    super(props)
    this.state = { ...props }
  }

  render () {
    const {title, date, author, collaborators, respondsToChanges, hasChanges} = this.props

    let timestamp = moment(date).format('YYYY.MM.DD HH:mm')

    return (
      <header className={ style.header }>
        <div className={`${ style.component } ${hasChanges? style.hasChanges : null }`}>
          <label className={ style.title}>Date</label>
          <span className={ style.value }>{date? timestamp : '---'}</span>
        </div>
        <div className={ style.component }>
          <label className={ style.title}>Doc</label>
          <span className={ style.value }>{title}</span>
        </div>
        <div className={ style.component }>
          <label className={ style.title}>Author</label>
          <span className={ style.value }>{author? author : '---'}</span>
        </div>
        <div className={ style.component }>
          <label className={ style.title}>Collaborators</label>
          <span className={ style.value }>Coming soon …</span>
        </div>
      </header>
    )
  }
}

export default Appbar
