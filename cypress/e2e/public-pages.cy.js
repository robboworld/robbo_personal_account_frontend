const project = (id, title) => ({
  projectPageId: String(id),
  title,
  authorName: `Author ${id}`,
  preview: '',
  lastModified: '2026-09-01T00:00:00Z',
})

describe('public pages', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.intercept('GET', '**/projectPage/public*featured=landing*', {
      projectPages: [project(1, 'Robot dance'), project(2, 'Space quiz')],
      countRows: 2,
    }).as('featured')
  })

  it('landing shows featured projects and opens one', () => {
    cy.visit('/')
    cy.contains('h1', 'Придумывай истории, игры и анимации')
    cy.wait('@featured')
    cy.contains('button', 'Robot dance').click()
    cy.location('pathname').should('eq', '/projects/1')
  })

  it('guest header switches the interface to English and back', () => {
    cy.visit('/')
    cy.get('header').contains('button', 'EN').click()
    cy.contains('h1', 'Create stories, games and animations')
    cy.title().should('eq', 'ROBBO — create stories, games and animations')

    cy.reload()
    cy.contains('h1', 'Create stories, games and animations')

    cy.get('header').contains('button', 'RU').click()
    cy.contains('h1', 'Придумывай истории, игры и анимации')
  })

  it('explore filters by category through the query string', () => {
    cy.intercept('GET', '**/projectPage/public*', req => {
      const tag = new URL(req.url).searchParams.get('tag')
      req.reply({
        projectPages: tag === 'games' ? [project(3, 'Maze game')] : [project(1, 'Robot dance')],
        countRows: 1,
      })
    }).as('explore')
    cy.visit('/explore')
    cy.wait('@explore')
    cy.contains('Robot dance')
    cy.contains('button', 'Игры').click()
    cy.location('search').should('eq', '?tag=games')
    cy.wait('@explore').its('request.url').should('include', 'tag=games')
    cy.contains('Maze game')
  })
})
