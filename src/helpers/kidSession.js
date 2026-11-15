// A child signed in through the class page (architecture/ADR_CLASS_KID_LOGIN.md). The ЛК keeps
// who they are and their class page in this browser, so "Выйти" and an expired session take
// them back to the class page instead of the LMS sign-in they cannot use. It is a UI hint
// only: it counts while the signed-in user is the same child.

const KEY = 'lk_kid_session'

export const rememberKidSession = ({ userId, name, avatar, classPage }) => {
  try {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({ userId: String(userId || ''), name, avatar, classPage }),
    )
  } catch {
    // storage blocked: the child is signed in all the same
  }
}

const read = () => {
  try {
    const value = JSON.parse(window.localStorage.getItem(KEY) || 'null')
    return value && typeof value === 'object' ? value : null
  } catch {
    return null
  }
}

const safeClassPage = page =>
  typeof page === 'string' && /^\/c\/[a-z0-9]+$/.test(page) ? page : null

/** The kid session of this user, or null. Without a user id: the last kid session here. */
export const getKidSession = userId => {
  const value = read()
  if (!value || !value.userId) return null
  if (userId !== undefined && String(userId) !== value.userId) return null
  return { ...value, classPage: safeClassPage(value.classPage) }
}

export const clearKidSession = () => {
  try {
    window.localStorage.removeItem(KEY)
  } catch {
    // nothing to clear
  }
}
