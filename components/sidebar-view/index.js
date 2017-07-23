const html = require('choo/html')
const style = require('./style')

module.exports = sidebarView

// Sidebar view
// Elements:
//    - Toolbar: The toolbar. Is wrapped in the top of the view
//    - Footer: The footer of a sidebar view.
//    - View: Pass the view you'd like as the main part of the sidebar.
function sidebarView (state, emit, role, elements) {

  return html`
    <aside data-role=${role} class=${style}>
      <header>
        ${ elements.toolbar }
      </header>
      <div>
        ${ elements.view }
      </div>
      <footer>
        ${ elements.footer }
      </footer>
    </aside>
  `
}
