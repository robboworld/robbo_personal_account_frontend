#!/usr/bin/env node
/* eslint-disable no-console */
const { spawnSync } = require('child_process')

const major = Number(process.versions.node.split('.')[0])
const nodeArgs = major >= 17 ? ['--openssl-legacy-provider'] : []
const webpackArgs = process.argv.slice(2)

if (webpackArgs.length === 0) {
  console.error('Usage: node scripts/run-webpack.js <webpack-bin> [args...]')
  process.exit(1)
}

const [bin, ...rest] = webpackArgs
const result = spawnSync(process.execPath, [...nodeArgs, bin, ...rest], {
  stdio: 'inherit',
  env: process.env,
})

process.exit(result.status == null ? 1 : result.status)
