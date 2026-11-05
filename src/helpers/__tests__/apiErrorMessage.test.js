import { apiErrorMessage, apiErrorMessageId, classCodeErrorMessage } from '../apiErrorMessage'

const intl = { formatMessage: ({ id }) => `#${id}` }
const axiosError = (status, data) => ({ response: { status, data } })

describe('apiErrorMessage', () => {
  it('maps known backend codes', () => {
    expect(apiErrorMessageId(axiosError(403, { error: 'no access' }))).toBe('errors.no_access')
    expect(apiErrorMessageId(axiosError(409, { error: 'work_not_edited' }))).toBe(
      'errors.work_not_edited',
    )
    expect(apiErrorMessageId(axiosError(401, { error: 'input: token not found' }))).toBe(
      'errors.unauthorized',
    )
    expect(
      apiErrorMessageId({
        graphQLErrors: [{ message: 'legacy postgres is disabled (legacyPostgres.enabled=false)' }],
      }),
    ).toBe('errors.legacy_disabled')
  })

  it('reads a missing invite as a wrong class code, other failures as usual', () => {
    const fallback = 'join_class.not_found'
    expect(classCodeErrorMessage(axiosError(404, { error: 'not found' }), intl, fallback)).toBe(
      '#join_class.wrong_code',
    )
    expect(classCodeErrorMessage(axiosError(500, {}), intl, fallback)).toBe('#errors.server')
    expect(
      classCodeErrorMessage(axiosError(409, { error: 'already in class' }), intl, fallback),
    ).toBe('#errors.already_in_class')
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

  it('maps the handed-in homework lock from REST, fetch and GraphQL', () => {
    expect(
      apiErrorMessageId(axiosError(409, { error: 'HOMEWORK_LOCKED', code: 'HOMEWORK_LOCKED' })),
    ).toBe('errors.homework_locked')
    expect(apiErrorMessageId(new Error('HOMEWORK_LOCKED'))).toBe('errors.homework_locked')
    expect(apiErrorMessageId({ graphQLErrors: [{ message: 'HOMEWORK_LOCKED' }] })).toBe(
      'errors.homework_locked',
    )
  })

  it('maps the file cloud codes', () => {
    const cases = [
      [415, 'FILE_TYPE_NOT_ALLOWED', 'errors.file_type_not_allowed'],
      [409, 'FILE_SIZE_EXCEEDED', 'errors.file_too_large'],
      [409, 'STORAGE_QUOTA_EXCEEDED', 'errors.storage_quota_exceeded'],
      [409, 'FILE_COUNT_EXCEEDED', 'errors.file_count_exceeded'],
      [415, 'FILE_CONTENT_NOT_ALLOWED', 'errors.file_content_not_allowed'],
      [429, 'TOO_MANY_UPLOADS', 'errors.too_many_uploads'],
      [429, 'UPLOAD_RATE_LIMITED', 'errors.upload_rate_limited'],
      [507, 'STORAGE_UNAVAILABLE', 'errors.storage_unavailable'],
      [404, 'FILE_NOT_FOUND', 'errors.not_found'],
    ]
    cases.forEach(([status, code, id]) => {
      expect(apiErrorMessageId(axiosError(status, { error: 'some text', code }))).toBe(id)
    })
    // A 415 without a code (e.g. from a proxy) still names the problem.
    expect(apiErrorMessageId(axiosError(415, ''))).toBe('errors.file_type_not_allowed')
  })

  it('maps the admin moderation codes', () => {
    expect(
      apiErrorMessageId(axiosError(400, { error: 'reason required', code: 'REASON_REQUIRED' })),
    ).toBe('errors.reason_required')
    expect(apiErrorMessageId(axiosError(404, { error: 'not found', code: 'NOT_FOUND' }))).toBe(
      'errors.not_found',
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
