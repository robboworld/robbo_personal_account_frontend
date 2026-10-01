// server.js: hashed bundles are immutable, the app shell is revalidated, missing assets 404.
describe('static server', () => {
  it('serves index.html with no-cache and hashed bundles as immutable', () => {
    cy.request('/').then(res => {
      expect(res.headers['cache-control']).to.eq('no-cache')
      const [, bundle] = res.body.match(/src="(\/main\.[0-9a-f]{8}\.js)"/)
      cy.request(bundle).its('headers.cache-control').should('include', 'immutable')
    })
  })

  it('answers 404 for a missing chunk instead of the app shell', () => {
    cy.request({ url: '/999.deadbeef.js', failOnStatusCode: false }).its('status').should('eq', 404)
  })

  it('falls back to the app shell for client routes', () => {
    cy.request('/projects/123').its('headers.content-type').should('include', 'text/html')
  })
})
