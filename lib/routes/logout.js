const axios = require('../services/httpRequest')

const router = require('express').Router()

router.get('/logout', function (req, res) {
  res.clearCookie('sessionId')
  res.clearCookie('sessionSecret')

  res.redirect('/')
})

module.exports = router
