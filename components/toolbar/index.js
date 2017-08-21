const html = require('choo/html')
const style = require('./style')

module.exports = toolbar

function toolbar (elements, emit) {
  elements = typeof elements === "object" ? elements : {}
  function init (pos) {

    var items = pos === 'left'? elements.left : elements.right
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
          ${ elements.center }
        </nav>
      `
    }
  }

  return html`
    <header class="${style}">
      ${
        typeof elements.left === "object" ? init('left') : null
      }
      ${
        typeof elements.center === "object" ? center() : null
      }
      ${
        typeof elements.right === "object" ? init('right') : null
      }
    </header>
  `
}
