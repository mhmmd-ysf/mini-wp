let url = 'http://localhost:3000'

new Vue({
  el: '#app',
  component: [
    'article-component'
  ],
  data: {
    articles: [],
    page: 'home',
    title: '',
    content: '',
    search: '',
    titleEdit: '',
    contentEdit: '',
    loginEmail: '',
    loginPassword: ''
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
    filteredList: function () {
      let filtered = this.articles.filter(post => {
        return post.title.toLowerCase().includes(this.search.toLowerCase()) || post.content.toLowerCase().includes(this.search.toLowerCase())
      })
      filtered = filtered.sort((a, b) => { a.title > b.title })
      // if (filtered.length > 5) { filtered.length = 5 }
      return filtered
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
        .then(({ data }) => {
          this.articles.unshift(data)
          this.title = ''
          this.content = ''
        })
        .catch(error => {
          console.log(error)
        })
    },
    edit(input) {
      axios.get(url + `/articles/${input}`)
        .then(({ data }) => {
          this.titleEdit = data.title
          this.contentEdit = data.content
        })
        .catch(err => { console.log(err) })
    },
    view(input) {
      axios.get(url + `/articles/${input}`)
        .then(({ data }) => {
          this.titleEdit = data.title
          this.contentEdit = data.content
        })
        .catch(err => { console.log(err) })
    },
    login: function () {
      let obj = {
        email: this.loginEmail,
        password: this.loginPassword
      }
      console.log(obj)
      axios.post(url + '/login', obj)
        .then(({ data }) => {
          console.log(data)
          window.localStorage.setItem('token', data.token)
          window.localStorage.setItem('name', data.name)
          window.localStorage.setItem('email', data.email)
          window.localStorage.setItem('id', data.id)
          this.loginEmail = ''
          this.loginPassword = ''
          swal('berhasil masuk')
          this.page = 'home'
        })
        .catch(err => { console.log(err); swal(err.message) })
    },
    logout: function () {
      window.localStorage.removeItem('token')
      window.localStorage.removeItem('name')
      window.localStorage.removeItem('email')
      window.localStorage.removeItem('id')
      swal('berhasil keluar')
      this.page = 'login'
    },
    swalCancel: function () {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this imaginary file!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
        .then((willDelete) => {
          if (willDelete) {
            swal("Poof! Your imaginary file has been deleted!", {
              icon: "success",
            });
          } else {
            swal("Your imaginary file is safe!");
          }
        })
    },
    closeModal() {
      this.$nextTick(() => {
        // Wrapped in $nextTick to ensure DOM is rendered before closing
        this.$refs.modal.hide()
      })
    }
  },
  watch: {
    filteredList(input) {
      input = input.map(item => item.title)
      // console.log(input)
    }
  }
})

Vue.component('article-component', {
  props: ['articles'],
  data() {
    return {
      data: {
        message: 'Hello from Vue component!',
      },
    }
  },
  methods: {
    sendMessage() {
      this.$emit('show-article', this.message) // untuk emit data ke mainJS
    }
  },
  template: ``
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