const route = require('express').Router()
const {ControllerArticle} = require('../controllers')
const {ControllerUser} = require('../controllers')
const isUser = require('../middlewares/isUser')

route.get('/', (req, res) => {res.status(200).json({message: 'Home'})})

route.post('/login', ControllerUser.login)
route.post('/google-sign-in', ControllerUser.login)

route.get('/articles', ControllerArticle.findAll)
route.post('/articles', ControllerArticle.create)
route.get('/articles/:id', ControllerArticle.update)
route.put('/articles/:id', /* isUser, */ ControllerArticle.update)
route.delete('/articles/:id',/*  isUser, */ ControllerArticle.delete)

route.get('/users', ControllerUser.findAll)
route.get('/users/:id', ControllerUser.findOne)
route.post('/users', ControllerUser.create)
route.put('/users/:id', /* isUser, */ ControllerUser.update)
route.delete('/users/:id', /* isUser, */ ControllerUser.delete)

route.use('/*', (req, res) => res.status(404).json({error: 'Not Found :('}))

module.exports = route