const mongoose = require('mongoose')

let ArticleSchema = new mongoose.Schema({
  title: String,
  content: String,
  modified: Date,
})

let Article = mongoose.model('Article', ArticleSchema)

module.exports = Article