const axios = require('../../services/httpRequest')
const router = require('express').Router()

router.get('/apps', async function (req, res) {
  const apps = await axios({
    method: 'get',
    url: 'http://auth-api/v1/apps',
    headers: {
      'x-session-id': req.cookies['sessionId'],
      'x-session-secret': req.cookies['sessionSecret']
    }
  })

  res.render('pages/apps/list', {
    activePage: 'apps',
    session: req.session,
    apps: apps.data
  })
})

module.exports = router
