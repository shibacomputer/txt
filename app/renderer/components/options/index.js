import React from 'react'
import { Component } from 'monoapp-react'

import Button from '../button'
import Checkbox from '../checkbox'
import Textfield from '../textfield'

import style from './style'

class Options extends Component {
  constructor (props) {
    super(props)
    this.state = { ...props }
    this.handleModalHelp = this.handleModalHelp.bind(this)
    this.handleModalDone = this.handleModalDone.bind(this)
    this.handleNewAuthor = this.handleNewAuthor.bind(this)
    this.handleLinkAuthor = this.handleLinkAuthor.bind(this)
    this.handleCancelCreateAuthor = this.handleCancelCreateAuthor.bind(this)
    this.handleCreateAuthor = this.handleCreateAuthor.bind(this)
    this.handleDeleteAuthor = this.handleDeleteAuthor.bind(this)
    this.handleAuthorExport = this.handleAuthorExport.bind(this)
    this.handleAuthorValidatePassphrase = this.handleAuthorValidatePassphrase.bind(this)
    this.handlePassphraseChange = this.handlePassphraseChange.bind(this)
    this.handleAuthorChange = this.handleAuthorChange.bind(this)

    this.handleUpdatesCheck = this.handleUpdatesCheck.bind(this)
    this.handleBorderCheck = this.handleBorderCheck.bind(this)

    this.handlePassphraseCheck = this.handlePassphraseCheck.bind(this)
  }

  // Events
  handleModalDone() {
    this.emit('context:update', {
      preferencesHaveChanges: false
    })
    this.emit('prefs:write')
    this.emit('close')
  }

  handleModalHelp() {
    this.emit('open', 'https://txt.shiba.computer/support')
  }

  handleNewAuthor() {
    this.emit('context:update', {
      authorIsNew: true,
      authorIsLinking: false,
      authorExists: false
    })
  }

  handleLinkAuthor() {
    this.emit('author:link')
  }

  handleAuthorExport() {
    this.emit('author:export')
  }

  handleCancelCreateAuthor() {
    this.emit('author:init', { }, null)
    this.emit('context:update', {
      authorIsNew: false,
      authorIsLinking: false,
      authorExists: false
    })
  }

  handleCreateAuthor() {
    if (this.state.passPhrase && this.state.author) {
      let newAuthor = {
        name: this.state.author,
        secret: this.state.passPhrase
      }
      this.emit('author:new', newAuthor)
    }
  }

  handleAuthorValidatePassphrase(e) {
    if (this.state.passPhrase) {
      let validatingAuthor = {
        name: this.global.author.keychainName.replace('@txt',''),
        secret: this.state.passPhrase
      }
      this.emit('author:validate', validatingAuthor)
    }
  }

  handleDeleteAuthor(e) {
    // TODO add confirmation
    this.emit('author:delete') // TODO put in event chain
  }

  handlePassphraseChange(e) {
    let newState = this.state
    this.state.passPhrase = e.target.value

    this.setState(newState)
  }

  handleAuthorChange(e) {
    let newState = this.state
    this.state.author = e.target.value

    this.setState(newState)
  }

  handleBorderCheck(e) {
    this.emit('prefs:update', { hasBorder: e.target.checked })
  }

  handlePassphraseCheck(e) {
    this.emit('prefs:update', { usesKeychain: e.target.checked })
  }

  handleUpdatesCheck(e) {
    this.emit('prefs:update', { allowUpdates: e.target.checked })
  }

  render () {
    this.emit('context:update', { hasDialog: true })

    let appearanceType = this.global.prefs.hasTheme,
        appearanceFrame = this.global.prefs.hasFrame,
        appearanceBorder = this.global.prefs.hasBorder,
        updates = this.global.prefs.allowUpdates,
        rememberPassphrase = this.global.prefs.usesKeychain,
        passphraseValidated = this.global.prefs.passphraseValidated,
        authorExists = this.global.context.authorExists,
        showNewAuthor = this.global.context.authorIsNew,
        showLinkAuthor = this.global.context.authorIsLinking,
        author = this.global.author.name,
        keychainName = this.global.author.keychainName

    return (
      <div className= { style.group }>
        <div>
          <section className={ style.options }>
            <aside className={ style.left }>
              <label className={ `${ style.label } ${ style.offset }` }>Appearance:</label>
            </aside>
            <main className={ style.right }>
              <div className={ style.set }>
                <Button type='primary' label='Dark' />
                <Button type='light' label='Light' />
              </div>
            </main>
          </section>

          <hr className={ style.rule } />

          <section className={ style.options }>
            <aside className={ style.left }>
              <label className={ style.label }>Updates:</label>
            </aside>
            <main className={ style.right }>
            <div className= { style.set }>
              <Checkbox label='Allow automatic updates' defaultChecked={ updates } onChange={ this.handleUpdatesCheck }/>
            </div>
            </main>
          </section>

          <hr className={ style.rule } />

          <section className={ style.options }>
            <aside className={ style.left }>
              <label className={ style.label }>Author:</label>
            </aside>

            <main className={ style.right }>
            { !authorExists && !showNewAuthor && !showLinkAuthor && (
              <React.Fragment>
                <div className={ style.set }>None set</div>
                <div className={ style.set }>
                  <Button type='primary' label='New' onClick={ this.handleNewAuthor }/>
                  <Button type='primary' label='Link…' onClick={ this.handleLinkAuthor } />
                </div>
              </React.Fragment>

            )}
            { authorExists && (
              <React.Fragment>
                <div className={ style.set }>
                  { author }
                </div>
                <div className={ style.set }>
                  <Button type='primary' label='Export…' onClick={ this.handleAuthorExport } />
                  <Button type='primary' label='Delete' onClick={ this.handleDeleteAuthor }/>
                </div>
              </React.Fragment>
            ) }

            { showLinkAuthor && (
              <React.Fragment>
                <div className={ style.set }>
                  Found: { keychainName.replace('@txt','') }
                </div>
                <div className={ style.set }>
                  <Textfield placeholder='Passphrase' onChange={ this.handlePassphraseChange } />
                </div>
                <div className={ style.set }>
                  <Button type='secondary' label='Cancel' onClick={ this.handleCancelCreateAuthor } />
                  <Button type='primary' label='Link' onClick={ this.handleAuthorValidatePassphrase }/>
                </div>
              </React.Fragment>
            )}

            { showNewAuthor && (
              <React.Fragment>
                <div className={ `${ style.set } ${ style.textoffset }` }>
                  <Textfield placeholder='Name or psuedonym' onChange={ this.handleAuthorChange }/>
                </div>
                <div className={ style.set }>
                  <Textfield placeholder='Passphrase' onChange={ this.handlePassphraseChange } />
                </div>
                <div className={ style.set }>
                  <Button type='secondary' label='Back' onClick={ this.handleCancelCreateAuthor } />
                  <Button type='primary' label='Create' onClick={ this.handleCreateAuthor } disabled= { this.global.context.working } />
                </div>
              </React.Fragment>
            ) }
              <div className={ style.set }>
                <span className={ style.tip }>Your author file encrypts your work, and also helps you collaborate with others. <br />Learn more…</span>
              </div>
            </main>
          </section>

        </div>
        <footer className={ style.footer }>
          <Button
            type='secondary'
            label='Help'
            onClick={ this.handleModalHelp } />
          <Button
            type='positive'
            label='Done'
            disabled={ !authorExists }
            onClick={ this.handleModalDone } />
        </footer>
      </div>
    )
  }
}

export default Options
