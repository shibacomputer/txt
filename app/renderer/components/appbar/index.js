import React from 'react'
import { Component } from 'monoapp-react'
import moment from 'moment'


import style from './style'

const Appbar = ({ author, collaborators, date, hasChanges, respondsToChanges, title, translate }) => (
  <header className={ style.header }>
    <div className={`${ style.component } ${hasChanges? style.hasChanges : null }`}>
      <label className={ style.title }>
        Date
      </label>
      <span className={ style.value }>
        { date? moment(date).format('YYYY.MM.DD HH:mm') : '---' }
      </span>
    </div>
    <div className={ style.component }>
      <label className={ style.title }>
        Doc
      </label>
      <span className={ style.value }>
        { title }
      </span>
    </div>
    <div className={ style.component }>
      <label className={ style.title }>
        Author
      </label>
      <span className={ style.value }>
        { author? author : '---' }
      </span>
    </div>
    <div className={ style.component }>
      <label className={ style.title }>
        Collaborators
      </label>
      <span className={ style.value }>
        Coming soon …
      </span>
    </div>
  </header>
)

export default Appbar
