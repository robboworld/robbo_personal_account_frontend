import styled from 'styled-components'

import theme from '@/theme'

const { colors } = theme

export const FileName = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  min-width: 0;
  max-width: 100%;

  .anticon {
    flex-shrink: 0;
    color: ${colors.accentGreen};
  }

  span:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`
