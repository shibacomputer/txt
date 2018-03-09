const { ipcRenderer } = require('electron')

const html = require('choo/html')
const style = require('./style')

module.exports = setupApplication

/**
 * The Setup Window handles initialisation of a
 * new app install and related functionality setup.
 */
function setupApplication(state, emit) {
  let keysUri

  function switchType(e) {
    emit('state:switchType', e.target.dataset.value)
  }

  function updatePassphrase(e) {
    emit('state:updatePassphrase', e.target.value)
  }

  function respondToKeyDropdown(e) {
    if(e.target.selectedIndex === (e.target.length - 1)) {
      ipcRenderer.once('done:getFile', (event, f) => {
        if (f) emit('state:loadKey', f[0])
        else return
      })

      let props = {
        title: 'Import Private Key',
        button: 'Import',
        filters: [
          { name: 'PGP Private Keys', extensions: ['asc', 'key'] }
        ],
        msg: 'Find and import your private key.',
        properties: ['openFile']
      }
      ipcRenderer.send('get:file', props)
    }
  }

  function keyDropdown() {
    return html`
      <select name="keyinput" id="keyinput" class="b b-input" onchange=${respondToKeyDropdown}/>
        <option ${ !state.selectedKey ? 'selected' : '' } disabled></option>
        ${ state.availableKeys.length !== 0 ? html`
          ${
            state.availableKeys.map( (key) => {
              return html`
                <option value=${key.id} ${ key.id.localeCompare(state.selectedKey.id) === 0 ? 'selected' : '' }> ${key.name} (${key.id}) </option>
              `
            })
          }
          ` : null
        }
        ${ state.availableKeys.length !== 0 ? html `
          <option disabled>────────────────────────────</option>` : null
        }
        <option ${ state.selectedKey ? '' : '' } value="import">Import from file...</option>
      </select>
    `
  }

  function respondToPathButton() {
    var locationButton = document.getElementById('locationButton')
    locationButton.click()
  }

  function updateWorkPath(event) {
    emit('state:updateWorkPath', event.target.files[0])
  }

  function respondToNextButton() {
    emit('state:doSetup')
  }

  function nextButton() {
    return html`
      <button name="save" class="bg-m f button-m" ${state.valid ? '' : 'disabled'} onclick=${respondToNextButton}>Next</button>
    `
  }

  return html`
    <body class="b-myc">
      <main class=${style.main}>

        <header class=${style.header}>
          <div class="logo">
          </div>
          <h1>Txt</h1>
          <p>Simple, private journalling</p>
        </header>

        <section class=${style.settings}>
          <div class=${style.segmented}>
            <input type="radio"
                   name="keytype"
                   id="string"
                   ${!state.useKey? 'checked' : ''}>
              <label for="string" data-value="string"
                     onclick=${switchType}>Use a Passphrase</label>
            <input type="radio"
                   name="keytype"
                   id="key"
                   ${state.useKey? 'checked' : ''}>
              <label for="key" data-value="key"
                     onclick=${switchType}>Use a PGP Key</label>
          </div>
          <div class=${style.stringtab} style=${state.useKey? 'display: none' : ''}>
            <label for="stringinput" class="b">Enter a passphrase</label>
            <input type="text"
                   name="stringinput"
                   id="stringinput"
                   class="b b-input"
                   onchange=${updatePassphrase}
                   value=${state.string}/>
            <label class=${style.tip}>Choose a strong phrase to best protect your files. <span class="b">Save your passphrase somewhere safe. If you lose it, your work is gone forever!</span></label>
          </div>
          <div class=${style.keytab} style=${!state.useKey? 'display: none' : ''}>
            <label for="keyinput" class="b">Select your key</label>
            ${keyDropdown()}
            <label class=${style.tip}>Use a key to automatically encrypt and decrypt your work. <span class="b">Don't have a key? Learn how to make one.</span></label>
          </div>
        </section>
        <div class=${style.folder}>
          <label for="folderinput" class="b">Save work to...</label>
          <div class=${style.locationBox}>
            <input class=${style.locationButton} onchange=${updateWorkPath} id="locationButton" type="file" webkitdirectory />
            <div class=${style.location} onclick=${respondToPathButton}>
              ${state.workingPath ? state.workingPath : 'Set a directory...'}
            </div><button onclick=${respondToPathButton}>📁</button>
          </div>
          <label class=${style.tip}>By default, Txt stores your work on your local computer.</label>
        </div>

        <footer class=${style.footer}>
          ${nextButton()}
        </footer>

      </main>
    </body>
  `
}
