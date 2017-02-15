'use strict'

const html = require('yo-yo')
const css = require('sheetify')
const explorer = require('fs-explorer')
const button = require('./button')

const base = css`
  :host {
    width: 25vw;
    min-width: 12rem;
    max-width: 20rem;
    height: calc(100vh - 2px);
    border-radius: 5px;
    border-right: 1px solid rgba(255, 255, 255, 0.05);
    background-color: #27282B;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .content {
      width: 100%;
      display: flex;
      flex-direction: column;

      height: calc(100vh - 2px - 2.5rem - 2.5rem);
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      background-color: #27282B;
      border-radius: 5px;
    }
  }
`

const emptyBase = css`
  :host {
    width: 100%;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 2px - 2.5rem - 2.5rem);
    text-align: center;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    color: var(--c);
  }
  .msg, .guide {
    padding: 0 1rem;
    line-height: 1.5;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .guide {
    font-weight: normal;
    margin-bottom: 0;
  }
`

function EmptyState() {
  return html `
    <nav class="${emptyBase}">
      <object data="/assets/illu/illu-writing.svg" style="width: 64px; height: 64px;" type="image/svg+xml" class="block c"></object>
      <div class="msg">
        <p>Welcome to Txt.</p>
        <p>Each file in your Txt notebook is encrypted and stored in ~/Txt.</p>
      </div>
      <button class="bg-c k button">
        New Entry +
      </button>
      <div class="guide b">
        Welcome Guide
      </div>
    </nav>
  `
}
module.exports = (props) => {
  return html`
    <aside class="${base}">
      <header class="toolbar">
        <nav style="width: 33%; text-align: left" class="left">
        </nav>
        <nav style="width: 33%; text-align: center" class="mid c">
          Txt
        </nav>
        <nav style="width: 33%; margin-top: 2px; text-align: right" class="right">
          ${button({
            name: 'NewFolder',
            icon: 'new-folder',
            classes: 'c'
          })}
        </nav>
      </header>

      <nav class="content">
        ${EmptyState()}
      </nav>

      <footer class="footer">
        <nav class="left">
          ${button({
            name: 'Lock',
            icon: 'lock',
            classes: 'm'
          })}
        </nav>
        <nav class="right">
          ${button({
            name: 'Settings',
            icon: 'settings',
            classes: 'm'
          })}
        </nav>
      </footer>
    </aside>
  `
}
