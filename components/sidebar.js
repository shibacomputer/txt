const remote = window.require('electron').remote
const { shell } = remote.require('electron')

const html = require('choo/html')
const css = require('sheetify')
const Microframe = require('microframe')

// const button = require('./button')
const file = require('../utils/files')
const toolbar = require('./toolbar')

var microframe = Microframe()

module.exports = sidebar

function sidebar (state, emit) {
  emit('log:debug', 'Setting up a sidebar')

  // First we set up the base sidebar.
  // This allows for a simple decision tree about which sidebar to show.
  // Use emit 'render' in stores/filesystem.js to re-render the sidebar.

  const base = css`
    :host {
      height: 100vh;
      width: 25vw;
      min-width: 12rem;
      max-width: 20rem;
      border-radius: 5px;
      border-right: 1px solid rgba(255, 255, 255, 0.05);
      background-color: --var(k);
      display: flex;
      flex-direction: column;
    }
  `

  return html`
    <aside class="${base}">
      ${ aSidebar() }
    </aside>
  `

  // This is where the decision is made to display a sidebar or empty state
  function aSidebar () {
    if ((!state.filesystem.dirs[0]) || ((!state.filesystem.dirs[0].subdirs) && (!state.filesystem.dirs[0].files))) {
      return emptySidebar()
    } else {
      return fileSidebar(state.filesystem.dirs)
    }
  }

  // Actual sidebar
  function fileSidebar (filesystem) {

    const base = css`
      :host {
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    `

    const browser = css`
      :host {
        -webkit-overflow-scrolling: touch;
        overflow: scroll;
        flex: 1;
      }
    `

    const fitem = css`
      :host {
        text-align: left;
        font-family: 'NovelMono', monospace;
        font-size: 12px;
        width: 100%;
        padding: 0.35rem 1rem 0.35rem 1rem;
        background: none;
        border: none;
        color: var(--c);
      }
      :host.current {
        outline: none;
        background-color: var(--b);
        color: var(--k);
      }
      :host:focus {
        outline: none;
      }
      :host.file:focus {
        outline: none;
        background-color: var(--c);
        color: var(--k);
      }
    `

    const label = css`
      :host {
        margin-top: 3px;
      }
    `
    const flabel = css`
      :host {
        display: flex;
        flex-direction: row;
      }
    `

    const icon = css`
      :host {
        width: 1rem;
        height: 1rem;
        margin-right: 0.25rem;
      }
    `

    return html`
      <nav class="${base}">
        ${ toolbar () }
        <div class="${browser}">
        ${
          filesystem.map( (item) => {
            return html`
            <ul style="width: 100%">
              ${ item.subdirs.map ( function(f) {
                return html`
                  <li>
                    <button data-uri="${f.uri}" data-type="dir" class="${fitem}" onclick=${ open }>
                      <div data-uri="${f.uri}" data-type="dir" class="${flabel}">
                        <svg data-uri="${f.uri}" data-type="dir" viewBox="0 0 24 24" class="${icon}">
                          <use xlink:href="#txt-folder" />
                        </svg>
                        <span data-uri="${f.uri}" data-type="dir" class="${label}">
                          ${f.name}
                        </span>
                      </div>
                    </button>
                  </li>
                `
              })}
              ${ item.files.map ( function(f) {
                return html`
                  <li>
                    <button data-uri="${f.uri}" data-type="file" class="${fitem} file" onclick=${ open }>
                      <div data-uri="${f.uri}" data-type="file" class="${flabel}">
                        <svg data-uri="${f.uri}" data-type="file" viewBox="0 0 24 24" class="${icon}">
                          <use xlink:href="#txt-file" />
                        </svg>
                        <span data-uri="${f.uri}" data-type="file" class="${label}">
                          ${f.name}
                        </span>
                      </div>
                    </button>
                  </li>
                `
              })}

            </ul>
            `
          })
        }
        </div>
        ${ toolbar () }
      </nav>
    `
  }

  // No filesystem, no sidebar
  function emptySidebar () {

    const base = css`
      :host {
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
      }
    `

    const message = css`
      :host {
        font-size: 13px;
        text-align: center;
        line-height: 1.5;
        padding: 1rem;
      }
    `
    const button = css`
      :host {
        padding: 1rem;
        font-size: 13px;
        font-family: "NovelMono", monospace;
        border: none;
        padding: 0.85rem 1rem 0.65rem 1rem;
      }
      outline: var(--f);
      :host:active {
        background-color: var(--f);
      }
    `
    const textButton = css`
      :host {
        padding: 0.25rem;
        font-size: 13px;
        font-family: "NovelMono", monospace;

        background: none;
        border: none;
        text-decoration: underline;

        margin-top: 1rem;
        outline: white;
      }
    `

    return html `
      <nav class="${base}">
        <svg style="width: 64px; height: 64px;" viewBox="0 0 64 64" type="image/svg+xml" class="c">
          <use xlink:href="/assets/illu/illu-writing.svg" />
        </svg>
        <div class="c ${message}">
          <p>Welcome to Txt.</p>
          <p>Each file in your Txt notebook is encrypted and stored in ~/Txt.</p>
        </div>
        <button class="${button} bg-c k">
          New Entry +
        </button>
        <div class="b">
          <button class="${textButton} b f-hover" onclick=${ function() { shell.openExternal('https://txtapp.io') } }>
            Welcome Guide
          </button>
        </div>
      </nav>
    `
  }

  function open (e) {
    var type = e.target.getAttribute('data-type')
    var target = e.target.getAttribute('data-uri')

    if (type === 'dir') { console.log('Clicked a dir')}
    if (type === 'file') {
      emit('note:load', target)
    }
  }
}

/*
const base = css`
  :host {
    width: 25vw;
    min-width: 12rem;
    max-width: 20rem;
    height: calc(100vh - 2px);
    border-radius: 5px;
    border-right: 1px solid rgba(255, 255, 255, 0.05);
    background-color: --var(k);
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .content {
      width: 100%;
      display: flex;
      flex-direction: column;

      height: calc(100vh - 2px - 2.5rem - 2.5rem);
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      background-color: #27282B;
      border-radius: 5px;
    }
  }
`

const emptyBase = css`
  :host {
    width: 100%;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 2px - 2.5rem - 2.5rem);
    text-align: center;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    color: var(--c);
  }
  .text-button {
    font-family: 'NovelMono', monospace;
    font-weight: normal;
    font-size: 13px;
  }

  .msg, .guide {
    padding: 0 1rem;
    line-height: 1.5;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .guide {
    font-weight: normal;
    margin-bottom: 0;
  }
`

module.exports = setupSidebar

function setupSidebar(state, prev, send) {

  var filesystem    = state.filesystem.dirs,
      hasFilesystem = !state.filesystem.listingDirs && state.filesystem.listedDirs,
      authenticated = state.global.authenticated
/*
  onload(div, load, unload)

  function load() {

  }

  function unload() {

  }

  return html`

    <aside class="${base}">
      <header class="toolbar">
        <nav style="width: 33%; text-align: left" class="left">
        </nav>
        <nav style="width: 33%; text-align: center" class="mid c">
          Txt
        </nav>
        <nav style="width: 33%; margin-top: 2px; text-align: right" class="right">
          ${button({
            name: 'NewFolder',
            icon: 'new-folder',
            classes: 'c'
          })}
        </nav>
      </header>

      <nav class="content">
        ${createSidebar()}
      </nav>

      <footer class="footer">
        <nav class="left">
          ${button({
            name: 'Lock',
            icon: 'lock',
            classes: 'm'
          })}
        </nav>
        <nav class="right">
          ${button({
            name: 'Settings',
            icon: 'settings',
            classes: 'm'
          })}
        </nav>
      </footer>
    </aside>
  `

  function createSidebar() {
    const fsBase = css`
      :host {
        width: 100%;
        display: flex;
        flex-direction: column;
        height: calc(100vh - 2px - 2.5rem - 2.5rem);
        align-items: flex-start;
        justify-content: flex-start;
      }
      .fsItemContent {
        display: flex;
        flex-direction: row;

      }
      .icon {
        width: 1rem;
        height: 1rem;
        margin-right: 0.5rem;
      }
      .label {
        margin-top: 3px;
      }
      .fsItem {
        width: 100%;
        text-align: left;
        font-family: 'NovelMono', monospace;
        font-size: 13px;
        padding: 0.35rem 1rem 0.35rem 1rem;
      }
      .fsItem:hover {
        background-color: var(--c);
        color: var(--k);
      }
      .fsItem:active,
      .fsItem:focus {
        outline: none;
        background-color: var(--b);
        color: var(--k);
      }
    `

    if (authenticated) {
      if (hasFilesystem) {
        var fsItems
        return html`
          <nav class="${fsBase}">
            ${filesystem.map( function (item) {
              return html`
                <ul style="width: 100%">
                  ${item.subdirs.map( function (f) {
                    return html`
                      <li>
                        <button class="fsItem c dir">
                          <div class="fsItemContent">
                            <svg viewBox="0 0 24 24" class="icon">
                              <use xlink:href="#txt-folder" />
                            </svg>
                            <span class="label">
                              ${f.name}
                            </span>
                          </div>
                        </button>
                      </li>
                    `
                  })}
                  ${item.files.map( function (f) {
                    return html`
                      <li>
                        <button data-id="${f.uri}" class="fsItem c file" onclick=${ openFile }>
                          <div data-id="${f.uri}" class="fsItemContent">
                            <svg data-id="${f.uri}" viewBox="0 0 24 24" class="icon">
                              <use xlink:href="#txt-file" />
                            </svg>
                            <span data-id="${f.uri}" class="label">
                              ${f.name}
                            </span>
                          </div>
                        </button>
                      </li>
                    `
                  })}
                </ul>
              `
            })}
          </nav>
        `
      }
    } else return nothing()
  }


  function nothing() {
    return html `
      <nav class="${emptyBase}">
        <object data="/assets/illu/illu-writing.svg" style="width: 64px; height: 64px;" type="image/svg+xml" class="block c"></object>
        <div class="msg">
          <p>Welcome to Txt.</p>
          <p>Each file in your Txt notebook is encrypted and stored in ~/Txt.</p>
        </div>
        <button class="bg-c k button">
          New Entry +
        </button>
        <div class="guide b">
          <button class="b f-hover text-button" onclick=${ function() { shell.openExternal("https://txtapp.io") } }>
            Welcome Guide
          </button>
        </div>
      </nav>
    `
  }

  function appFocused() {

  }

  function openFile(e) {
    var target = e.target.getAttribute('data-id')
    send('note:readNote', target)
  }

}
*/
