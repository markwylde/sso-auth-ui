const axios = require('../services/httpRequest')

const router = require('express').Router()

router.get('/login', function (req, res) {
  if (req.query.error) {
    switch (req.query.error) {
      case 'INCORRECT_LOGIN':
        res.flash('danger', 'Your username and/or password was entered incorrectly')
        break

      default:
        res.flash('danger', `Unknown error occured with type ${req.query.error}`)
    }

    res.redirect(`/login${req.query.r ? `?r=${req.query.r}` : ''}`)
  } else {
    res.render('pages/login', { activePage: 'login', formData: {} })
  }
})

router.post('/login', async (req, res) => {
  try {
    const session = await axios({
      method: 'post',
      url: 'http://auth-api/v1/sessions',
      headers: {
        'X-Requested-With': 'axios'
      },
      data: req.body
    })

    const maxAge = 24 * 60 * 60 * 1000

    res.cookie('sessionId', session.data.sessionId, {maxAge, httpOnly: true, secure: true })
    res.cookie('sessionSecret', session.data.sessionSecret, {maxAge, httpOnly: true, secure: true })

    res.flash('success', `You have been logged in`)
    res.redirect('/')
  } catch (err) {
    if (err.response && err.response.status === 401) {
      res
        .status(401)
        .render('pages/login', {
          activePage: 'login',
          errors: ['username and password combination could not be found'],
          formData: req.body
        })
    } else if (err.response && err.response.status === 422) {
      res
        .status(422)
        .render('pages/login', {
          activePage: 'login',
          errors: err.response.data,
          formData: req.body
        })
    } else {
      console.log(err)
    }
  }
})

module.exports = router
