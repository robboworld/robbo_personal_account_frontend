// Signed-in fixtures: a stubbed BFF session plus GraphQL/REST responses by operation.
export const STUDENT = { id: '7', role: 0, email: 'alice@example.com', fullName: 'Alice Example' }

const userHttp = user => ({
  __typename: 'UserHttp',
  id: user.id,
  fullName: user.fullName,
  lastname: 'Example',
  firstname: 'Alice',
  middlename: '',
  nickname: 'alice',
  email: user.email,
  bio: null,
  avatarId: null,
  levelOfEducation: null,
  country: null,
  yearOfBirth: null,
  gender: null,
  language: null,
  createdAt: '2026-01-01T00:00:00Z',
  role: user.role,
})

export const GRAPHQL_FIXTURES = {
  GetUser: () => ({
    GetUser: { __typename: 'StudentHttp', userHttp: userHttp(STUDENT), robboGroupId: '', robboUnitId: '' },
  }),
  UpdateStudent: variables => ({
    UpdateStudent: {
      __typename: 'StudentHttp',
      userHttp: { ...userHttp(STUDENT), fullName: variables.input.fullName },
    },
  }),
  GetAllProjectPagesByAccessToken: () => ({
    GetAllProjectPagesByAccessToken: {
      __typename: 'ProjectPageHttpList',
      projectPages: [
        { __typename: 'ProjectPageHttp', title: 'Robot dance', linkScratch: '', projectPageId: '1', projectId: '11', lastModified: '2026-09-01T00:00:00Z', preview: '' },
        { __typename: 'ProjectPageHttp', title: 'Space quiz', linkScratch: '', projectPageId: '2', projectId: '12', lastModified: '2026-09-02T00:00:00Z', preview: '' },
      ],
      countRows: 2,
    },
  }),
}

const REST_FIXTURES = [
  [/\/api\/notifications\/unread-count/, { count: 0 }],
  [/\/licensing\/mine/, { licenses: [] }],
  [/\/licensing\/entitlements/, { plan: 'free', maxDevices: 1, maxSessions: 1 }],
  [/\/payments\/products/, { products: [] }],
  [/\/auth\/sessions/, { sessions: [] }],
  [/\/api\/student\/classes/, { classes: [] }],
]

/** Stubs the backend as a signed-in user; returns the GraphQL operation names seen. */
export function signInAs (user = STUDENT) {
  const operations = []
  cy.intercept({ url: 'http://localhost:8080/**' }, req => {
    const op = req.body && req.body.operationName
    if (op) {
      operations.push(op)
      const fixture = GRAPHQL_FIXTURES[op]
      req.reply({ data: fixture ? fixture(req.body.variables || {}) : null })
      return
    }
    const rest = REST_FIXTURES.find(([pattern]) => pattern.test(req.url))
    req.reply(rest ? rest[1] : {})
  })
  cy.intercept('GET', '**/auth/oidc/status', {
    authenticated: true, role: user.role, edx_user_id: user.id, sub: user.id, email: user.email, legacy_auth: false,
  })
  return operations
}
