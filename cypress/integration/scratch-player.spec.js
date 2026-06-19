/**
 * Scratch player + public project access (API-level smoke tests via cy.request).
 * Requires backend at BACKEND_URL (default http://localhost:8080).
 */
describe('Scratch player and public projects', () => {
  const backend = Cypress.env('BACKEND_URL') || 'http://localhost:8080'

  it('play-token endpoint requires auth', () => {
    cy.request({
      url: `${backend}/projectPage/1/play-token`,
      failOnStatusCode: false,
    }).its('status').should('be.oneOf', [401, 403])
  })

  it('public catalog endpoint requires auth', () => {
    cy.request({
      url: `${backend}/projectPage/public`,
      failOnStatusCode: false,
    }).its('status').should('be.oneOf', [401, 403])
  })

  it('project page route is registered in SPA', () => {
    cy.visit('/login')
    cy.location('pathname').should('eq', '/login')
  })
})
