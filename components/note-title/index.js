const html = require('choo/html')
const style = require('./style')

module.exports = noteTitle

function noteTitle (title) {
  title = typeof title === "string" ? title : 'Untitled'
  return html`
    <h1 class="${style}">${ title }</h1>
  `
}
