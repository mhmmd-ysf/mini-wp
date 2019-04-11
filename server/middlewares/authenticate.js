const jwt = require('jsonwebtoken')
function authenticate(req, res, next) {
  try {
    let decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
    req.auth = decoded
    next()
  } catch {
    res.status(401).json({message: 'Harus authenticated user.'})
  }
}

module.exports = authenticate