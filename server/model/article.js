const mongoose = require('mongoose')

let ArticleSchema = new mongoose.Schema({
  title: String,
  content: String,
  modified: Date,
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  authorName: String,
  featuredImg: String
})

let Article = mongoose.model('Article', ArticleSchema)

module.exports = Article