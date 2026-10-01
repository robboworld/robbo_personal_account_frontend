const path = require('path')

const express = require('express')


const app = express()
const port = process.env.PORT || 3000

// Bundles are not content-hashed (bundle.js, N.bundle.js), so browsers must revalidate
// (ETag) on every load; otherwise a cached bundle.js asks for chunks of an older build.
const noCache = (res) => res.setHeader('Cache-Control', 'no-cache')

// Serve webpack build first — public/index.html has no <script> and would
// shadow dist/index.html for GET /, causing a blank white screen.
// index: false sends "/" to the SPA fallback below (same headers as every route).
app.use(express.static(path.join(__dirname, 'dist'), { index: false, setHeaders: noCache }))
app.use(express.static(path.join(__dirname, 'public'), { index: false }))
app.use('/static', express.static(path.join(__dirname, 'static')))

// Legacy /scratch links pointed at the editor; the hub is a separate LK route.
// Only the exact path (with or without trailing slash) and the query string is kept
// (legacy ?projectPageId=... links).
app.get(['/scratch', '/scratch/'], function (req, res) {
  const queryStart = req.originalUrl.indexOf('?')
  const query = queryStart >= 0 ? req.originalUrl.slice(queryStart) : ''
  res.redirect(302, '/scratch-hub' + query)
})

// A missing asset must be a 404, not index.html: the HTML "chunk" fails to parse and
// webpack reports a confusing ChunkLoadError instead of a missing file.
const ASSET_PATH = /\.(js|mjs|css|map|json|txt|png|jpe?g|gif|svg|webp|ico|woff2?|ttf|eot|wasm|sb3)$/i
app.get(ASSET_PATH, function (req, res) {
  res.sendStatus(404)
})

app.get('/*', function (req, res) {
  noCache(res)
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(port)
