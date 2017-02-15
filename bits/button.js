'use strict'

const html = require('yo-yo')
const css = require('yo-css')


module.exports = (props, click) => {
  if (typeof click === 'function') props.click = click

  const style = {
    fill: 'currentColor',
    width: '1.5rem',
    height: '1.5rem',
  }

  return html`
    <button onclick=${props.click} class=${props.classes} name=${props.name}>
      <svg viewBox="0 0 24 24" style=${css(style)}>
        <use xlink:href="#txt-${props.icon}" />
      </svg>
    </button>
  `
}
