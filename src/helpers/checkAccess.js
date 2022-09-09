// credentials - array of roles that are allowed to view the page

export function checkAccess(userRole, credentials) {
    return credentials.includes(userRole, 0)
}