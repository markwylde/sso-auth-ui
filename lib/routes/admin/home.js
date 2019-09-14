const axios = require('../../services/httpRequest')
const router = require('express').Router()
const { checkPerm } = require('../../services/jwt')

router.get('/admin', checkPerm(/^auth_admin:/), async function (req, res, next) {
  try {
    res.redirect('/admin/users')
  } catch (err) {
    next(err)
  }
})

module.exports = router
