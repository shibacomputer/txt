import React from 'react'
import { Component } from 'monoapp-react'
import { setTheme } from '../../utils/themes'

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

    this.handleDarkThemeChange = this.handleDarkThemeChange.bind(this)
    this.handleLightThemeChange = this.handleLightThemeChange.bind(this)

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
    this.state.passPhrase = e.target.value
  }

  handleAuthorChange(e) {
    let newState = this.state
    this.state.author = e.target.value
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

  handleDarkThemeChange(e) {
    this.emit('prefs:update', { hasTheme: 'dark' })
  }

  handleLightThemeChange(e) {
    this.emit('prefs:update', { hasTheme: 'light' })
  }

  render () {
    this.emit('context:update', { hasDialog: true })

    let appearanceType = this.global.prefs.hasTheme,
        appearanceFrame = this.global.prefs.hasFrame,
        appearanceBorder = this.global.prefs.hasBorder,
        updates = this.global.prefs.allowUpdates,
        rememberPassphrase = this.global.prefs.usesKeychain,
        passphraseHasError = this.global.context.passphraseHasError,
        passphraseValidated = this.global.context.passphraseValidated,
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
                <Button type='primary' label='Dark' onClick={ this.handleDarkThemeChange } />
                <Button type='light' label='Light' onClick={ this.handleLightThemeChange } />
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
                  <Button type='primary' label='Import…' onClick={ this.handleLinkAuthor } />
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
                  <Textfield placeholder={ passphraseHasError? 'Bad Passphrase, Try Again' : 'Passphrase' } type='password' onChange={ this.handlePassphraseChange } error={ passphraseHasError } />
                </div>
                <div className={ style.set }>
                  <Button type='secondary' label='Abort' onClick={ this.handleCancelCreateAuthor } />
                  <Button type='positive' label='Done' onClick={ this.handleAuthorValidatePassphrase }/>
                </div>
              </React.Fragment>
            )}

            { showNewAuthor && (
              <React.Fragment>
                <div className={ `${ style.set } ${ style.textoffset }` }>
                  <Textfield placeholder='Name or psuedonym' onChange={ this.handleAuthorChange }/>
                </div>
                <div className={ style.set }>
                  <Textfield placeholder='Passphrase' type='password' onChange={ this.handlePassphraseChange } />
                </div>
                <div className={ style.set }>
                  <Button type='secondary' label='Back' onClick={ this.handleCancelCreateAuthor } />
                  <Button type='primary' label='Create' onClick={ this.handleCreateAuthor } disabled= { this.global.context.working } />
                </div>
              </React.Fragment>
            ) }
              <div className={ style.set }>
                <span className={ style.tip }>
                { !authorExists && !showNewAuthor && !showLinkAuthor && (
                  <React.Fragment>
                    Create or import an author to encrypt your work. You can also use this profile to let others securely share files with you.
                  </React.Fragment>
                ) }
                { showNewAuthor && (
                  <React.Fragment>
                    Create or import an author to encrypt your work. You can also use this profile to let others securely share files with you.
                  </React.Fragment>
                ) }
                { showLinkAuthor && (
                  <React.Fragment>
                    Enter your passphrase to import this author and encrypt your work.
                  </React.Fragment>
                ) }
                { authorExists && (
                  <React.Fragment>
                    This author encrypts your work and allows you to share encrypted work with others.
                  </React.Fragment>
                ) }
                </span>
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
