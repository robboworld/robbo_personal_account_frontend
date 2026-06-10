#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')

const LANG_DIR = path.join(__dirname, '../src/lang')
const LOCALES = ['ru', 'en', 'zh']

function loadLocale(code) {
  const filePath = path.join(LANG_DIR, `${code}.json`)
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function realKeys(messages) {
  return Object.keys(messages).filter(k => !k.startsWith('/'))
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

  if (failed) {
    process.exit(1)
  }

  console.log(`i18n OK: ${LOCALES.map(l => `${l}=${keySets[l].size}`).join(', ')}`)
}

main()
