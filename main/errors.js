
module.exports = {
  parseErr: function(err) {
    var parsedErr = {
      message: 'Unknown error',
      detail: 'An unknown error has occurred.',
      action: 'Ok',
      assist: 'Support'
    }
    return parsedErr
  }
}
