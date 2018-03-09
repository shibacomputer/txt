// prefs.js

const Store = require('electron-store')
const defaults = require('./defaults')


// @TODO: Add prefs detection and migration agent.

module.exports = new Store({
  defaults: defaults
})
