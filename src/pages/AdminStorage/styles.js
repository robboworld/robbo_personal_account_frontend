import styled from 'styled-components'

import { surface } from '@/components/AccountShell/styles'
import theme from '@/theme'

const { colors } = theme

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
`

export const StatCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
  padding: 1rem 1.1rem;
  border-radius: 0.95rem;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid ${surface.line};
`

export const StatTitle = styled.h3`
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${colors.secondary};
`

export const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.875rem;

  span:first-child {
    color: ${surface.muted};
  }

  span:last-child {
    font-weight: 600;
    white-space: nowrap;
  }
`
