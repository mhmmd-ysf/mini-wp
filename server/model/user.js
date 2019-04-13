const mongoose = require('mongoose')

let userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  articles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article'
  }]
})

let User = mongoose.model('User', userSchema)

module.exports = User