const utils = require('../utils/utils')
const folders = require('../utils/folders')

module.exports = createModel

function createModel() {
  return {
    namespace: 'filesystem',
    state: {
      folders: []
    },
    reducers: {
      list: list
    },
    effects: {
      readDir: readDir
    }
  }
}

function list (state, data) {
  var folder = {
    name: data.name
  }
}

function readDir (state, data, send, done) {
  folders.ls(data, (data) => {
    console.log(data)
  })
}
