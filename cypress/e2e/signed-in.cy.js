import { STUDENT, signInAs } from '../support/session'

describe('signed-in pages (stubbed session)', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
  })

  it('profile shows the user from GetUser', () => {
    signInAs()
    cy.visit('/profile')
    cy.location('pathname').should('eq', '/profile')
    cy.get(`input[value="${STUDENT.email}"]`).should('exist')
  })

  it('profile saves through UpdateStudent and reloads GetUser', () => {
    const operations = signInAs()
    cy.visit('/profile')
    cy.get(`input[value="${STUDENT.email}"]`).should('exist')
    cy.contains('label', 'Полное имя').invoke('attr', 'for').then(id => {
      cy.get(`[id="${id}"]`).clear().type('Alice Renamed')
    })
    cy.contains('button', 'Сохранить').click()
    cy.contains('Профиль успешно обновлен').should('exist')
    cy.wrap(operations).should(ops => {
      const save = ops.indexOf('UpdateStudent')
      expect(save, 'UpdateStudent sent').to.be.greaterThan(-1)
      expect(ops.slice(save + 1), 'GetUser refetched').to.include('GetUser')
    })
  })

  it('my projects lists the projects', () => {
    signInAs()
    cy.visit('/myprojects')
    cy.contains('Robot dance')
    cy.contains('Space quiz')
  })

  it('licenses and classes pages render without the error screen', () => {
    signInAs()
    for (const path of ['/licenses', '/myclasses', '/home']) {
      cy.visit(path)
      cy.location('pathname').should('eq', path)
      cy.get('#root').should('not.be.empty')
      cy.contains(/что-то пошло не так|something went wrong/i).should('not.exist')
    }
  })

  it('sidebar hides legacy database sections', () => {
    signInAs({ ...STUDENT, role: 5 })
    cy.visit('/profile')
    cy.contains('Выдать тариф') // a SuperAdmin item: the menu has rendered
    cy.get('body').should('not.contain', 'Клиенты')
  })
})
