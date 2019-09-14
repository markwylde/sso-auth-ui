const axios = require('../../services/httpRequest')
const router = require('express').Router()
const { checkPerm } = require('../../services/jwt')

const getApp = (sessionId, sessionSecret, appId) =>
  axios({
    method: 'get',
    url: `http://auth_auth-api/v1/apps/${appId}`,
      headers: {
        'x-session-id': sessionId,
        'x-session-secret': sessionSecret
      }
  })

router.get('/apps/:appId', checkPerm(/^auth_admin:/), async function (req, res, next) {
  try {
    const app = await getApp(req.cookies['sessionId'], req.cookies['sessionSecret'], req.params.appId)

    res.render('pages/apps/read', {
      activePage: 'apps',
      session: req.session,
      app: app.data
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router
