const { Article } = require('../model')
const { User } = require('../model')

function isUser(req, res, next) {
  console.log(req.body, 'req body, userid')
  console.log(req.params, 'req params, articleid')

  Article.find({_id: req.params.id})
    .then(article => {
      article = article[0]
      console.log(article.userId)
      console.log(article)
      if(article.userId !== req.body.id || !article.userId) res.status(401).json({message: 'Harus Admin/user sendiri.'})
      else next()
    })
    .catch(err => {console.log('error'); res.status(500).json({message: err.message})})
}

module.exports = isUser