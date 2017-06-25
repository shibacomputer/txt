const html = require('choo/html')
const style = require('./style')

module.exports = toolbar

function toolbar (left, right, title, emit) {

  function init (pos) {
    var items = pos === 'left'? left : right
    return html`
      <div class="${pos} group">
        <ul>
          ${ items? items.map( (item) => {
              return html`
                <li>
                  ${ item }
                </li>
              `
            }) : null
          }
        </ul>
      </div>
    `
  }

  function center() {
    if (title) {
      return html`
        <nav class="center group">
          ${ title }
        </nav>
      `
    }
  }

  return html`
    <header class="${style}">
      ${ init('left') }
      ${ center() }
      ${ init('right') }
    </header>
  `
}
