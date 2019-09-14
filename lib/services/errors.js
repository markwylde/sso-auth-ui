const log = require('./logger')

module.exports = {
  UnauthorisedError: function (message) {
    this.status = 401
    this.friendly = 'Unauthorised'
    this.message = message
  },

  NotFoundError: function (message) {
    this.status = 404
    this.friendly = 'Not Found'
    this.message = message
  },

  SchemaValidationError: function (errors) {
    this.status = 422
    this.friendly = errors.map(el => el.message)
    this.message = errors
  },

  middleware: (err, req, res, next) => {
    if (!err.status && err.response && err.response.status === 404) {
      err.status = 404
      err.friendly = 'Not Found'
    }

    log.error(err)
    res.status(err.status || 500).send(err.friendly || 'Unexpected error')
  }
}