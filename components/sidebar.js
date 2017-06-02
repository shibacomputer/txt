const remote = window.require('electron').remote
const { shell } = remote.require('electron')

const html = require('choo/html')
const css = require('sheetify')

// const button = require('./button')
const file = require('../utils/files')
const toolbar = require('./toolbar')
const Mousetrap = require('mousetrap')

module.exports = sidebar

var selected = null

function sidebar (state, emit) {
  emit('log:debug', 'Setting up a sidebar')

  // First we set up the base sidebar.
  // This allows for a simple decision tree about which sidebar to show.
  // Use emit 'render' in stores/filesystem.js to re-render the sidebar.

  Mousetrap.bind('backspace', function() {
    emit('filesystem:destroy')
  })
  
  const base = css`
    :host {
      border-radius: 5px;
      border-right: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      flex-direction: column;
      height: 100vh;
      max-width: 20rem;
      min-width: 12rem;
      width: 25vw;
    }
  `

  // Load the dir items once.
  const dirItem = css`
    :host {
      position: relative;
    }
    :host a + ul {
      padding-left: 1rem;
    }
    :host, :host ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    :host a {
      color: var(--c);
      display: flex;
      flex-direction: row;
      font-family: 'FiraCode', monospace;
      font-style: normal;
      font-size: 11px;
      height: 1.75rem;
      padding-left: 1rem;
      z-index: 5;
    }
    :host a:before {
      content: '';
      height: 1.75rem;
      left: 0;
      max-width: 20rem;
      min-width: 12rem;
      position: fixed;
      width: 25vw;
      z-index: 1;
    }
    :host a:hover:before {
      background-color: rgba(0,0,0,0.15);
    }
    :host a.highlight:before {
      background-color: rgba(0,0,0,0.25)
    }
    :host a div {
      align-items: center;
      display: flex;
      flex-direction: row;
      padding-right: 0.5rem;
      position: relative;
      z-index: 5;
      white-space: nowrap;
    }
    :host svg {
      height: 1rem;
      margin-right: 0.45rem;
      margin-top: -4px;
      width: 1rem;
    }
  `

  return html`
    <aside class="${base}">
      ${ aSidebar() }
    </aside>
  `

  // This is where the decision is made to display a sidebar or empty state
  function aSidebar () {
    if(state.filesystem) {
      if(state.filesystem.children.length > 0) {
        return fileSidebar(state.filesystem)
      } else {
        return emptySidebar() //Make sure we handle the init filesystem.
      }
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

    const view = css`
      :host {
        -webkit-app-region: no-drag;
        -webkit-overflow-scrolling: touch;
        flex: 1;
        overflow: scroll;
        overflow-x: scroll;

      }
    `

    return html`
      <nav class="${base}">
        ${ toolbar () }
        <div class="${view}">
        ${ tree(filesystem.children) }
        </div>
        ${ toolbar () }
      </nav>
    `
  }

  // : tree
  // Create a directory tree and iterate over its returned subdirectories.
  // @params: items (object):   A filesystem object
  function tree(items) {

    return html`
      <ul class="${dirItem}">
        ${
          items.map ( (item) => {
            item.selected = selected === item.path
            if(item.type === 'directory') {
              return html`
                <li>
                  <a data-uri="${item.path}" data-open="${item.open}" data-type="dir" class="${item.selected? 'highlight' : null}" onclick=${open}>
                    <div data-uri="${item.path}" data-type="dir">
                      <svg data-uri="${item.path}" data-type="dir" viewBox="0 0 24 24">
                        <use xlink:href="#txt-folder" />
                      </svg>
                      <span data-uri="${item.path}" data-type="dir">
                        ${item.name}
                      </span>
                    </div>
                  </a>
                  ${ item.open ? tree(item.children) : null }
                </li>
              `
            }
            if(item.type === 'file' && item.mime === 'text/gpg') {
              return html`
                <li>
                  <a data-uri="${item.path}" data-type="file" class="${item.selected? 'highlight' : null}" onclick=${open}>
                    <div data-uri="${item.path}" data-type="file">
                      <svg data-uri="${item.path}" data-type="file" viewBox="0 0 24 24">
                        <use xlink:href="#txt-file" />
                      </svg>
                      <span data-uri="${item.path}" data-type="dir">
                        ${item.name}
                      </span>
                    </div>
                  </a>
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
        font-family: "FiraCode", monospace;
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
        font-family: "FiraCode", monospace;

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

    selected = target

    if (type === 'dir') emit('filesystem:open', target)
    if (type === 'file') emit('note:open', target)
  }
}
