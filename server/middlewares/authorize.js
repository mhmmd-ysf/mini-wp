function authorize(req, res, next) {
  try {
    // console.log(req.auth, 'Ini dari authorize =======================')
    if(req.auth.role !== 'admin') {
      res.status(401).json({message: 'Harus Admin'})
    } else {
      next()
    }
  } catch {
    res.status(401).json({message: 'Harus authorized user'})
  }
}

module.exports = authorize