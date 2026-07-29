import instance from './instance'

/**
 * Admin LMS username typeahead.
 * @param {string} q
 * @param {number} [limit=20]
 * @param {{ includeInactive?: boolean }} [opts]
 * @returns {Promise<Array<{id:string,username:string,email:string,fullName:string,isActive:boolean,role:number}>>}
 */
export async function searchLmsUsers(q, limit = 20, opts = {}) {
  const query = String(q || '').trim()
  if (!query) {
    return []
  }
  const params = { q: query, limit }
  if (opts.includeInactive) {
    params.includeInactive = true
  }
  const { data } = await instance.get('api/users/search', {
    params,
    withCredentials: true,
  })
  return data?.items || []
}

/**
 * @param {string} lmsUserId
 * @returns {Promise<{isBanned:boolean, activeBan:object|null}>}
 */
export async function getUserBanStatus(lmsUserId) {
  const { data } = await instance.get(`api/users/${encodeURIComponent(lmsUserId)}/ban`, {
    withCredentials: true,
  })
  return data
}

/**
 * @param {string} lmsUserId
 * @param {number} [limit=20]
 */
export async function getUserBanHistory(lmsUserId, limit = 20) {
  const { data } = await instance.get(`api/users/${encodeURIComponent(lmsUserId)}/ban/history`, {
    params: { limit },
    withCredentials: true,
  })
  return data?.items || []
}

/**
 * @param {string} lmsUserId
 * @param {{ reason: string, expiresAt?: string|null }} body
 */
export async function banUser(lmsUserId, body) {
  const { data } = await instance.post(
    `api/users/${encodeURIComponent(lmsUserId)}/ban`,
    {
      reason: body.reason,
      expiresAt: body.expiresAt || null,
    },
    { withCredentials: true },
  )
  return data
}

/**
 * @param {string} lmsUserId
 * @param {{ reason?: string }} [body]
 */
export async function unbanUser(lmsUserId, body = {}) {
  const { data } = await instance.post(
    `api/users/${encodeURIComponent(lmsUserId)}/unban`,
    { reason: body.reason || '' },
    { withCredentials: true },
  )
  return data
}
