const { ipcRenderer } = require('electron')

const html = require('choo/html')
const style = require('./style')

module.exports = setupApplication

/**
 * The Setup Window handles initialisation of a
 * new app install and related functionality setup.
 */
function setupApplication(state, emit) {

  return html`
    <body class="b-myc">
      <main class=${style.main}>

        <header class=${style.header}>
          <div class="logo">
          </div>
        </header>
        ${ view() }
        ${ navigation() }
      </main>
    </body>
  `
  function view () {
    switch (state.progress) {
      case 2:
        return setupWorkPath()
      break
      case 1:
        return setupIdentity()
      break
      case 3:
        // return setupPhrase()
      break
    }
  }

  function setupWorkPath() {
    return html`
      <section class=${style.settings}>
        <div class=${style.folder}>
          <label for="folderinput" class="b">Save work to...</label>
          <div class=${style.locationBox}>
            <input class=${style.locationButton} onchange=${updateUri} id="locationButton" type="file" webkitdirectory />
            <div class=${style.location} onclick=${askForUri}>
              ${state.ui.uri ? state.ui.uri : 'Set a directory...'}
            </div><button onclick=${askForUri}>📁</button>
          </div>
          <label class=${style.tip}>By default, Txt stores your work on your local computer.</label>
        </div>
      </section>
    `


    function askForUri() {
      var locationButton = document.getElementById('locationButton')
      locationButton.click()
    }

    function updateUri(e) {
      emit('state:updateWorkPath', e.target.files[0])
    }
  }

  function setupIdentity() {
    return html`
      <section class=${style.settings}>
        <div class=${style.segmented}>
          <input type="radio"
                 name="keytype"
                 id="string"
                 ${!state.ui.newKey? 'checked' : ''}>
          <label for="string" data-value="string"
                 onclick=${switchType}>Create a Key</label>
          <input type="radio"
                 name="keytype"
                 id="key"
                 ${state.ui.newKey? 'checked' : ''}>
          <label for="key" data-value="key"
                 onclick=${switchType}>Import a PGP Key</label>
        </div>
        <div class=${style.keytab} style=${!state.ui.newKey? 'display: none' : ''}>
          <label for="keyinput" class="b">Select your key</label>
          ${keyDropdown()}
          <label class=${style.tip}>Use a key to automatically encrypt and decrypt your work.</label>
        </div>
        <div class=${style.stringtab} style=${state.ui.newKey? 'display: none' : ''}>
          <label for="nameInput" class="b">Name</label>
          <input type="text"
                 name="nameInput"
                 id="nameInput"
                 class="b b-input"
                 onchange=${updateName}
                 value=${state.author.name? state.author.name : 'Anonymous'}/>
          <label for="emailInput" class="b">Email</label>
          <input type="text"
                name="emailInput"
                id="emailInput"
                class="b b-input"
                onchange=${updateEmail}
                value=${state.author.email? state.author.email : ''}/>
          <label class=${style.tip}>Your profile is optional and is used for your encryption key and documents.</label>
        </div>
      </section>
    `
    function switchType(e) {
      emit('state:switchType', e.target.dataset.value)
    }

    function updateName(e) {

    }

    function updateEmail(e) {

    }

    function keyDropdown() {
      return html`
        <select name="keyinput" id="keyinput" class="b b-input" onchange=${respondToKeyDropdown}/>
          <option ${ !state.ui.selectedKey ? 'selected' : '' } disabled></option>
          ${ state.ui.availableKeys.length !== 0 ? html`
            ${
              state.ui.availableKeys.map( (key) => {
                return html`
                  <option value=${key.id} ${ key.id.localeCompare(state.ui.selectedKey.id) === 0 ? 'selected' : '' }> ${key.name} (${key.id}) </option>
                `
              })
            }
            ` : null
          }
          ${ state.ui.availableKeys.length !== 0 ? html `
            <option disabled>────────────────────────────</option>` : null
          }
          <option ${ state.key ? '' : '' } value="import">Import from file...</option>
        </select>
      `
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
  }

  function navigation() {
    return html`
      <footer class=${style.footer}>
        ${ state.progress > 1?
            html`
              ${ previousButton() }
              ${ nextButton() }
            ` :
            html`
              ${ nextButton() }
            `
         }
      </footer>
    `
    function nextButton() {
      return html`
        <button name="save" class="bg-m f button-m" ${state.valid ? '' : 'disabled'}>Next</button>
      `
    }

    function prevButton() {
      return html`

      `
    }

  }


}
