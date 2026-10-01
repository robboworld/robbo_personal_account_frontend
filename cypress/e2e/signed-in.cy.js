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

  it('a directly opened page highlights its own menu item (SSO session, no token)', () => {
    signInAs()
    cy.visit('/licenses')
    cy.get('.ant-menu-item-selected').should('contain', 'Мои тарифы')
  })

  it('sessions show readable sign-in methods', () => {
    signInAs()
    cy.intercept('GET', '**/auth/sessions', {
      sessions: [
        { id: 's1', authMode: 'oidc_bff', userAgent: 'Firefox', isCurrent: true },
        { id: 's2', authMode: 'lms_db', userAgent: 'Chrome' },
        { id: 's3', authMode: 'something_new', userAgent: 'Safari' },
      ],
    })
    cy.visit('/sessions')
    cy.contains('Вход через LMS')
    cy.contains('Вход по паролю LMS')
    cy.contains('Сессия')
    cy.get('body').should('not.contain', 'oidc_bff').and('not.contain', 'lms_db')
  })

  it('sidebar hides legacy database sections', () => {
    signInAs({ ...STUDENT, role: 5 })
    cy.visit('/profile')
    cy.contains('Выдать тариф') // a SuperAdmin item: the menu has rendered
    cy.get('body').should('not.contain', 'Клиенты')
  })

  describe('project page actions give feedback', () => {
    const page = {
      projectPageId: 'p1',
      projectId: 'pr1',
      title: 'Robot dance',
      instruction: '',
      notes: '',
      isShared: false,
      isOwner: true,
      authorUserId: STUDENT.id,
      tags: [],
      preview: '',
      lastModified: '2026-09-01T00:00:00Z',
    }

    beforeEach(() => {
      signInAs()
      cy.intercept('GET', '**/projectPage/p1', { projectPage: page, playToken: null }).as('page')
    })

    it('save shows a spinner and a confirmation', () => {
      cy.intercept('PUT', '**/projectPage/', req => {
        req.reply({ delay: 400, body: {} })
      }).as('save')
      cy.visit('/projects/p1')
      cy.contains('button', 'Сохранить').click()
      cy.contains('button', 'Сохранить').should('have.class', 'ant-btn-loading')
      cy.wait('@save')
      cy.contains('Изменения сохранены.')
    })

    it('save reports a failure', () => {
      cy.intercept('PUT', '**/projectPage/', { statusCode: 500, body: { error: 'storage unavailable' } })
      cy.visit('/projects/p1')
      cy.contains('button', 'Сохранить').click()
      cy.contains('storage unavailable')
    })

    it('publish shows a spinner and the result', () => {
      cy.intercept('PUT', '**/projectPage/', req => {
        req.reply({ delay: 400, body: {} })
      }).as('publish')
      cy.visit('/projects/p1')
      cy.contains('button', 'Опубликовать проект').click()
      cy.contains('button', 'Опубликовать проект').should('have.class', 'ant-btn-loading')
      cy.wait('@publish').its('request.body.projectPage.isShared').should('eq', true)
      cy.contains('Проект опубликован.')
    })
  })
})
