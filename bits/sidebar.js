'use strict'

const html = require('yo-yo')
const css = require('sheetify')
const explorer = require('fs-explorer')
const button = require('./button')

const base = css`
  :host {
    width: 25vw;
    min-width: 214px;
    height: calc(100vh - 2px);
    border-radius: 5px;
    border-right: 1px solid rgba(255, 255, 255, 0.05);
    background-color: #27282B;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .content {
      width: 100%;
      height: calc(100vh - 2px - 2.5rem - 2.5rem);
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      background-color: #27282B;
      border-radius: 5px;
    }
  }
`
module.exports = (props) => {
  return html`
    <aside class="${base}">
      <header class="toolbar">
        <nav style="width: 33%; text-align: left" class="left">
        </nav>
        <nav style="width: 33%; text-align: center" class="mid c">
          Txt
        </nav>
        <nav style="width: 33%; text-align: right" class="right">
          ${button({
            icon: 'new-folder',
            classes: 'c'
          })}
        </nav>
      </header>

      <nav class="content">
      </nav>

      <footer class="footer">
        <nav class="left">
          ${button({
            icon: 'lock',
            classes: 'm'
          })}
        </nav>
        <nav class="right">
          ${button({
            icon: 'settings',
            classes: 'm'
          })}
        </nav>
      </footer>
    </aside>
  `
}
