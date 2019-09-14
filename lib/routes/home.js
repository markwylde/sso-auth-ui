const axios = require('../services/httpRequest')
const router = require('express').Router()

router.get('/', async function (req, res) {
  res.render('pages/home', {
    activePage: 'home',
    session: req.session
  })
})

module.exports = router
