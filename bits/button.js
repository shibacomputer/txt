'use strict'

const html = require('yo-yo')
const css = require('yo-css')


module.exports = (props, click) => {
  if (typeof click === 'function') props.click = click

  const style = {
    fill: 'currentColor',
    width: '2rem',
    height: '2rem'
  }

  return html`
    <svg viewBox="0 0 24 24" style=${css(style)}>
      <use xlink:href="#txt-${props.icon}" />
    </svg>
  `
}
