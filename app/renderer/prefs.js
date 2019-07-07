import React from 'react'
import { Component } from 'monoapp-react'

import Header from './components/header'
import Options from './components/options'

const prefs = (state, emit) => (
  <main>
    <Header title='Preferences' />
    <Options />
  </main>
)

export default prefs
