// Specs stub the backend (cy.intercept), so they run without the Go API or LMS.
beforeEach(() => {
  cy.intercept('GET', '**/auth/oidc/status', { authenticated: false }).as('oidcStatus')
})
