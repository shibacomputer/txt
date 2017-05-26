const remote = window.require('electron').remote
const { shell } = remote.require('electron')

const html = require('choo/html')
const css = require('sheetify')

// const button = require('./button')
const file = require('../utils/files')
const toolbar = require('./toolbar')

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
    if(state.filesystem.children) {
      return fileSidebar(state.filesystem)
    } else {
      return emptySidebar()
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

    return html`
      <nav class="${base}">
        ${ toolbar () }
        <div class="${browser}">
        ${ folder(filesystem.children) }
        </div>
        ${ toolbar () }
      </nav>
    `
  }

  function folder(items) {
    const fblock = css`
      :host {
        padding-left: 12px;
      }
    `
    const fitem = css`
      :host {
        text-align: left;
        font-family: 'NovelMono', monospace;
        font-size: 12px;
        width: 100%;
        padding: 0.35rem 0rem 0.35rem 0rem;
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
        margin-right: 0.5rem;
      }
    `
    console.log(items)
    return html`
      <ul class="${fblock}">
        ${
          items.map ( (item) => {
            if(item.type === 'directory') {
              return html`
                <li>
                  <button data-uri="${item.path}" data-status="${item.open}" data-type="dir" class="${fitem}" onclick=${ open }">
                    <div data-uri="${item.path}" data-status="${item.open}" data-type="dir" class="${flabel}">
                      <svg data-uri="${item.path}" data-status="${item.open}" data-type="dir" viewBox="0 0 24 24" class="${icon}">
                        <use xlink:href="#txt-folder" />
                      </svg>
                      <span data-uri="${item.path}" data-status="${item.open}" data-type="dir" class="${label}">
                        ${item.name}
                      </span>
                    </div>
                  </button>
                  ${ item.open ? folder(item.children) : null }
                </li>
              `
            }
            if(item.type === 'file') {
              return html`
                <li>
                  <button data-uri="${item.path}" data-type="file" class="${fitem}" onclick=${ open }>
                    <div data-uri="${item.path}" data-type="file" class="${flabel}">
                      <svg data-uri="${item.path}" data-type="file" viewBox="0 0 24 24" class="${icon}">
                        <use xlink:href="#txt-file" />
                      </svg>
                      <span data-uri="${item.path}" data-type="dir" class="${label}">
                        ${item.name}
                      </span>
                    </div>
                  </button>
                </li>
              `
            }
          })
        }
      </ul>
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
    var status = e.target.getAttribute('data-status')
    var target = e.target.getAttribute('data-uri')

    if (type === 'dir') emit('filesystem:open', target)
    if (type === 'file') emit('note:open', target)
  }
}
