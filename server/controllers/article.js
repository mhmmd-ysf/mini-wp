const { Article } = require('../model')
const { User } = require('../model')
const { verify } = require('../helpers/jwt')

class ControllerArticle {
  static create(req, res) {
    let input = req.body
    let user = req.auth
    // console.log(user)
    let newArticle = {
      title: input.title,
      content: input.content,
      modified: new Date(),
      authorId: user.id,
      authorName: user.name,
      featuredImg: ''
    }
    Article.create(newArticle)
      .then(data => {
        res.status(201).json(data)
      })
      .catch(err => { res.status(500).json(err) })
  }
  static findAll(req, res) {
    Article.find()
      .then(data => {
        // data = data.reverse()
        data = data.sort((a, b) => {
          if (a.modified > b.modified) {
            return -1
          } else if (a.modified < b.modified) {
            return 1
          } else return 0
        })
        // console.log(data)
        res.status(200).json(data)
      })
      .catch(err => { res.status(500).json(err) })
  }
  static findOne(req, res) {
    console.log('masuk findone server')
    Article.findOne({ _id: req.params.id })
      .then(data => { res.status(200).json(data) })
      .catch(err => { res.status(500).json(err) })
  }
  static update(req, res) {
    console.log('masuk update article server')
    req.body.authorId = req.auth.id
    req.body.authorName = req.auth.name
    Article.updateOne({ _id: req.params.id }, req.body, { new: true })
      .then(article => {
        if (!article) {
          res.status(500).json(err)
        } else {
          return Article.findOne({_id: req.params.id})
        }
      })
      .then(article => {
        res.status(200).json(article)
      })
      .catch(err => {
        // console.log(err)
        res.status(500).json(err)
      })
  }
  static delete(req, res) {
    console.log('masuk delete')
    console.log('req.params.id')
    console.log(req.params.id)
    Article.findOneAndDelete({ _id: req.params.id })
      .then(article => {
        const response = {
          message: 'Successfully deleted article.',
          id: req.params.id
        }
        res.status(200).json(response)
      })
      .catch(err => res.status(500).json(err))
  }
}

module.exports = ControllerArticle