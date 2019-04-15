const { OAuth2Client } = require('google-auth-library')

module.exports = {
  verify: function(id_token) {
    // console.log(process.env.GOOGLE_CLIENT_ID)
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
    return client.verifyIdToken({
      id_token: id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    })
  }
}