let accessToken = ''

const hydrateFromLegacyStorage = () => {
  try {
    const stored = localStorage.getItem('token')
    if (stored) {
      accessToken = stored
      localStorage.removeItem('token')
    }
  } catch {
    // private mode
  }
}

hydrateFromLegacyStorage()

export const getAccessToken = () => accessToken || ''

export const setAccessToken = token => {
  accessToken = token || ''
  try {
    localStorage.removeItem('token')
  } catch {
    // ignore
  }
}

export const clearAccessToken = () => {
  accessToken = ''
  try {
    localStorage.removeItem('token')
  } catch {
    // ignore
  }
}
