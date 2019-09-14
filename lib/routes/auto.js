const router = require('express').Router()

router.get('/auto', function (req, res) {
  if (req.session) {
    res.send(`
<script>
  top.location = '${req.query.redirect}'
</script>
    `.trim())
  } else {
    res.status(404).end()
  }
})

module.exports = router
