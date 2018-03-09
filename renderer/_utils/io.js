const fs = require('fs')
const path = require('path')

const dirToJson = require('dir-to-json')
const mime = require('mime')
const trash = require('trash')

mime.define({ 'text/gpg': ['gpg'] })

module.exports = {

  /**
   * Test to see if something is empty or not.
   * @param obj The target you want to test.
   * */
  isEmpty: function(obj) {
    return !Object.keys(obj).length > 0
  },

  /**
   * Recursively lists a directory and returns a JSON directory tree.
   * Requires mime
   * @param uri The target uri on disk.
   * @param callback Passes an error and json object back.
   * */
  ls: function(uri, callback) {
    console.log('utils:ls: Listing ' + uri)
    if (uri) {
      dirToJson(path.normalize(uri), (err, tree) => {
        console.log('utils:ls: done \n', tree)
        callback(err, tree)
      })
    }
  },

  /**
   * Opens a file.
   * Requires mime
   * @param uri The target uri on disk.
   * @param callback Passes an error + buffer of the file.
   * */
  open: function(uri, callback) {
    console.log('utils:open: Opening ', uri)
    fs.stat(path.normalize(uri), (err, stats) => {
      if (err) {
        console.log('utils:open: Error checking ', uri,' err: ', err )
        callback(err, null)
      } else {
        fs.readFile(path.normalize(uri), (err, data) => {
          console.log('utils:open: Done. Data: ', data, ', err: ', err)
          if (err) {
            callback(err, null)
          } else {
            callback(err, data)
          }
        })
      }
    })
  },

  /**
   * A simple check for a resource.
   * @param uri The absolute path for the resource you wish to check.
   * @param callback returns true or false.
   * */
  exists: function(uri, callback) {
    console.log('utils:exists: checking ', uri)
    fs.stat(path.normalize(uri), (err, stats) => {
      console.log('utils:exists: done. stats: ', stats, ', err: ', err)
      if (err) callback(false)
      else callback(true)
    })
  },

  /**
   * Writes data to a file. If the file does not exist, it will be created.
   * @param uri The absolute path for the directory you wish to make.
   * @param name [optional] The name for the file. Defaults to 'Untitled'.
   * @param data [optional] The data to write.
   * @param callback Returns a status of true or false, plus an error.
   * */
  write: function(uri, name, data, callback) {
    var targetUri = name? path.join(uri, name) : path.join(uri, 'Untitled')
    console.log('utils:write: to: ', path.join(uri, name), ' data: ', data)
    fs.stat(path.normalize(targetUri), (err, stats) => {
      if (err) {
        console.log('utils:write err: ' + err)
        callback(err, false)
      } else {
        fs.writeFile(pathpath.normalize(targetUri), data, (err) => {
          if (err) {
            console.log('utils:write err: ' + err)
            callback(err, false)
          } else {
            console.log('utils:write done!')
            callback(null, true)
          }
        })
      }
    })
  },

  /**
   * Makes a directory.
   * @param uri The absolute path for the directory you wish to make.
   * @param name [optional] The name for the new folder. Defaults to 'New Folder'.
   * @param callback Returns a status of true or false, plus an error.
   * */
  mkdir: function(uri, name, callback) {
    fs.stat(path.normalize(uri), (err, stats) => {
      if (!err) {
        callback(stats, false)
      } else {
        fs.mkdir(path.normalize(uri), (err) => {
          if (err) {
            callback(err, false)
          } else {
            callback(null, true)
          }
        })
      }
    })
  },

  /**
   * Move a resource to the trash. Does not check anything before it does this.
   * @param uri The absolute path for the resource you wish to trash.
   * @param callback Returns an error, and success boolean.
   * */
  trash: function(uri, callback) {
    trash([path.normalize(uri)]).then(() => {
      callback(null, true)
    }).catch((err) => {
      callback(err, false)
    })
  },

  /**
   * Move a resource from one path to another.
   * @param uri The current path for the resource.
   * @param targetUri The new path for the resource.
   * @param callback Returns an error, and success boolean.
   * */
  mv: function(uri, targetUri, callback) {
    fs.stat(path.normalize(uri), (err, stats) => {
      if (!err) {
        callback(stats, false)
      } else {
        fs.stat(path.normalize(targetUri), (err, stats) => {
          if (!err) {
            callback(stats, false)
          } else {
            fs.rename(path.normalize(uri), path.normalize(targetUri), (err) => {
              if (err) {
                callback(err, false)
              } else {
                callback(null, true)
              }
            })
          }
        })
      }
    })
  }
}
