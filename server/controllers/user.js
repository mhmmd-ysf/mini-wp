const { User } = require('../model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

class ControllerUser {
  static create(req, res) {
    let input = req.body
    let newUser = {
      name: input.name,
      username: input.username,
      password: bcrypt.hashSync(input.password, 10),
      articles: []
    }
    User.create(newUser)
      .then(data => {
        const token = jwt.sign({
          name: data.name,
          username: data.username,
          id: data._id
        }, process.env.JWT_SECRET)
        res.status(201).json({ token })
      })
      .catch(err => res.status(500).json({ err }))
  }
  static findAll(req, res) {
    User.find()
      .then(data => {
        res.status(200).json(data)
      })
      .catch(err => res.status(500).json({message: err.message}))
  }
  static update(req, res) {
    req.body.password = bcrypt.hashSync(req.body.password, 10)
    User.findOneAndUpdate({_id: req.params.id}, req.body, { new: true })
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => res.status(500).json({message: err.message}))
  }
  static delete(req, res) {
    User.findOneAndDelete({_id: req.params.id})
      .then(user => {
        const response = {
          message: 'Successfully deleted user.',
          id: req.params.id
        }
        res.status(200).json(response)
      })
      .catch(err => {res.status(500).json({message: err.message})})
  }
  static findOne(req, res) {
    User.findOne({_id: req.params.id})
      .then(user => {
        res.status(200).json(user)
      })
      .catch(err => {console.log('error'); res.status(500).json({message: err.message})})
  }
  static login(req, res) {
    User.findOne({username: req.body.username})
      .then(user => {
        console.log(user)
        if(user === null) {
          res.status(401).json({message: 'Invaild username/password'})
          return
        } else {
          if (!bcrypt.compareSync(req.body.password, user.password)) {
            res.status(401).json({message: 'Invalid username/password'})
          } else {
            console.log('siap buat token')
            const token = jwt.sign({
              name: user.name,
              username: user.username,
              id: user._id
            }, process.env.JWT_SECRET)
            req.headers.token = token
            console.log('siap balikin token')
            res.status(200).json({
              token,
              name: user.name,
              username: user.username,
              id: user._id
            })
          }
        }
      })
      .catch(err => {
        res.status(500).json({message: err.message})
      })
  }
  static googleSignIn(req, res) {
    const { id_token } = req.body
    client.verifyIdToken({
      id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    })
    .then(ticket => {
      const payload = ticket.getPayload()
      User.findOne({ email: payload.email })
        .then(user => {
          if(!user) {
            return User.create({
              name: `${payload.given_name} ${payload.family_name}`,
              email: payload.email,
              password: bcrypt.hashSync('12345', 10)
            })
          } else {
            return Promise.resolve(user)
          }
        })
        .then(user => {
          const token = jwt.sign({
            name: user.name,
            email: user.email,
            id: data._id
          }, process.env.JWT_SECRET)
          res.status(201).json({token})
        })
        .catch(err => res.status(500).json({message: err.message}))
    })
  }
}

module.exports = ControllerUser