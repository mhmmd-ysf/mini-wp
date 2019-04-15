const { verify } = require('../helpers/jwt')
function authenticate(req, res, next) {
    console.log('masuk authenticate')
    console.log(req.headers.token)
  try {
    let decoded = verify(req.headers.token)
    req.auth = decoded
    console.log(req.auth)
    next()
  } catch {
    res.status(401).json({message: 'Harus authenticated user.'})
  }
}

module.exports = authenticate