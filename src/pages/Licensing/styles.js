import styled from 'styled-components'

import { glassSurface, surface } from '@/components/AccountShell/styles'
import theme from '@/theme'

const { colors } = theme

export const LicenseStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const LicenseCard = styled.article`
  border-radius: 1.15rem;
  padding: 1.15rem 1.2rem 1.25rem;
  ${glassSurface}
  background: rgba(255, 255, 255, 0.66);
`

export const LicenseKeyRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem 0.75rem;
  margin-bottom: 0.5rem;
`

export const LicenseLabel = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${colors.secondary};
`

export const LicenseMeta = styled.p`
  margin: 0 0 0.85rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${surface.muted};
`

export const SeatList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const SeatItem = styled.li`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.65rem;
  padding: 0.65rem 0.75rem;
  border-radius: 0.85rem;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid ${surface.line};
`

export const SeatInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
`

export const ResultBlock = styled.div`
  margin-top: 0.25rem;
  padding-top: 1rem;
  border-top: 1px solid ${surface.line};

  h3 {
    margin: 0 0 0.75rem;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: ${colors.secondary};
  }

  p {
    margin: 0 0 0.5rem;
    font-size: 0.9375rem;
    color: ${colors.secondary};
  }
`
