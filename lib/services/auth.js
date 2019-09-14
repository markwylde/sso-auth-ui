const axios = require('./httpRequest')

async function getSessionInformation (sessionId, sessionSecret) {
  try {
    const session = await axios({
      method: 'get',
      url: 'http://auth-api/v1/sessions/current',
      headers: sessionId && sessionSecret ? {
        'x-session-id': sessionId,
        'x-session-secret': sessionSecret,
      } : {}
    })

    return session.data
  } catch (err) {
    throw err
  }
}

function sessionMiddleware () {
  return async function (req, res, next) {
    if (req.cookies.sessionId && req.cookies.sessionSecret) {
      try {
        const session = await getSessionInformation(req.cookies.sessionId, req.cookies.sessionSecret)

        req.session = session
        res.locals.session = session
      } catch (err) {
        console.log(err)
      }
    }

    next()
  }
}

module.exports = {
  getSessionInformation,
  sessionMiddleware
}
