import { apiErrorMessage, apiErrorMessageId } from '../apiErrorMessage'

const intl = { formatMessage: ({ id }) => `#${id}` }
const axiosError = (status, data) => ({ response: { status, data } })

describe('apiErrorMessage', () => {
  it('maps known backend codes', () => {
    expect(apiErrorMessageId(axiosError(403, { error: 'no access' }))).toBe('errors.no_access')
    expect(apiErrorMessageId(axiosError(401, { error: 'input: token not found' }))).toBe(
      'errors.unauthorized',
    )
    expect(
      apiErrorMessageId({
        graphQLErrors: [{ message: 'legacy postgres is disabled (legacyPostgres.enabled=false)' }],
      }),
    ).toBe('errors.legacy_disabled')
  })

  it('maps the project size limit from REST, fetch and GraphQL', () => {
    expect(
      apiErrorMessageId(
        axiosError(409, { error: 'PROJECT_SIZE_EXCEEDED', code: 'PROJECT_SIZE_EXCEEDED' }),
      ),
    ).toBe('errors.too_large')
    expect(apiErrorMessageId(new Error('PROJECT_SIZE_EXCEEDED'))).toBe('errors.too_large')
    expect(apiErrorMessageId({ graphQLErrors: [{ message: 'PROJECT_SIZE_EXCEEDED' }] })).toBe(
      'errors.too_large',
    )
  })

  it('never shows a technical Go error', () => {
    const goError = axiosError(500, {
      error:
        'Post "https://edx-test.ru/oauth2/access_token": dial tcp: lookup edx-test.ru: server misbehaving',
    })
    expect(apiErrorMessage(goError, intl)).toBe('#errors.server')
    expect(apiErrorMessage(axiosError(400, { error: 'strconv.Atoi: parsing "x"' }), intl)).toBe(
      '#errors.generic',
    )
  })

  it('keeps a human Russian message from the backend', () => {
    expect(
      apiErrorMessage(axiosError(400, { error: 'Комментарий содержит недопустимые слова' }), intl),
    ).toBe('Комментарий содержит недопустимые слова')
  })

  it('recognises network failures and uses the caller fallback', () => {
    expect(apiErrorMessageId({ code: 'ERR_NETWORK', message: 'Network Error' })).toBe(
      'errors.network',
    )
    expect(apiErrorMessage(new Error('weird'), intl, 'teacher_class.create_failed')).toBe(
      '#teacher_class.create_failed',
    )
  })
})
