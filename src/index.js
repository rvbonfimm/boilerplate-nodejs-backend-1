const app = require('./app')

app.listen(process.env.APP_PORT, () => {
  console.log(`Application running at http://localhost:${process.env.APP_PORT}`)
})
