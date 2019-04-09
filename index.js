let url = 'http://localhost:3000'

new Vue({
  el: '#app',
  data: {
    lirik: 'lirik',
    message: 'ey',
    articles: [],
    isShown: true,
    title: '',
    content: '',
    search: '',
    titleEdit: '',
    contentEdit: ''
  },
  created() {
    // console.log('masuk')
    axios.get(url + "/articles")
      .then(({ data }) => {
        // console.log(data)
        this.articles = data
      })
      .catch(error => {
        console.log(error)
      })
  },
  computed: {
    validation() {
      return this.title.length > 4 && this.title.length < 13
    },
    filteredList() {
      let filtered = this.articles.filter(post => {
        return post.title.toLowerCase().includes(this.search.toLowerCase()) ||post.content.toLowerCase().includes(this.search.toLowerCase())
      })
      if(filtered.length > 5) {filtered.length = 5}
      return filtered
    }
  },
  methods: {
    test() {
      let obj = {
        title: this.title,
        content: this.content,
        modified: new Date()
      }
      axios.post(url + '/articles', obj)
        .then(({data}) => {
          let sorted = data.sort((a,b) => {
            return b.modified - a.mmodified
          })
          this.articles = sorted
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  watch: {
    searches: function (input) {

    }
  }
})

/*
Toggle Hide/Show Jquery
$(document).ready(function() {
  toggleAddArticle()
})

function toggleAddArticle() {
  var article = document.getElementById('postArticle')
  var content = document.getElementById('content')
  let style = getComputedStyle(article);
  if (article.style.display === "none" || style.display === "none") {
    console.log('if 1')
    article.style.display = "block";
    content.style.display = "none";
  } else {
    console.log('if 2')
    article.style.display = "none";
    content.style.display = "block";
  }
}
*/