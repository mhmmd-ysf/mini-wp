const { verify } = require('../helpers/jwt')
function authenticate(req, res, next) {
  try {
    console.log('masuk authenticate')
    let decoded = verify(req.headers.token)
    req.auth = decoded
    next()
  } catch {
    res.status(401).json({message: 'Harus authenticated user.'})
  }
}

module.exports = authenticate