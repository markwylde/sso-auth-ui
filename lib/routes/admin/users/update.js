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

router.get('/admin/users/:userId/edit', checkPerm(/^auth_admin:update$/), async function (req, res, next) {
  try {
    const user = await getUser(req.cookies['sessionId'], req.cookies['sessionSecret'], req.params.userId)
    const permissions = await getPermissions(req.cookies['sessionId'], req.cookies['sessionSecret'])

    res.render('pages/admin/users/update', {
      activePage: 'admin',
      session: req.session,
      user: user.data,
      permissions: permissions.data
    })
  } catch (err) {
    next(err)
  }
})

router.post('/admin/users/:userId/edit', checkPerm(/^auth_admin:update$/), async function (req, res, next) {
  try {
    const user = await getUser(req.headers['x-identity-token'], req.params.userId)

    if (!user) {
      throw new NotFoundError()
    }

    await axios({
      method: 'put',
      url: `http://auth-api/v1/users/${user.data.id}`,
      data: req.body,
      headers: {
        'authorization': req.headers['x-identity-token']
      }
    })

    res.flash('success', `The user has been successfully updated`)
    res.redirect(`/admin/users`)
  } catch (err) {
    if (err.response.status === 422) {
      const user = await getUser(req.headers['x-identity-token'], req.params.userId)
      const permissions = await getPermissions(req.headers['x-identity-token'])

      res
        .status(422)
        .render('pages/admin/users/update', {
          activePage: 'admin',
          errors: err.response.data,
          formData: req.body,
          user: user.data,
          permissions: permissions.data
        })
    } else {
      next(err)
    }
  }
})

module.exports = router
