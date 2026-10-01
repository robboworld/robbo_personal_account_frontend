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
app.use('/static', express.static(path.join(__dirname, 'static')))

// Legacy /scratch links pointed at the editor; the hub is a separate LK route.
// Only the exact path (with or without trailing slash) and the query string is kept
// (legacy ?projectPageId=... links).
app.get(['/scratch', '/scratch/'], function (req, res) {
  const queryStart = req.originalUrl.indexOf('?')
  const query = queryStart >= 0 ? req.originalUrl.slice(queryStart) : ''
  res.redirect(302, '/scratch-hub' + query)
})

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(port)
