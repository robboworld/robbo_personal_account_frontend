import styled from 'styled-components'
import { Link } from 'react-router-dom'

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

export const ProductTitle = styled.h3`
  margin: 0 0 0.45rem;
  font-size: 1.0625rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: ${colors.secondary};
`

export const ProductActions = styled.div`
  margin-top: auto;
  padding-top: 0.85rem;
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

export const UsageHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1.1rem;
`

export const TariffBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.28rem 0.7rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: ${colors.accentGreen};
  background: rgba(0, 175, 65, 0.14);
  border: 1px solid rgba(0, 175, 65, 0.28);
`

export const UsageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.85rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

export const UsageMeter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  min-width: 0;
  padding: 0.85rem 0.9rem 0.95rem;
  border-radius: 0.95rem;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid ${surface.line};
`

export const UsageMeterTop = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
`

export const UsageMeterLabel = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${colors.secondary};
`

export const UsageMeterValue = styled.span`
  font-size: 0.8125rem;
  color: ${surface.muted};
  white-space: nowrap;
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

/** Variant A — command center */

export const StatusTitle = styled.h2`
  margin: 0 0 0.65rem;
  font-size: 1.125rem;
  font-weight: 650;
  letter-spacing: -0.02em;
  color: ${colors.secondary};
`

export const StatusPills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: 0.85rem;
`

export const StatusHint = styled.p`
  margin: 0 0 1rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${surface.muted};
`

export const KeyBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding-top: 0.85rem;
  border-top: 1px solid ${surface.line};
`

export const KeyBlockLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  color: ${surface.muted};
`

export const SplitGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  gap: 1.25rem;
  align-items: stretch;

  > * {
    height: 100%;
    min-height: 100%;
    box-sizing: border-box;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;

    > * {
      height: auto;
      min-height: 0;
    }
  }
`

export const PanelSectionTitle = styled.h3`
  margin: 0 0 0.85rem;
  font-size: 1rem;
  font-weight: 650;
  letter-spacing: -0.02em;
  color: ${colors.secondary};
`

export const UsageStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

export const EmptyDevices = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding: 0.85rem 0.95rem;
  border-radius: 0.95rem;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid ${surface.line};
`

export const EmptyDevicesTitle = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${colors.secondary};
`

export const EmptyDevicesText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.55;
  color: ${surface.muted};
`

export const EmptyDevicesActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-top: 0.25rem;
`

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
`

export const ProductCard = styled.article`
  display: flex;
  flex-direction: column;
  border-radius: 1.15rem;
  padding: 1.15rem 1.2rem 1.25rem;
  ${glassSurface}
  background: rgba(255, 255, 255, 0.66);
  border-color: ${props => (props.$current ? 'rgba(0, 175, 65, 0.35)' : surface.glassLine)};
`

export const ProductCardHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.45rem;
`

export const ProductPrice = styled.p`
  margin: 0 0 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: ${colors.secondary};
`

export const ProductFeatures = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
`

export const ProductFeature = styled.li`
  font-size: 0.875rem;
  line-height: 1.45;
  color: ${surface.muted};

  &::before {
    content: '·';
    margin-right: 0.4rem;
    color: ${colors.accentGreen};
    font-weight: 700;
  }
`

export const SessionsLink = styled(Link)`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${colors.accentGreen};
  text-decoration: none;

  &:hover {
    color: ${colors.accentGreenHover};
    text-decoration: underline;
  }
`
