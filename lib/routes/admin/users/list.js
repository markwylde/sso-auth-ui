const axios = require('../../../services/httpRequest')
const router = require('express').Router()
const { checkPerm } = require('../../../services/jwt')

router.get('/admin/users', checkPerm(/^auth_admin:/), async function (req, res, next) {
  try {
    const users = await axios({
      method: 'get',
      url: 'http://auth-api/v1/users',
      headers: {
        'x-session-id': req.cookies['sessionId'],
        'x-session-secret': req.cookies['sessionSecret']
      }
    })
  
    res.render('pages/admin/users/list', {
      activePage: 'admin',
      session: req.session,
      users: users.data
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router
