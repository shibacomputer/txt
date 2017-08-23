const html = require('choo/html')
const style = require('./style')

module.exports = view

// view
// Elements:
//    - Toolbar: The toolbar. Is wrapped in the top of the view
//    - Footer: The footer of a sidebar view.
//    - View: Pass the view you'd like.
function view (state, emit, role, elements) {

  return html`
    <main data-role=${role} class=${style}>
      ${ elements.toolbar }
      <div>
        ${ elements.view }
      </div>
      ${ elements.footer }
    </main>
  `
}
