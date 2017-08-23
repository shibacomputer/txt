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
          ${ typeof items === "object" ? items.map( (item) => {
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
    return html`
      <nav class="center group">
        ${ elements.center }
      </nav>
    `
  }

  return html`
    <header class="${style}">
      ${
        init('left')
      }
      ${
        center()
      }
      ${
        init('right')
      }
    </header>
  `
}
