const packageJson = require('../package.json')

const express = require('express')
const bodyParser = require('body-parser')
const cookieFlashMessages = require('cookie-flash-messages')
const cookieParser = require('cookie-parser')

const log = require('./services/logger')
const errors = require('./services/errors')
const routes = require('./routes')
const {sessionMiddleware} = require('./services/auth')

const app = express()
app.set('view engine', 'ejs')

app.use('/assets', express.static('./assets'))

app.use(cookieParser())
app.use(sessionMiddleware())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cookieFlashMessages)

app.use(routes)
app.use(errors.middleware)

app.listen(80)
log.info(packageJson, `Running ${packageJson.name}@${packageJson.version}`)
