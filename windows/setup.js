const path = require('path')
const remote = window.require('electron').remote
const { app, ipc, dialog } = remote.require('electron')

const html = require('choo/html')
const css = require('sheetify')
const utils = require('../utils/utils')

const base = css`
  :host {
    height: 100vh;
    padding: 1.5rem 1rem;
    font-family: 'FiraCode';

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
    font-family: 'FiraCode';

    border: none;
  }

  :host:disabled {
    background-color: #747474;
    border: 1px solid #B3B3B3;
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
    font-family: 'FiraCode';
  }
`

const input = css`
  :host {
    border: 1px solid currentcolor;
    background: none;
    font-size: 14px;
    padding: 0.85rem 1rem 0.65rem 1rem;
    font-family: 'FiraCode';
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
              ${ currentPath() }
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

  function currentPath() {
    emit('log:debug', 'Showing Txt target path')
    return state.sys.path.working
  }


  // Interactions
  function newDirectory(e) {
    emit('log:debug', 'Asking for new directory')
    var dbPath = state.sys.path.working
    dialog.showOpenDialog({
      title: 'Choose your Txt folder',
      desiredPath: dbPath,
      properties: [ 'openDirectory', 'createDirectory', 'promptToCreate']
    }, function(filePaths) {
      if (filePaths) {
        dbPath = path.normalize(filePaths[0])
        emit('global:updatePath', dbPath)
      }
    })
  }

  function saveSettings(e) {
    emit('log:debug', 'Attempting an app state save')
    var phrase = document.getElementById('passphrase').value
    utils.setSetting('isActiveInstall', true, () => {
      utils.setSetting('usesKeychain', true, () => {
        emit('keychain:create', phrase)
      })
    })
  }
}
