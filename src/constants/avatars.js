export const AVATAR_CATALOG = [
  { id: 'ava1', src: '/avatars/ava1.png', labelKey: 'customization.avatar.ava1' },
  { id: 'ava2', src: '/avatars/ava2.png', labelKey: 'customization.avatar.ava2' },
  { id: 'ava3', src: '/avatars/ava3.png', labelKey: 'customization.avatar.ava3' },
  { id: 'ava4', src: '/avatars/ava4.png', labelKey: 'customization.avatar.ava4' },
]

export const AVATAR_IDS = AVATAR_CATALOG.map(item => item.id)

export const isValidAvatarId = id => (
  typeof id === 'string' && AVATAR_IDS.includes(id)
)

export const getAvatarSrc = id => {
  if (!isValidAvatarId(id)) {
    return null
  }
  return AVATAR_CATALOG.find(item => item.id === id)?.src ?? null
}
