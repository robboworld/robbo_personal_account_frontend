export const AVATAR_CATALOG = [
  { id: 'ava1', src: '/avatars/ava1.png', labelKey: 'customization.avatar.ava1' },
  { id: 'ava2', src: '/avatars/ava2.png', labelKey: 'customization.avatar.ava2' },
  ...['ava3', 'ava4', 'ava5', 'ava6', 'ava7', 'ava8', 'ava9', 'ava10'].map(id => ({
    id,
    src: `/avatars/${id}.svg`,
    labelKey: `customization.avatar.${id}`,
  })),
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
