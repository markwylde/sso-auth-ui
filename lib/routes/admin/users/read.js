const axios = require('../../../services/httpRequest')
const router = require('express').Router()
const { checkPerm } = require('../../../services/jwt')

const getUser = (sessionId, sessionSecret, userId) =>
  axios({
    method: 'get',
    url: `http://auth-api/v1/users/${userId}`,
      headers: {
        'x-session-id': sessionId,
        'x-session-secret': sessionSecret
      }
  })

const getPermissions = (sessionId, sessionSecret) =>
  axios({
    method: 'get',
    url: `http://auth-api/v1/permissions`,
      headers: {
        'x-session-id': sessionId,
        'x-session-secret': sessionSecret
      }
  })

const getApps = (sessionId, sessionSecret) =>
  axios({
    method: 'get',
    url: `http://auth-api/v1/apps`,
      headers: {
        'x-session-id': sessionId,
        'x-session-secret': sessionSecret
      }
  })

router.get('/admin/users/:userId', checkPerm(/^auth_admin:/), async function (req, res, next) {
  try {
    const user = await getUser(req.cookies['sessionId'], req.cookies['sessionSecret'], req.params.userId)
    const permissions = await getPermissions(req.cookies['sessionId'], req.cookies['sessionSecret'])
    const apps = await getApps(req.cookies['sessionId'], req.cookies['sessionSecret'])

    res.render('pages/admin/users/read', {
      activePage: 'admin',
      session: req.session,
      user: user.data,
      permissions: permissions.data,
      apps: apps.data
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router
