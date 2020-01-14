import React from 'react'
import { Component } from 'monoapp-react'

import Button from '../button'
import Textfield from '../textfield'

import style from './style'

class Passphrase extends Component {

  render () {

    <React.Fragment>
      <div>
        <Textfield placeholder={ passphraseHasError? 'Bad Passphrase, Try Again' : 'Passphrase' } type='password' onChange={ this.handlePassphraseChange } error={ passphraseHasError } />
      </div>
    </React.Fragment>
  }
}

export default Passphrase
