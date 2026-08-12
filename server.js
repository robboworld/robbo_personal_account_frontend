const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')


const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())
// Serve webpack build first — public/index.html has no <script> and would
// shadow dist/index.html for GET /, causing a blank white screen.
app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(port)
