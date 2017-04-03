const html = require('choo/html')
const css = require('sheetify')
const sidebar = require ('../components/sidebar')
const icons = require('../utils/icons')
const Editor = require('../components/editor')
const spinner = require('../components/spinner')
const toolbar = require('../components/toolbar')

var editor = Editor()

module.exports = mainWindow

function mainWindow(state, emit) {

  emit('log:debug', 'Rendering main view')

  document.title = 'Txt'

  const base = css`
    :host {
      display: flex;
      flex-direction: row;
    }
  `
  return html`
    <body class="b-myc ${base}">
      ${ icons() }
      ${ sidebar(state, emit) }
      ${ main(state, emit) }
    </body>
  `

  function main (state, emit) {
    if (state.note.status.loading) { return html`${ spinner() }` }
    else { return html`${ editView(state, emit) }`}
  }

  function editView (state, emit) {
    const base = css`
      :host {
        width: auto;
        height: 100vh;
        overflow: hidden;
        color: white;
        display: flex;
        flex: auto;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
      }
    `
    const editview = css`
      :host {
        -webkit-overflow-scrolling: touch;
        overflow: scroll;
        width: 100%;
        height: calc(100vh - 5rem);
      }
    `

    return html`
      <main class="${base}">
        ${ toolbar ()}
        <div class="${editview}">
          ${ editor.render(state.note.body) }
        </div>
        ${ toolbar ()}
      </main>
    `
  }
}
/*
const base = css`
  :host {
    display: flex;
    flex-direction: row;
    color: var(--w);
    background-color: var(--k);
  }
`

const editorWindow = css`
  :host {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
`

const editContainer = css`
  :host {
    height: calc(100vh - 2px - 2.5rem);
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
`

function mainWindow(state, emit) {

  const sidebar = FileExplorer(state, prev, send)

  document.title = 'Txt'

  const editingTools = html`
    <div class="tools">
      ${button({
        name: 'new',
        classes: 'c'
      })}
    </div>
  `

  return html`
    <body class="b-myc ${base}">
      ${icons()}
      ${sidebar}
      <main class="${editorWindow}">
        <header class="toolbar">
          <nav class="left">
          </nav>
          <nav class="mid">
          </nav>
          <nav class="right">
            ${button({
              icon: 'new',
              classes: 'c',
              click: function() { console.log('hi')}
            })}
          </nav>
        </header>
        <div class="${editContainer}">
          ${editor()}
        </div>
      </main>
    </body>
  `
}
*/
