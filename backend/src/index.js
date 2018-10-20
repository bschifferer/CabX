const express = require('express')
var bodyParser = require('body-parser')

const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/users/:userId/books/:bookId', function (req, res) {
  res.send(req.params)
})

app.use(bodyParser.json())

app.post('/jsonendpoint/', function (req, res) {
  console.log(req.body)
  res.send(req.body)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
