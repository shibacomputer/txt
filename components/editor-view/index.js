const html = require('choo/html')
const style = require('./style')

module.exports = editorView

// EditorView
// Elements:
//    - Toolbar: The toolbar. Is wrapped in the top of the view
//    - Footer: The footer of a sidebar view.
//    - View: Pass the view you'd like as the main part of the sidebar.
function editorView (state, emit, role, elements) {

  return html`
    <main data-role=${role} class=${style}>
      <header>
        ${ elements.toolbar }
      </header>
      <div>
        ${ elements.view }
      </div>
      <footer>
        ${ elements.footer }
      </footer>
    </main>
  `
}
