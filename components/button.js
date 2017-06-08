const html = require('choo/html')
const css = require('sheetify')

module.exports = (props, click) => {

  const base = css`
    :host {
      background: var(--c);
      border: none;
      color: var(--c);
      height: 1.5rem;
      width: 1.5rem;
    }
  `

  if (typeof click === 'function') props.click = click

  return html`
    <button onclick=${props.click} class=${base} name=${props.name}>
      <svg viewBox="0 0 24 24" class=${base}>
        <use xlink:href="#txt-${props.icon}" />
      </svg>
    </button>
  `
}
