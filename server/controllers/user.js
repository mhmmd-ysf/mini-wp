const { User } = require('../model')
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const { hash } = require('../helpers/bcrypt')
const { compare } = require('../helpers/bcrypt')
const { sign } = require('../helpers/jwt')

class ControllerUser {
  static create(req, res) {
    let input = req.body
    let newUser = {
      name: input.name,
      email: input.email,
      password: hash(input.password),
    }
    User.create(newUser)
      .then(data => res.status(201).json(data))
      .catch(err => res.status(500).json(err))
  }
  static findAll(req, res) {
    User.find()
      .then(data => {
        res.status(200).json(data)
      })
      .catch(err => res.status(500).json({message: err.message}))
  }
  static update(req, res) {
    req.body.password = hash(req.body.password)
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
    User.findOne({email: req.body.email})
      .then(user => {
        // console.log(user)
        if(user === null) {
          res.status(401).json({message: 'Invaild username/password'})
          return
        } else {
          if (!compare(req.body.password, user.password)) {
            res.status(401).json({message: 'Invalid username/password'})
          } else {
            const token = sign({
              name: user.name,
              email: user.email,
              id: user._id
            })
            req.headers.token = token
            res.status(200).json({
              token: token,
              name: user.name,
              email: user.email,
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
              password: hash('12345')
            })
          } else {
            return Promise.resolve(user)
          }
        })
        .then(user => {
          const token = sign({
            name: user.name,
            email: user.email,
            id: data._id
          })
          res.status(201).json({token})
        })
        .catch(err => res.status(500).json({message: err.message}))
    })
  }
}

module.exports = ControllerUser