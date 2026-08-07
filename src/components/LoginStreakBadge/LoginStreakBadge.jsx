import React from 'react'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.12rem;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  line-height: 1.2;
  color: ${props => (props.$active ? '#c45a00' : 'rgba(87, 94, 117, 0.55)')};
  opacity: ${props => (props.$active ? 1 : 0.72)};
  user-select: none;
`

const Flame = styled.span`
  font-size: 0.95rem;
  line-height: 1;
  filter: ${props => (props.$active ? 'none' : 'grayscale(1)')};
`

function LoginStreakBadge({ current = 0, longest = 0, className }) {
  const intl = useIntl()
  const active = Number(current) > 0
  const label = intl.formatMessage(
    { id: active ? 'streak.aria_active' : 'streak.aria_zero' },
    { current: Number(current) || 0, longest: Number(longest) || 0 },
  )
  return (
    <Badge
      className={className}
      $active={active}
      title={label}
      aria-label={label}
      role='img'
    >
      <Flame $active={active} aria-hidden>🔥</Flame>
      <span>{Number(current) || 0}</span>
    </Badge>
  )
}

LoginStreakBadge.propTypes = {
  current: PropTypes.number,
  longest: PropTypes.number,
  className: PropTypes.string,
}

export default LoginStreakBadge
