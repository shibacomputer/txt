const html = require('choo/html')
const style = require('./style')

module.exports = noteCounter

function noteCounter (date, count) {
  title = typeof title === "string" ? title : 'Untitled'
  return html`
    <h1 class="${style}">${ title }</h1>
  `
}
