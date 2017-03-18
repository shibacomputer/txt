'use strict'

const html = require('choo/html')
const css = require('sheetify')
const onload = require('on-load')

const remote = window.require('electron').remote
const { shell } = remote.require('electron')
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
  .text-button {
    font-family: 'NovelMono', monospace;
    font-weight: normal;
    font-size: 13px;
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

module.exports = setupSidebar

function setupSidebar(state, prev, send) {

  var filesystem    = state.filesystem.dirs,
      hasFilesystem = !state.filesystem.listingDirs && state.filesystem.listedDirs,
      authenticated = state.global.authenticated
/*
  onload(div, load, unload)

  function load() {

  }

  function unload() {

  }
*/
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
        ${createSidebar()}
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

  function createSidebar() {
    const fsBase = css`
      :host {
        width: 100%;
        display: flex;
        flex-direction: column;
        height: calc(100vh - 2px - 2.5rem - 2.5rem);
        align-items: flex-start;
        justify-content: flex-start;
      }
      .fsItem {
        width: 100%;
        text-align: left;
        font-family: 'NovelMono', monospace;
        font-size: 13px;
        padding: 0.45rem 1rem 0.25rem 1rem;
      }
      .fsItem:hover {
        background-color: var(--c);
        color: var(--k);
      }
      .fsItem:active,
      .fsItem:focus {
        outline: none;
        background-color: var(--b);
        color: var(--k);
      }
    `

    if (authenticated) {
      if (hasFilesystem) {
        var fsItems

        fsItems = html`
          <nav class="${fsBase}">
            ${filesystem.map( function (item) {
              if (item) {
                return html`
                  <ul>
                    ${item.subdirs.map( function (f) {
                      console.log(f)
                      return html`
                        <li>
                          <button class="fsItem dir">
                            ${f.name}
                          </button>
                        </li>
                      `
                    })}
                    ${item.files.map( function (f) {
                      console.log(f)
                      return html`
                        <li>
                          <button class="fsItem file">
                            ${f.name}
                          </button>
                        </li>
                      `
                    })}
                  </ul>
                `
              } else {
            }
            })}
          </nav>
        `
      }
    } else return nothing()
  }
  /*
  function populateSidebar(filesystem) {
    if (filesystem) {
      var sidebarContent


    }
    filesystem.map( (item) => {
      return html`
        <ul>
          ${listFiles(item.subdirs, 'dir')}
          ${listFiles(item.files, 'file')}
        </ul>
      `
    })
  }

  function listFiles(items, type) {
    return items.map( (f) => {
      return html`
        <button class="fsItem {type}">
          ${f.name}
        </button>
      `
    })
  }
  */

  function nothing() {
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
          <button class="b f-hover text-button" onclick=${ function() { shell.openExternal("https://txtapp.io") } }>
            Welcome Guide
          </button>
        </div>
      </nav>
    `
  }

  function appFocused() {

  }

}
