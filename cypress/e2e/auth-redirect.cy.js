describe('protected routes', () => {
  it('send a signed-out visitor to the OIDC login with return_to', () => {
    // The redirect leaves the app origin: stub the backend start URL and assert the request.
    cy.intercept('GET', '**/auth/oidc/start*', { statusCode: 200, body: 'oidc start' }).as('oidcStart')
    cy.visit('/home', { failOnStatusCode: false })
    cy.wait('@oidcStart').its('request.url').should(url => {
      const params = new URL(url).searchParams
      expect(params.get('return_to')).to.match(/^\/home/)
    })
  })
})
