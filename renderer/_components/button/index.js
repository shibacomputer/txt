const html = require('choo/html')
const style = require('./style')

module.exports = (props, click) => {

  if (typeof click === 'function') props.click = click

  return html`
    <button onclick=${props.click} class="${style.button} ${props.classes}" name=${props.name}>
      <svg>
        <use xlink:href="#txt-${props.icon}">
      </svg>
    </button>
  `
}
