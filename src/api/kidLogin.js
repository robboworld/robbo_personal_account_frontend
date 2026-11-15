import instance from './instance'

// Class sign-in for young students: architecture/ADR_CLASS_KID_LOGIN.md.

const classPath = classId => `/api/teacher/classes/${encodeURIComponent(classId)}`

export const listKids = classId => instance.get(`${classPath(classId)}/kids`)

/** body: { names: string[], consent: boolean } */
export const createKids = (classId, body) => instance.post(`${classPath(classId)}/kids`, body)

/** The tokens come once: the cards printed before stop working. */
export const issueKidCards = (classId, userIds) =>
  instance.post(`${classPath(classId)}/kids/cards`, { userIds })

export const resetKidPictures = (classId, kidId) =>
  instance.post(`${classPath(classId)}/kids/${encodeURIComponent(kidId)}/pictures`)

export const unlockKid = (classId, kidId) =>
  instance.post(`${classPath(classId)}/kids/${encodeURIComponent(kidId)}/unlock`)

export const returnKid = (classId, kidId) =>
  instance.post(`${classPath(classId)}/kids/${encodeURIComponent(kidId)}/return`)

export const openKidLogin = (classId, minutes) =>
  instance.post(`${classPath(classId)}/kid-login/open`, { minutes })

export const closeKidLogin = classId => instance.post(`${classPath(classId)}/kid-login/close`)

// Public: the class page and the two ways in.
export const getClassLoginPage = slug =>
  instance.get(`/api/class-login/${encodeURIComponent(slug)}`)

export const loginWithPictures = (slug, userId, pictures) =>
  instance.post(`/api/class-login/${encodeURIComponent(slug)}`, { userId, pictures })

/** The six digits on the projector → { classPage }. */
export const getRoomByCode = code =>
  instance.get(`/api/class-login/code/${encodeURIComponent(code)}`)

export const loginWithCard = token => instance.post('/api/class-login/card', { token })
