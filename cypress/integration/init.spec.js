
describe('Check app', () => {
  it('Check login page', () => {
    cy.visit('/login')
      .get('[data-cy=input]')
      .first()
      .type('rupychAdmin')
      .get('[data-cy=input]')
      .eq(1)
      .type('12345')
      .get('[data-cy=select]')
      .click()
      .get('#react-select-2-option-5')
      .click()
      .get('[data-cy=button]')
    // .click()
  })
  it('Check home page', () => {
    cy.server()
    cy.request('POST', 'http://localhost:8000/auth/sign-in/', { email: 'rupychAdmin', password: '12345', role: 5 })
      .then(response => {
        expect(response.status).to.eq(200)

      })
    // cy.visit('http://localhost:3000/home')
  })
})


