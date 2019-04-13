require('dotenv').config({path: './.env'})
const express = require('express')
const app = express()
const route = require('./routes/index')
const mongoose = require('mongoose')
const cors = require('cors')

let dbUrl = 'mongodb://localhost:27017/miniWP'
mongoose.connect(dbUrl, {useNewUrlParser: true})
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/', route)

app.listen(3000, () => {console.log(`Listening on port 3000!`)})