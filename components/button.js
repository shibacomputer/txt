const html = require('choo/html')
const css = require('sheetify')

module.exports = (props, click) => {

  const base = css`
    :host {
      border: none;
      background: none;
      color: var(--c);
      padding: 0;
    }
    :host svg {
      fill: currentColor;
      height: 1.5rem;
      width: 1.5rem;
    }
    :host:active {
      color: var(--w);
    }
  `

  if (typeof click === 'function') props.click = click

  return html`
    <button onclick=${props.click} class=${base} name=${props.name}>
      <svg viewBox="0 0 24 24">
        <use xlink:href="#txt-${props.icon}" />
      </svg>
    </button>
  `
}
