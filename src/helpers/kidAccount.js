import { getKidSession } from './kidSession'
import { useCurrentUser } from './useAuthRole'

// An account a teacher made for a young student (architecture/ADR_CLASS_KID_LOGIN.md). The ЛК
// gives it the address <username>@kids.robbo.invalid and no password: it signs in only on the
// class page. Such a child sees what a full account adds, set up on a parent's email.

export const KID_EMAIL_DOMAIN = 'kids.robbo.invalid'

export const isKidAccountEmail = email =>
  typeof email === 'string' && email.trim().toLowerCase().endsWith(`@${KID_EMAIL_DOMAIN}`)

/** Sections a kid account does not have: shown locked, they lead to the full-account page. */
export const KID_LOCKED_NAV_KEYS = new Set(['lms', 'my_licenses'])

/** Sections a kid account does not need at all. */
export const KID_HIDDEN_NAV_KEYS = new Set(['my_sessions'])

/** The session's email (from the server) first; the class sign-in mark of this browser second. */
export const useIsKidAccount = () => {
  const { id, email } = useCurrentUser()
  return isKidAccountEmail(email) || Boolean(id && getKidSession(id))
}
