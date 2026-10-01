const path = require('path')

const express = require('express')


const app = express()
const port = process.env.PORT || 3000

// Webpack output names carry a content hash, so those files never change: cache them for a
// year. Everything else (index.html above all) is revalidated, so a deploy is picked up on
// the next load and the new index.html points at the new hashes.
const noCache = (res) => res.setHeader('Cache-Control', 'no-cache')
const HASHED_ASSET = /\.[0-9a-f]{8}\.(js|css)$|^\/?assets\//
const distHeaders = (res, filePath) => {
  const rel = path.relative(path.join(__dirname, 'dist'), filePath)
  if (HASHED_ASSET.test(rel)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
  } else {
    noCache(res)
  }
}

// Serve webpack build first — public/index.html has no <script> and would
// shadow dist/index.html for GET /, causing a blank white screen.
// index: false sends "/" to the SPA fallback below (same headers as every route).
app.use(express.static(path.join(__dirname, 'dist'), { index: false, setHeaders: distHeaders }))
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
