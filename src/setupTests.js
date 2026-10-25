// jsdom lacks these Node globals; react-router 7 needs them at import time.
const { TextDecoder, TextEncoder } = require('util')

global.TextEncoder = global.TextEncoder || TextEncoder
global.TextDecoder = global.TextDecoder || TextDecoder
