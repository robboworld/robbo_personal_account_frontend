#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')

const LANG_DIR = path.join(__dirname, '../src/lang')
const SRC_DIR = path.join(__dirname, '../src')
// Static message ids in code: id='x.y', id: 'x.y', formatMessageId(lang, 'x.y').
const ID_PATTERN = /(?:\bid\s*[=:]\s*\{?\s*|formatMessageId\([^,]+,\s*)['"]([a-z][\w-]*(?:\.[\w-]+)+)['"]/g
const LOCALES = ['ru', 'en']

function loadLocale(code) {
  const filePath = path.join(LANG_DIR, `${code}.json`)
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function realKeys(messages) {
  return Object.keys(messages).filter(k => !k.startsWith('/'))
}

function listSourceFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return listSourceFiles(full)
    return /\.(js|jsx)$/.test(entry.name) ? [full] : []
  })
}

function idsUsedInCode() {
  const used = new Map()
  listSourceFiles(SRC_DIR).forEach(file => {
    const text = fs.readFileSync(file, 'utf8')
    for (const match of text.matchAll(ID_PATTERN)) {
      if (!used.has(match[1])) used.set(match[1], path.relative(SRC_DIR, file))
    }
  })
  return used
}

function main() {
  const byLocale = Object.fromEntries(LOCALES.map(code => [code, loadLocale(code)]))
  const keySets = Object.fromEntries(
    LOCALES.map(code => [code, new Set(realKeys(byLocale[code]))]),
  )

  let failed = false

  LOCALES.forEach(base => {
    LOCALES.forEach(other => {
      if (base === other) return
      const missing = [...keySets[base]].filter(k => !keySets[other].has(k))
      if (missing.length) {
        failed = true
        console.error(`\n[${other}.json] missing ${missing.length} key(s) vs ${base}.json:`)
        missing.slice(0, 20).forEach(k => console.error(`  - ${k}`))
        if (missing.length > 20) {
          console.error(`  ... and ${missing.length - 20} more`)
        }
      }
    })
  })

  // Ids used in code but missing from every locale render the English defaultMessage
  // (or the raw id) in the Russian UI.
  const missingEverywhere = [...idsUsedInCode()].filter(([id]) => LOCALES.every(code => !keySets[code].has(id)))
  if (missingEverywhere.length) {
    failed = true
    console.error(`\n${missingEverywhere.length} id(s) used in code are missing from all locales:`)
    missingEverywhere.slice(0, 40).forEach(([id, file]) => console.error(`  - ${id} (${file})`))
  }

  if (failed) {
    process.exit(1)
  }

  console.log(`i18n OK: ${LOCALES.map(l => `${l}=${keySets[l].size}`).join(', ')}`)
}

main()
