const path = require('path')
const fs = require('fs')
const remote = window.require('electron').remote
const { app, ipc, dialog } = remote.require('electron')

const html = require('bel')
const css = require('sheetify')

const utils = require('../utils/utils')
const files = require('../utils/files')

const base = css`
  :host {
    height: 100vh;
    padding: 1.5rem 1rem;
    font-family: 'NovelMono';

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;

    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;
  }
`

const container = css`
  :host {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
`

const header = css`
  :host {
    margin-top: 2rem;
    text-align: center;
    font-size: 14px;
  }
`

const field = css`
  :host {
    font-size: 14px;
  }
`
const label = css`
  :host {
    line-height: 1.5;
    margin-bottom: 0.5rem;
  }
`

const tip = css`
  :host {
    line-height: 1.5;
    margin-top: 0.5rem;
  }
`

const button = css`
  :host {
    font-size: 14px;
    padding: 0.85rem 1rem 0.65rem 1rem;
    font-family: 'NovelMono';

    border: none;
  }

  :host:focus {

  }

  .button-m:active {
    background-color: var(--c);
    color: var(--k);
  }
  .button-c:active {
    background-color: var(--f);
  }
`

const dirbox = css`
  :host {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: space-between;
  }
`

const dirinput = css`
  :host {
    flex-grow: 1;
    border: 1px solid currentcolor;
    background: none;
    font-size: 14px;
    padding: 0.85rem 1rem 0.65rem 1rem;
    font-family: 'NovelMono';
  }
`

const input = css`
  :host {
    border: 1px solid currentcolor;
    background: none;
    font-size: 14px;
    padding: 0.85rem 1rem 0.65rem 1rem;
    font-family: 'NovelMono';
    font-weight: bold;
    outline: none;
  }

  .b-input:focus,
  .b-input:active {
    background: var(--b);
    color: var(--k);
  }
  .b-input::selection {
    background: white;
    color: var(--k);
  }
`
module.exports = setupWindow

/**
 * The Setup Window handles initialisation of a
 * new app install and related functionality setup.
 */
function setupWindow(state, emit) {
  emit('log:debug', 'Rendering Setup View')

  return html`
    <body class="b-myc">
      <main class="${base}">

        <header class="${header} w">
          <h1>Txt</h1>
          <p>Simple, private journalling</p>
        </header>

        <section class="${container}">
          <label for="location" class="c ${label}">Location</label>
          <div class="c ${dirbox}">
            <div onclick=${newDirectory} class="${dirinput} c">
              ${ showTxtPath() }
            </div>
            <button onclick=${newDirectory} class="${button} bg-c k button-c">Change</button>
          </div>
          <label class="w ${tip}">Txt uses a folder on your computer to save and encrypt your work.</label>
        </section>

        <section class="${container}">
          <label for="passphrase" class="b ${label}">Passphrase</label>
          <input type="text" name="passphrase" id="passphrase" class="${input} b b-input"/>
          <label class="w ${tip}">Txt uses PGP to encrypt your notebook. Choose a strong phrase to best protect your entires.</label>
        </section>

        <footer class="${container}">
          <button name="save" onclick=${saveSettings} class="${button} bg-m f button-m">Create Notebook</button>
        </footer>

      </main>
    </body>
  `

  function showTxtPath() {
    emit('log:debug', 'Showing Txt target path')
  }


  // Interactions
  function newDirectory(e) {
    emit('log:debug', 'Asking for new directory')

    dialog.showOpenDialog({
      title: 'Choose your Txt folder',
      desiredPath: txtPath,
      properties: [ 'openDirectory', 'createDirectory', 'promptToCreate']
    }, function(filePaths) {
      if (filePaths) {
        //txtPath = path.normalize(filePaths[0])
        emit()
        send('global:writeDbPath', txtPath)
      }
    })
  }

  function saveSettings(e) {
    emit('log:debug', 'Attempting an app state save')
  }
}
/*
const base = css`
  :host {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 2rem;
  }

  .header {
    text-align: center;
    color: var(--w);
    line-height: 1.5;
  }

  .container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 0.5rem;
    line-height: 1.5;
  }

  .label {
    font-weight: normal;
  }

  .button {
    font-family: 'NovelMono', monospace;
    font-size: 14px;
    padding: 0.85rem 1rem 0.75rem 1rem;
  }

  .input {
    background: none;
    font-family: 'NovelMono', monospace;
    padding: 0.85rem 1rem 0.75rem 1rem;
    flex: 1;
  }

  .small {
    margin-top: 0.5rem;
    font-size: 13px;
    font-weight: normal;
    line-height: 1.5;
  }
`
const location = css`
  :host {
    font-size: 14px;
    font-family: 'NovelMono', monospace;
    width: 100%;
  }

  .location-input {
    border: 1px solid var(--c);
    color: var(--c);
  }
`

const passphrase = css`
  :host {
    font-size: 14px;
    font-family: 'NovelMono', monospace;
    width: 100%;
  }

  .passphrase-input {
    border: 1px solid var(--b);
    color: var(--b);
  }
  .passphrase-label {
    font-weight: normal;
  }
`

const ok = css`
  :host {
    font-size: 14px;
    font-family: 'NovelMono', monospace;
    width: 100%;
  }
  .ok-button {
    width: 100%;
    font-weight: bold;
    text-transform: uppercase;
    font-family: 'NovelMono', monospace;
    font-size: 14px;
    padding: 0.85rem 1rem 0.75rem 1rem;
  }

`

// Present the window
function setupWindow(state, prev, send) {

  document.title = 'Welcome to Txt'

  return html`
    <body class="b-myc">
      <main class="${base}">
        <header class="header">
          <h1>Txt</h1>
          <p>Simple, private journalling</p>
        </header>
        <section class="c ${location}">
          <label for="location">Location</label>
          <div class="container">
            <div class="location-input input" onclick=${pickDirectory}>
              ${ showPath() }
            </div>
            <button class="button bg-c" onclick=${pickDirectory}>Change</button>
          </div>
          <p class="small w">Txt uses a folder on your computer to save and encrypt your work.</p>
        </section>
        <section class="b ${passphrase}">
          <label for="passphrase" class="passphrase-label">Passphrase</label>
          <div class="container">
            <input type="text" name="passphrase" class="passphrase-input input" id="passphrase"/>
          </div>
          <p class="small w">Txt uses PGP to encrypt your notebook. Choose a strong phrase to best protect your entires.</p>
        </section>
        <footer class="${ok}">
          <button name="finish" class="k bg-m ok-button" onclick=${saveSettings}>Create Notebook</button>
        </footer>
      </main>
    </body>
  `

  function showPath() {
    var txtPath = state.global.path
    console.log(txtPath)
    return txtPath
  }

  function pickDirectory(e) {
    var txtPath = state.global.path
    dialog.showOpenDialog({
      title: 'Choose Your Txt Location',
      desiredPath: txtPath,
      properties: [ 'openDirectory', 'createDirectory', 'promptToCreate']
    }, function(filePaths) {
      if (filePaths) {
        txtPath = path.normalize(filePaths[0])
        send('global:writeDbPath', txtPath)
      }
    })
  }

  function saveSettings(e) {
    console.log('hi')
  }
}

*/
