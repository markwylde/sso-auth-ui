const fs = require('fs')

const crypto = require('crypto')
const jwt = require('jsonwebtoken')

let defaultJwtSecret = null
try {
  defaultJwtSecret = fs.readFileSync('/run/secrets/jwt_token', 'utf8')
} catch (err) {}

module.exports = {
  generateSecureSecret: (length = 24) =>
    new Promise((resolve) => {
      crypto.randomBytes(length, function (err, buffer) {
        resolve(buffer.toString('hex'))
      })
    }),

  signJwt: (secret, data) =>
    new Promise((resolve, reject) => {
      jwt.sign(data, secret, function (err, token) {
        if (err) {
          reject(err)
        } else {
          resolve(token)
        }
      })
    }),

  verifyJwt: (secret, data) =>
    new Promise((resolve, reject) => {
      jwt.verify(data, secret, function (err, result) {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    }),

  jwtRouter: (secret = defaultJwtSecret) => (req, res, next) => {
    if (req.headers['x-identity-token']) {
      jwt.verify(req.headers['x-identity-token'], secret, function (err, result) {
        if (err) {
          next(err)
        } else {
          req.session = result
          next()
        }
      })
    } else {
      next()
    }
  }

}
