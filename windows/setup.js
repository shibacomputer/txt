const html = require('yo-yo')
const css = require('sheetify')
const path = require('path')
const fs = require('fs')

const icons = require('../utils/icons')
const button = require('../bits/button')

module.exports = setupWindow

const base = css`
  :host {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 2rem;
  }

  .header {
    text-align: center;
    color: var(--w);
    line-height: 1.5;
  }

  .container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 0.5rem;
    line-height: 1.5;
  }

  label {
    font-weight: normal;
  }

  button {
    font-family: 'NovelMono', monospace;
    font-size: 14px;
    padding: 0.85rem 1rem 0.75rem 1rem;
  }

  input {
    background: none;
    font-family: 'NovelMono', monospace;
    padding: 0.85rem 1rem 0.75rem 1rem;
    flex: 1;
  }

  .small {
    margin-top: 0.5rem;
    font-size: 13px;
    font-weight: normal;
    line-height: 1.5;
  }
`
const location = css`
  :host {
    font-size: 14px;
    font-family: 'NovelMono', monospace;
    width: 100%;
  }

  .location-input {
    border: 1px solid var(--c);
    color: var(--c);
  }

  button {
    color: var(--k);
    background-color: var(--c);
  }
`

const passphrase = css`
  :host {
    font-size: 14px;
    font-family: 'NovelMono', monospace;
    width: 100%;
  }

  .passphrase-input {
    border: 1px solid var(--b);
    color: var(--b);
  }
`

const ok = css`
  :host {
    font-size: 14px;
    font-family: 'NovelMono', monospace;
    width: 100%;
  }
  .ok-button {
    width: 100%;
    font-weight: bold;
  }
`

function setupWindow(state, prev, send) {
  document.title = 'Welcome to Txt'

  return html`
    <body class="b-myc ${base}">
      <header class="header">
        <h1>Txt</h1>
        <p>Simple, private journalling</p>
      </header>
      <section class="c ${location}">
        <label for="location">Location</label>
        <div class="container">
          <input type="text" class="location-input"/>
          <button>Change</button>
        </div>
        <p class="small w">Txt uses a folder on your computer to save and encrypt your work.</p>
      </section>
      <section class="b ${passphrase}">
        <label for="passphrase">Passphrase</label>
        <div class="container">
          <input type="text" name="passphrase" class="passphrase-input"/>
        </div>
        <p class="small w">Txt uses PGP to encrypt your notebook. Choose a strong phrase to best protect your entires.</p>
      </section>
      <footer class="${ok}">
        <button name="finish" class="k bg-m ok-button">Create Notebook</button>
      </footer>
    </body>
  `
}
