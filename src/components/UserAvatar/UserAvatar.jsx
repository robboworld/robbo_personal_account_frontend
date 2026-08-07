import React from 'react'
import PropTypes from 'prop-types'

import { AvatarMark } from '@/components/AccountShell'
import { AuthorAvatar } from '@/components/ProjectCatalog/styles'
import { getAvatarSrc, isValidAvatarId } from '@/constants/avatars'

const getInitials = (displayName, fallback = '?') => {
  const source = (displayName || '').trim()
  if (!source) {
    return fallback
  }
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return source.slice(0, 2).toUpperCase()
}

/**
 * Renders a catalog avatar image when avatarId is valid; otherwise initials.
 * @param {'hero'|'compact'} variant
 */
const UserAvatar = ({
  avatarId = null,
  displayName = '',
  variant = 'hero',
  className,
  'aria-hidden': ariaHidden = true,
}) => {
  const src = isValidAvatarId(avatarId) ? getAvatarSrc(avatarId) : null
  const Wrapper = variant === 'compact' ? AuthorAvatar : AvatarMark

  return (
    <Wrapper className={className} aria-hidden={ariaHidden}>
      {src ? (
        <img src={src} alt='' />
      ) : (
        getInitials(displayName)
      )}
    </Wrapper>
  )
}

UserAvatar.propTypes = {
  avatarId: PropTypes.string,
  displayName: PropTypes.string,
  variant: PropTypes.oneOf(['hero', 'compact']),
  className: PropTypes.string,
  'aria-hidden': PropTypes.bool,
}

export default UserAvatar
