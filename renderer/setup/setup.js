const html = require('choo/html')
const style = require('./style')

const polyglot = require('../_utils/i18n/i18n')
const i18n = polyglot.init(window.navigator.language)

module.exports = setupApplication
/**
 * The Setup Window handles initialisation of a
 * new app install and related functionality setup.
 */
function setupApplication(state, emit) {

  return html`
    <body class="${ state.uifocus === 'modal' || state.uifocus === 'blur' ? 'b-b' : 'b-myc' }">
      <main class="${style.main} ${ state.uifocus === 'modal' || state.uifocus === 'blur' ? style.unfocused : null}">
        ${state.ui.block ? blocker() : null }
        <header class=${style.header}>
          <div class=${style.logo}>
            <svg width="44" height="48" xmlns="http://www.w3.org/2000/svg">
              <defs>
              <linearGradient x1="13.416%" y1="9.772%" x2="86.596%" y2="100%" id="a">
                <stop stop-color="#FB4FFF" offset="0%"/>
                <stop stop-color="#FFD710" offset="54.582%"/>
                <stop stop-color="#27FF98" offset="100%"/>
              </linearGradient>
            </defs>
            <path d="M616.015 186.602V219h-32.353V172.442H578V171h12.941v1.443h-5.662v44.937h29.118v-44.938h-5.661V171H622v1.443h-5.985v14.159zm-27.5 13.448c0-.443.359-.802.802-.802h20.234c.443 0 .802.36.802.802v.016c0 .443-.359.802-.802.802h-20.234a.802.802 0 0 1-.802-.802v-.016zm0 5.941c0-.443.359-.802.802-.802h16.999c.443 0 .802.36.802.802v.016c0 .443-.36.802-.802.802h-17a.802.802 0 0 1-.801-.802v-.016zm0 5.942c0-.443.359-.803.802-.803h19.425c.443 0 .802.36.802.803v.015c0 .443-.359.802-.802.802h-19.425a.802.802 0 0 1-.802-.802v-.015zm0-17.82c0-.442.359-.802.802-.802h16.999c.443 0 .802.36.802.803v.015c0 .443-.36.802-.802.802h-17a.802.802 0 0 1-.801-.802v-.015zM606.757 171l-6.063 8.033 6.356 8.41h-1.735l-5.513-7.33-5.547 7.33h-1.689l6.345-8.41-6.04-8.033h1.736l5.219 6.94 5.23-6.94h1.701z" transform="translate(-578 -171)" fill="url(#a)" fill-rule="evenodd"/>
          </svg>
          </div>
          <h1>${ i18n.t('setup.ui.title', {app_name: 'Txt'}) }</h1>
        </header>
        ${ view() }
        ${ actions() }
      </main>
    </body>
  `

  function view () {
    return html`
      <div class=${ style.core}>
        <div class="${ style.view } ${ state.progress > 2 ? style.transitionToLeft : style.transitionEnd}">
          ${ state.progress >= 1? setupWorkPath() : null }
          ${ state.progress >= 2? setupPassphrase() : null }
        </div>
        <div class="${ style.view } ${ state.progress > 2 ? style.transitionEnd : style.hiddenFromRight}">
          ${ state.progress >= 2? setupUser() : null }
          ${ state.progress >= 2? setupEmail() : null }
        </div>
      </div>
    `
  }

  function setupWorkPath() {
    return html`
      <section class="b ${style.option}">
        <label for="location">${ i18n.t('setup.ui.librarySelection.label') }</label>
        <div class=${style.field}>
          <input ${state.ui.block ? 'disabled' : '' } class="${style.locationOSInput}" onchange=${updateUri} id="location" type="file" webkitdirectory />
          <div class=${style.location} onclick=${askForUri}>
            ${state.uri ? state.uri : i18n.t('setup.ui.librarySelection.placeholder') }
          </div>
          <button ${state.ui.block ? 'disabled' : '' } class=${style.locationButton} onclick=${askForUri}>
            <svg width="16" height="12" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2H7C5.05.667 4.05 0 4 0H0v12h16V2zM3.5 1l3 2H15v4H1V.998L3.5 1z" fill="currentColor" fill-rule="nonzero"/>
            </svg>
          </button>
        </div>
        <div class="w ${style.tip}">
          <label class=${style.tip}>${ i18n.t('setup.ui.librarySelection.tip', {app_name: 'Txt'}) }</label>
        </div>
      </section>
    `

    function askForUri() {
      var locationOSInput = document.getElementById('location')
      locationOSInput.click()
    }

    function updateUri(e) {
      emit('state:uri:update', e.target.files[0])
    }
  }

  function setupPassphrase() {
    const inputLabel = state.ui.newKey? i18n.t('setup.ui.passphraseInput.label.newPassphrase') : i18n.t('setup.ui.passphraseInput.label.existingPassphrase')
    const tip = state.ui.newKey? i18n.t('setup.ui.passphraseInput.tip.newPassphrase') : i18n.t('setup.ui.passphraseInput.tip.existingPassphrase')
    return html`
    <section class="c ${style.option}">
      <label for="passphrase">${inputLabel}</label>
      <div class=${style.field}>
        <input id="passphrase" ${state.ui.block ? 'disabled' : '' } class="c" onkeyup=${updatePassphrase} value=${state.phrase}/>
      </div>
      <div class="w ${style.tip}">
        <label class=${style.tip}>${tip}</label>
      </div>
    </section>
    `
    function updatePassphrase(e) {
      emit('state:passphrase:update', e.target.value)
    }
  }

  function setupUser() {
    return html`
      <section class="b ${style.option}">
        <label for="passphrase">${i18n.t('setup.ui.nameInput.label')}</label>
        <div class=${style.field}>
          <input id="username" ${state.ui.progress < 3 ? 'disabled' : ''} class="b" placeholder=${i18n.t('setup.ui.nameInput.placeholder')} onkeyup=${updateUser} value=${state.user.name}/>
        </div>
        <div class="w ${style.tip}">
          <label class=${style.tip}>${i18n.t('setup.ui.nameInput.tip')}</label>
        </div>
      </section>
    `

    function updateUser(e) {
      emit('state:user:update', e.target.value)
    }
  }

  function setupEmail() {
    return html`
    <section class="b ${style.option}">
      <label for="passphrase">${i18n.t('setup.ui.emailInput.label')}</label>
      <div class=${style.field}>
        <input id="email" ${state.ui.progress < 3 ? 'disabled' : ''} class="b" placeholder=${i18n.t('setup.ui.emailInput.placeholder')} onkeyup=${updateEmail} value=${state.user.email}/>
      </div>
      <div class="w ${style.tip}">
        <label class=${style.tip}>${i18n.t('setup.ui.emailInput.tip')}</label>
      </div>
    </section>    
    `

    function updateEmail(e) {
      emit('state:email:update', e.target.value)
    }
  }

  function actions() {
    function completion() {
      return html`
        <nav>
          <button name="prev" class="bg-g b" onclick=${previousSetup}>${ i18n.t('setup.buttons.prevSetup') }</button>
          <button name="save" class="bg-m f" ${(state.ui.block) ? 'disabled' : ''} onclick=${completeSetup}>${ i18n.t('setup.buttons.completeSetup') }</button>
        </nav>
      `
    }

    function nextSteps() {
      return html`
        <nav>
          <button name="save" class="bg-m f" ${(state.ui.valid || state.ui.block) ? 'disabled' : ''} onclick=${state.ui.newKey? nextSetup : completeSetup}>${ state.ui.newKey? i18n.t('setup.buttons.nextSetup') : i18n.t('setup.buttons.completeSetup') }</button>
        </nav>
      `
    }
    return html`
      <footer class=${style.footer}>
        ${ state.progress < 3 ? nextSteps() : completion() }
      </footer>
    `

    function nextSetup() {
      emit('state:ui:update', 1)
    }

    function previousSetup() {
      emit('state:ui:update', -1)
    }

    function completeSetup() {
      emit('state:setup:validate')
    }
  }

  function blocker () {
    return html`
      <div class=${style.blocker}>
        <div class=${style.spinner}> </div>
      </div>
    `
  }

}
