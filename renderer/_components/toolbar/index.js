const html = require('choo/html')
const style = require('./style')

module.exports = toolbar

function toolbar (elements, emit) {
  elements = typeof elements === "object" ? elements : {}
  function init (pos) {

    var items = pos === 'left'? elements.left : elements.right

    return html`
      <div class="${pos === 'left'? style.left : style.right} ${style.group}">
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
      <div class="${style.center} ${style.group}">
        ${ elements.center }
      </div>
    `
  }

  return html`
    <div class="${style.toolbar}">
      ${
        init('left')
      }
      ${
        center()
      }
      ${
        init('right')
      }
    </div>
  `
}
