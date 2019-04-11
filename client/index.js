let url = 'http://localhost:3000'

new Vue({
  el: '#app',
  data: {
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
    searchComputed() {
      this.search
    },
    validation() {
      return this.title.length > 4 && this.title.length < 13
    },
    filteredList: function() {
      let filter = this.articles.filter(post => {
        return post.title.toLowerCase().includes(this.search.toLowerCase()) || post.content.toLowerCase().includes(this.search.toLowerCase())
      })
      filter = filter.sort((a,b) => {a.title > b.title})
      if(filter.length > 5) {filter.length = 5}
      return filter
    }
  },
  methods: {
    create() {
      let obj = {
        title: this.title,
        content: this.content,
        modified: new Date()
      }
      axios.post(url + '/articles', obj)
        .then(({data}) => {
          this.articles.unshift(data)
          this.title = ''
          this.content = ''
        })
        .catch(error => {
          console.log(error)
        })
    },
    test(input) {
      console.log('masuk')
      console.log(input)
      axios.get(url + `/articles/${input}`)
      .then(({data}) => {
        console.log(data)
        this.titleEdit = data.title
        this.contentEdit = data.content
        console.log(this.titleEdit)
        console.log(this.contentEdit)
      })
      .catch(err => {console.log(err)})
    }
  },
  watch: {
    filteredList(input) {
      input = input.map(item => item.title)
      console.log(input)
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