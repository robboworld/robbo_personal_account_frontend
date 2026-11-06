// jsdom lacks these Node globals; react-router 7 needs them at import time.
const { TextDecoder, TextEncoder } = require('util')

global.TextEncoder = global.TextEncoder || TextEncoder
global.TextDecoder = global.TextDecoder || TextDecoder

// antd puts ~2000 rules into the document. jsdom's getComputedStyle, which getByRole calls for an
// element and its parents, tries all of them each time, and over 1000 distinct selectors defeat
// the nwsapi selector cache, so each rule is compiled anew: seconds per query, over a minute per
// test. Tests need none of the look, only what antd hides with a class.
jest.mock('@rc-component/util/lib/Dom/dynamicCSS', () => {
  const dynamicCSS = jest.requireActual('@rc-component/util/lib/Dom/dynamicCSS')
  return { ...dynamicCSS, updateCSS: (css, ...rest) => dynamicCSS.updateCSS('', ...rest) }
})

// Not there in tests with @jest-environment node.
if (typeof document !== 'undefined') {
  const antdHidden = document.createElement('style')
  antdHidden.textContent = "[class*='ant-'][class*='-hidden'] { display: none }"
  document.head.append(antdHidden)
}
