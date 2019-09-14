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

router.get('/apps/:appId/adopt', checkPerm(/^auth_admin:/), async function (req, res, next) {
  try {
    const app = await getApp(req.cookies['sessionId'], req.cookies['sessionSecret'], req.params.appId)

    res.render('pages/apps/adopt', {
      activePage: 'apps',
      session: req.session,
      app: app.data
    })
  } catch (err) {
    next(err)
  }
})

router.post('/apps/:appId/adopt', checkPerm(/^auth_admin:/), async function (req, res, next) {
  try {
    await axios({
      method: 'post',
      url: `http://auth_auth-api/v1/apps/${req.params.appId}/activate`,
        headers: {
          'x-session-id': req.cookies['sessionId'],
          'x-session-secret': req.cookies['sessionSecret']
        }
    })

    res.redirect('/apps')
  } catch (err) {
    next(err)
  }
})

module.exports = router
