const route = require('express').Router()
const { ControllerArticle } = require('../controllers')
const { ControllerUser } = require('../controllers')
const authenticate = require('../middlewares/authenticate')
const authorize = require('../middlewares/authorize')
const images = require('../helpers/images')

route.get('/', (req, res) => { res.status(200).json({ message: 'Home' }) })

route.post('/login', ControllerUser.login)
route.post('/googleSignIn', ControllerUser.googleSignIn)
route.post('/register', ControllerUser.create)

route.get('/articles', ControllerArticle.findAll)
route.get('/articles/:id', ControllerArticle.findOne)
route.post('/articles', authenticate, ControllerArticle.create)
route.put('/articles/:id', authenticate, authorize, ControllerArticle.update)
route.delete('/articles/:id', authenticate, authorize, ControllerArticle.delete)

route.get('/users', ControllerUser.findAll)
route.get('/users/:id', ControllerUser.findOne)
route.put('/users/:id', ControllerUser.update)
route.delete('/users/:id', ControllerUser.delete)

route.post('/upload', images.multer.single('image'), images.sendUploadToGCS, (req, res) => {
    res.send({
      status: 200,
      message: 'Your file is successfully uploaded',
      link: req.file.cloudStoragePublicUrl
    })
  })

route.use('/*', (req, res) => res.status(404).json({ error: 'Not Found :(' }))

module.exports = route