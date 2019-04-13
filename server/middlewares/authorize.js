const { verify } = require('../helpers/jwt')
const User = require('../model/user')

module.exports = (req, res, next) => {
  try {
    console.log('masuk authorize')
    const decode = verify(req.headers.token)
    User.findOne({
        email: decode.email
      })
      .then((found) => {
        if (found) {
          req.auth = decode
          next()
        } else {
          res.status(401).json({
            error: 'Authentication ERROR'
          })
        }
      })
      .catch(err => {
        res.status(401).json({
          error: 'Authentication ERROR'
        })
      })
  } catch (err) {
    res.status(401).json({
      error: 'Authentication ERROR'
    })
  }
}