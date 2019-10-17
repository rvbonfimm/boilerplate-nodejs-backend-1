const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const LokiStore = require('connect-loki')(session)
const dotenv = require('dotenv')
const mongoose = require('mongoose')

const app = express()

dotenv.config()

mongoose.connect(
  process.env.DB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }
)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(
  session({
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    expires: new Date(Date.now() + 3600000),
    resave: false,
    store: new LokiStore({
      path: path.resolve(__dirname, 'session', 'session.db')
    }),
    saveUninitialized: false
  })
)

app.use(require('./routes'))

module.exports = app
