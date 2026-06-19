import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useLocation } from 'react-router-dom'

import {
  HeaderNav,
  HeaderNavAction,
  HeaderNavButton,
  HeaderNavLink,
} from './headerExploreStyles'

import { PUBLIC_PROJECTS_ROUTE } from '@/constants'
import { openLms } from '@/helpers/lmsSso'


const SCRATCH_CREATE_URL = 'https://scratch.ru/'

export default function HeaderExploreNav() {
  const location = useLocation()
  const isExploreActive = location.pathname === PUBLIC_PROJECTS_ROUTE

  const handleLmsClick = async () => {
    await openLms()
  }

  return (
    <HeaderNav aria-label='Header navigation'>
      <HeaderNavButton
        href={SCRATCH_CREATE_URL}
        target='_blank'
        rel='noopener noreferrer'
      >
        <FormattedMessage id='header.create' />
      </HeaderNavButton>
      <HeaderNavLink
        to={PUBLIC_PROJECTS_ROUTE}
        state={{ selectedNavBarKey: 'public_projects' }}
        data-active={isExploreActive ? 'true' : 'false'}
      >
        <FormattedMessage id='header.explore' />
      </HeaderNavLink>
      <HeaderNavAction type='button' onClick={handleLmsClick}>
        <FormattedMessage id='sidebar_data.lms' />
      </HeaderNavAction>
    </HeaderNav>
  )
}
