/** LMS auth_user has first_name + last_name only (no patronymic). */
export const formatUserDisplayName = (user = {}) => {
    const parts = [user.lastname, user.firstname].filter(part => String(part || '').trim())
    return parts.join(' ').trim() || '—'
}
