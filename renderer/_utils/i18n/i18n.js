const Polyglot = require('node-polyglot')

var polyglot = new Polyglot()

polyglot.extend(require('./strings/en.js'))

module.exports = polyglot
