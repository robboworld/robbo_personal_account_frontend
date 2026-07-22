import instance from './instance'

/**
 * Admin LMS username typeahead.
 * @param {string} q
 * @param {number} [limit=20]
 * @returns {Promise<Array<{id:string,username:string,email:string,fullName:string}>>}
 */
export async function searchLmsUsers(q, limit = 20) {
  const query = String(q || '').trim()
  if (!query) {
    return []
  }
  const { data } = await instance.get('api/users/search', {
    params: { q: query, limit },
    withCredentials: true,
  })
  return data?.items || []
}
