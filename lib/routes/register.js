const axios = require('../services/httpRequest')

const router = require('express').Router()

router.get('/register', (req, res) => {
  res.render('pages/register', { activePage: 'register', formData: {} })
})

router.post('/register', async (req, res) => {
  try {
    await axios({
      method: 'post',
      url: 'http://auth-api/v1/users',
      data: req.body
    })

    res.flash('success', `Your account has been successfully created`)
    res.redirect(`/login${req.query.r ? `?r=${req.query.r}` : ''}`)
  } catch (err) {
    if (err.response.status === 422) {
      res
        .status(422)
        .render('pages/register', { activePage: 'register', errors: err.response.data, formData: req.body })
    } else {
      console.log(err)
    }
  }
})

module.exports = router
