let url = 'http://localhost:3000'

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  let id_token = googleUser.getAuthResponse().id_token
  // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  // console.log('Name: ' + profile.getName());
  // console.log('Image URL: ' + profile.getImageUrl());
  // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  let userObj = {
    name: profile.getName(),
    email: profile.getEmail(),
    password: this.loginPassword,
    id_token: id_token
  }
  var xhr = new XMLHttpRequest()
  xhr.open('POST', 'https://localhost:3000/googleSignIn')
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  xhr.onload = function () {
    console.log('Signed in as: ' + xhr.responseText)
  }
  xhr.send('idtoken=' + id_token)
  // axios.post(url + '/googleSignIn', userObj)
  //   .then(({ data }) => {
  //     console.log('data')
  //     // console.log(data)
  //     this.loginEmail = ''
  //     this.loginPassword = ''
  //     swal('Berhasil register')
  //     this.page = 'login'
  //       let obj = {
  //       email: userObj.email,
  //       password: ''
  //     }
  //     // return axios.get(url + '/users')
  //   })
    // .then(({ data }) => {
    //   data = data.filter(item => {
    //     return item.email = userObj.email
    //   })
    //   window.localStorage.setItem('token', data.token)
    //   window.localStorage.setItem('name', data.name)
    //   window.localStorage.setItem('email', data.email)
    //   window.localStorage.setItem('id', data.id)
    //   this.loginEmail = ''
    //   this.loginPassword = ''
    //   this.userName = data.name
    //   return swal(`Selamat datang ${data.name}!`, ' ', 'success')
    // })
    // .then(response => {
    //   this.isLoggedIn = true
    //   this.page = 'home'
    // })
    // .catch (err => { console.log(err); swal(err.message) })
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}


const vue = new Vue({
  el: '#app',
  data: {
    articles: [],
    page: 'login',
    isLoggedIn: false,
    isViewing: false,
    title: '',
    content: '',
    search: '',
    titleEdit: '',
    contentEdit: '',
    articleId: '',
    loginEmail: '',
    loginPassword: '',
    userName: '',
    text: '',
    file: ''
  },
  components: {
    wysiwyg: vueWysiwyg.default.component,
  },
  created() {
    // console.log('masuk')
    axios.get(url + "/articles")
      .then(({ data }) => {
        data = data.map(item => {
          item.modified = item.modified.substring(0, 19).split('T').join(' ')
          return item
        })
        console.log(data)
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
      if (filtered.length >= 9) { filtered.length = 9 }
      return filtered
    },
    myList: function () {
      let filtered = this.articles.filter(post => {
        return (post.title.toLowerCase().includes(this.search.toLowerCase()) || post.content.toLowerCase().includes(this.search.toLowerCase()))
          && window.localStorage.id === post.authorId
      })
      if (filtered.length >= 9) { filtered.length = 9 }
      return filtered
    }
  },
  methods: {
    processFile(name, file) {
      let tes = event.target.files[0]

      console.log('tes')
      console.log(tes)
      console.log('name')
      console.log(name)
      console.log('file')
      console.log(file)

      // this.file
      return tes
    },
    create(event) {
      axios.defaults.headers.common['Token'] = window.localStorage.token
      let obj = {
        title: this.title,
        content: this.content,
        modified: new Date()
      }
      console.log('create')
      console.log(obj)
      axios.post(url + '/articles', obj)
        .then(({ data }) => {
          data.modified = data.modified.substring(0, 19).split('T').join(' ')
          this.articles.unshift(data)
          this.title = ''
          this.content = ''
        })
        .catch(error => {
          console.log(error)
        })
    },
    edit(input) {
      axios.defaults.headers.common['Token'] = window.localStorage.token
      let obj = {
        title: this.titleEdit,
        content: this.contentEdit
      }
      console.log(obj)
      axios.put(url + `/articles/${input}`, obj)
        .then(({ data }) => {
          // console.log(data)
          data.modified = data.modified.substring(0, 19).split('T').join(' ')
          this.articles = this.articles.map(item => {
            if (item._id === data._id) {
              item = data
            }
            return item
          })
          this.titleEdit = ''
          this.contentEdit = ''
          $('#contentEdit').modal('hide')
          $('#contentView').modal('hide')
        })
        .catch(err => { console.log(err) })
    },
    view(input) {
      this.isViewing = true
      this.articleId = input
      axios.get(url + `/articles/${input}`)
        .then(({ data }) => {
          this.titleEdit = data.title
          this.contentEdit = data.content
        })
        .catch(err => { console.log(err) })
    },
    view2(input) {
      this.articleId = input
      axios.get(url + `/articles/${input}`)
        .then(({ data }) => {
          if (data.authorId !== window.localStorage.id) {
            return swal('Error: 401 Unauthorized!', `You can only edit your own article.`, 'error')
          } else {
            this.titleEdit = data.title
            this.contentEdit = data.content
          }
        })
        .then(cancel => {
          $('#contentEdit').modal('hide')
          $('#contentView').modal('hide')
        })
        .catch(err => { console.log(err) })
    },
    login: function () {
      let obj = {
        email: this.loginEmail,
        password: this.loginPassword
      }
      axios.post(url + '/login', obj)
        .then(({ data }) => {
          window.localStorage.setItem('token', data.token)
          window.localStorage.setItem('name', data.name)
          window.localStorage.setItem('email', data.email)
          window.localStorage.setItem('id', data.id)
          this.loginEmail = ''
          this.loginPassword = ''
          this.userName = data.name
          this.isLoggedIn = true
          swal(`Selamat datang ${data.name}!`, ' ', 'success')
          this.page = 'home'
        })
        .catch(err => { console.log(err); swal(err.message) })
    },
    logout: function () {
      this.loginEmail = ''
      this.loginPassword = ''
      this.userName = ''
      window.localStorage.removeItem('token')
      window.localStorage.removeItem('name')
      window.localStorage.removeItem('email')
      window.localStorage.removeItem('id')
      signOut()
      swal('Berhasil keluar')
      this.isLoggedIn = false
      this.page = 'login'
    },
    swalDelete: function (id) {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this article!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
        .then((willDelete) => {
          if (willDelete) {
            this.deleteArticle(id)
            swal("Poof! Your article has been deleted!", {
              icon: "success",
            });
          } else {
            swal("Your article is safe!")
          }
        })
    },
    deleteArticle: function (input) {
      axios.defaults.headers.common['Token'] = window.localStorage.token
      axios.delete(`${url}/articles/${input}`)
        .then(done => {
          this.articles = this.articles.filter(item => {
            return item._id !== input
          })
          $('#contentEdit').modal('hide')
          $('#contentView').modal('hide')
          this.page = 'home'
        })
        .catch(err => swal(err.message))
    },
    register: function () {
      let userObj = {
        name: this.userName,
        email: this.loginEmail,
        password: this.loginPassword
      }
      axios.post(url + '/register', userObj)
        .then(({ data }) => {
          console.log('data')
          // console.log(data)
          this.loginEmail = ''
          this.loginPassword = ''
          swal('Berhasil register')
          this.page = 'login'
        })
    },
    switchPage(input) {
      this.page = input
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

Vue.component('navbar', {
  methods: {
    switchPage: function (input) {
      this.$emit('switching-page', input)
    },
    logoutcomp: function () {
      this.$emit('logging-out')
    }
  },
  template: `
  <div class="side">
    <b-list-group style="cursor: pointer">
      <b-list-group-item @click="switchPage('home')">Home</b-list-group-item>
      <b-list-group-item @click="switchPage('profile')">Profile</b-list-group-item>
      <b-list-group-item @click="switchPage('myPost')">Post</b-list-group-item>
      <b-list-group-item variant="secondary" onclick="swal('Item unavailable :(')">Settings</b-list-group-item>
      <b-list-group-item @click.prevent="logoutcomp" variant="danger">Sign Out</b-list-group-item>
    </b-list-group>
  </div>
  `
})

Vue.component('navbar-footer', {
  template: `
  <div class="footer">
    <b-list-group style="cursor: pointer">
      <b-list-group-item variant="secondary" onclick="swal('Item unavailable :(')">Address</b-list-group-item>
      <b-list-group-item variant="secondary" onclick="swal('Item unavailable :(')">Social Media</b-list-group-item>
      <b-list-group-item variant="secondary" onclick="swal('Item unavailable :(')">Copyright</b-list-group-item>
    </b-list-group>
  </div>
  `
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