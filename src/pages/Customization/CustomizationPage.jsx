import React, { useCallback, useEffect, useState } from 'react'
import { Button, Spin, message } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import { FormattedMessage, useIntl } from 'react-intl'
import { motion } from 'framer-motion'
import styled from 'styled-components'
import { useQuery } from '@apollo/client'

import {
  HeroInner,
  HeroLead,
  HeroPanel,
  HeroTitle,
  PageContent,
  Panel,
  SectionHint,
  SectionTitle,
  Stagger,
  staggerContainer,
  staggerItem,
  surface,
} from '@/components/AccountShell'
import UserAvatar from '@/components/UserAvatar/UserAvatar'
import { AVATAR_CATALOG } from '@/constants/avatars'
import { avatarMutationsGraphQL } from '@/graphQL/mutation/avatar'
import { profileGQL } from '@/graphQL/query/profile'
import theme from '@/theme'

const { colors } = theme

const PreviewRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`

const AvatarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(7.5rem, 1fr));
  gap: 0.875rem;
`

const AvatarCard = styled.button`
  appearance: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 1rem;
  border: 2px solid ${props => (props.$selected ? colors.accentGreen : surface.line)};
  background: ${surface.card};
  cursor: pointer;
  transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
  position: relative;

  &:hover {
    border-color: ${colors.accentGreen};
    box-shadow: ${surface.shadowHover};
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid ${colors.accentGreen};
    outline-offset: 2px;
  }

  img {
    width: 4.5rem;
    height: 4.5rem;
    border-radius: 1rem;
    object-fit: cover;
    display: block;
  }
`

const SelectedBadge = styled.span`
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  width: 1.35rem;
  height: 1.35rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${colors.accentGreen};
  color: ${colors.white};
  font-size: 0.7rem;
`

const AvatarLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${surface.muted};
`

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.25rem;
`

const CustomizationPage = () => {
  const intl = useIntl()
  const { data, loading, refetch } = useQuery(profileGQL.GET_USER, {
    fetchPolicy: 'cache-and-network',
  })
  const [selectedId, setSelectedId] = useState(null)
  const [saving, setSaving] = useState(false)

  const profile = data?.GetUser?.userHttp || null

  useEffect(() => {
    if (profile) {
      setSelectedId(profile.avatarId || null)
    }
  }, [profile])

  const displayName = profile?.fullName || profile?.nickname || profile?.email || ''

  const persist = useCallback(async avatarId => {
    setSaving(true)
    try {
      await avatarMutationsGraphQL.SetUserAvatar(avatarId)
      setSelectedId(avatarId || null)
      await refetch()
      message.success(intl.formatMessage({ id: 'customization.saved' }))
    } catch (err) {
      message.error(err?.message || intl.formatMessage({ id: 'customization.save_error' }))
    } finally {
      setSaving(false)
    }
  }, [intl, refetch])

  const onSelect = avatarId => {
    if (saving || avatarId === selectedId) {
      return
    }
    persist(avatarId)
  }

  const onReset = () => {
    if (saving || !selectedId) {
      return
    }
    persist(null)
  }

  return (
    <PageContent>
      <Stagger
        variants={staggerContainer}
        initial='hidden'
        animate='show'
      >
        <HeroPanel variants={staggerItem}>
          <HeroInner>
            <HeroTitle>
              <FormattedMessage id='customization.title' />
            </HeroTitle>
            <HeroLead>
              <FormattedMessage id='customization.subtitle' />
            </HeroLead>
          </HeroInner>
        </HeroPanel>

        <Panel as={motion.section} variants={staggerItem}>
          <SectionTitle>
            <FormattedMessage id='customization.current' />
          </SectionTitle>
          <SectionHint>
            <FormattedMessage id='customization.current_hint' />
          </SectionHint>
          {loading && !profile ? (
            <Spin />
          ) : (
            <PreviewRow>
              <UserAvatar
                avatarId={selectedId}
                displayName={displayName}
                variant='hero'
              />
              <div>
                <strong>{displayName || '—'}</strong>
                <div style={{ color: surface.muted, fontSize: '0.875rem' }}>
                  {selectedId
                    ? intl.formatMessage({ id: 'customization.selected' }, { id: selectedId })
                    : intl.formatMessage({ id: 'customization.using_initials' })}
                </div>
              </div>
            </PreviewRow>
          )}

          <SectionTitle>
            <FormattedMessage id='customization.pick' />
          </SectionTitle>
          <AvatarGrid>
            {AVATAR_CATALOG.map(item => {
              const selected = selectedId === item.id
              return (
                <AvatarCard
                  key={item.id}
                  type='button'
                  $selected={selected}
                  disabled={saving}
                  onClick={() => onSelect(item.id)}
                  aria-pressed={selected}
                  aria-label={intl.formatMessage({ id: item.labelKey })}
                >
                  {selected ? (
                    <SelectedBadge aria-hidden>
                      <CheckOutlined />
                    </SelectedBadge>
                  ) : null}
                  <img src={item.src} alt='' />
                  <AvatarLabel>
                    <FormattedMessage id={item.labelKey} />
                  </AvatarLabel>
                </AvatarCard>
              )
            })}
          </AvatarGrid>

          <Actions>
            <Button
              onClick={onReset}
              disabled={saving || !selectedId}
              loading={saving}
            >
              <FormattedMessage id='customization.reset' />
            </Button>
          </Actions>
        </Panel>
      </Stagger>
    </PageContent>
  )
}

export default CustomizationPage
