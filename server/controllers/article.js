const { Article } = require('../model')
const { User } = require('../model')

class ControllerArticle {
  static create(req, res) {
    let input = req.body
    // console.log('masuk')
    // console.log(input)
    let newArticle = {
      title: input.title,
      content: input.content,
      modified: new Date()
    }
    Article.create(newArticle)
      .then(data => {
        // console.log(data)
        // user.articles.push(data._id)
        // user.save()
        res.status(201).json(data)
      })
      .catch(err => { res.status(500).json(err) })
    // User.findOne({ _id: input.id })
      // .then(user => {
      //   newArticle.userId = user._id
      // })
      // .catch(err => { res.status(401).json({ message: err.message }) })
  }
  static findAll(req, res) {
    Article.find()
      .then(data => {
        data = data.reverse()
        console.log(data)
        res.status(200).json(data)
      })
      .catch(err => { res.status(500).json(err) })
  }
  static findOne(req, res) {
    Article.find({_id: req.params.id})
      .then(data => {res.status(200).json(data)})
      .catch(err => {res.status(500).json(err)})
  }
  static update(req, res) {
    // delete req.body._id
    // req.body.checkStatus = (req.body.checkStatus === 'true') ? true : false
    req.body.modified = new Date()
    Article.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
      .then(article => {
        res.status(200).json(article)
      })
      .catch(err => {
        console.log(err)
        res.status(500).json(err)
      })
  }
  static delete(req, res) {
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