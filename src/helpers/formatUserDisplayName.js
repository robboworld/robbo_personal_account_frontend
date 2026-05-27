/** Display name from auth_userprofile.name (fullName). */
export const formatUserDisplayName = (user = {}) => {
    const fullName = String(user.fullName || '').trim()
    if (fullName) {
        return fullName
    }
    const parts = [user.lastname, user.firstname].filter(part => String(part || '').trim())
    return parts.join(' ').trim() || '—'
}
