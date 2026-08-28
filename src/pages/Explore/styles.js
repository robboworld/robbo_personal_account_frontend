import styled, { createGlobalStyle } from 'styled-components'

import robboGuestTokens from '@/theme/robboGuestTokens'

const t = robboGuestTokens
const pageGray = '#f2f2f2'
const cardLine = '#e5e5e5'

export const ExploreGlobal = createGlobalStyle`
  html.explore-page-active,
  html.explore-page-active body,
  html.explore-page-active #root {
    min-height: 100dvh;
    background: ${pageGray} !important;
    background-image: none !important;
  }
`

export const PageRoot = styled.div`
  min-height: 100dvh;
  width: 100%;
  background: ${pageGray};
  color: ${t.coal};
  font-family: ${t.fontFamily};
  display: flex;
  flex-direction: column;
`

export const Main = styled.main`
  flex: 1;
  width: 100%;
`

export const Banner = styled.div`
  background: ${t.topbarBg};
  color: ${t.white};
`

export const BannerInner = styled.div`
  width: 100%;
  max-width: 942px;
  margin: 0 auto;
  padding: 1.35rem ${t.sectionPadX} 1.5rem;
  text-align: center;
`

export const BannerTitle = styled.h1`
  margin: 0;
  font-size: clamp(2.25rem, 5vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: ${t.white};
  text-wrap: balance;
`

export const TabBar = styled.div`
  background: ${t.white};
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.18);
`

export const Tabs = styled.nav`
  display: flex;
  justify-content: center;
  gap: 0;
  width: 100%;
  max-width: 942px;
  margin: 0 auto;
`

export const Tab = styled.span`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 0.2rem;
  min-width: 8.75rem;
  padding: 0.7rem 1.25rem 0.55rem;
  border-bottom: 3px solid ${({ $active }) => ($active ? t.green : 'transparent')};
  color: ${({ $active }) => ($active ? t.coal : t.grey)};
  font-size: 0.9375rem;
  font-weight: 700;
  line-height: 1.2;
`

export const TabIcon = styled.span`
  display: inline-flex;
  color: ${({ $muted }) => ($muted ? t.grey : t.green)};
`

export const Inner = styled.div`
  width: 100%;
  max-width: 942px;
  margin: 0 auto;
  padding: 0.85rem ${t.sectionPadX} 2.75rem;
`

export const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  padding: 0.15rem 0 0.85rem;
  border-bottom: 1px solid ${cardLine};
`

export const Pill = styled.button`
  appearance: none;
  min-height: 2rem;
  padding: 0.45em 1.35em;
  border-radius: 16px;
  border: 1px solid ${t.green};
  background: ${({ $active }) => ($active ? t.green : t.white)};
  color: ${({ $active }) => ($active ? t.white : t.green)};
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: ${({ $active }) => ($active ? t.green : t.greenLight)};
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${t.greenDark};
    outline-offset: 2px;
  }
`

export const SortHint = styled.span`
  margin-left: auto;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${t.grey};
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.9rem 0.85rem;
  padding-top: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

export const Card = styled.button`
  appearance: none;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0;
  padding: 8px 8px 10px;
  border: 0;
  border-radius: 4px;
  background: ${t.white};
  box-shadow: 0 0 0 1px ${cardLine};
  text-align: left;
  cursor: pointer;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 0 0 1px #d0d0d0, 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  &:active {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 2px solid ${t.green};
    outline-offset: 3px;
  }
`

export const Thumb = styled.div`
  width: 100%;
  aspect-ratio: 204 / 152;
  overflow: hidden;
  border-radius: 4px;
  background: #e9e9e9;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export const CardMeta = styled.div`
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  gap: 0.5rem;
  align-items: start;
  padding: 0.45rem 2px 0;
`

export const Avatar = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
  font-size: 0.625rem;
  font-weight: 700;
  color: ${t.white};
  background: ${t.green};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export const CardCopy = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.05rem;
`

export const CardTitle = styled.span`
  display: block;
  font-size: 0.875rem;
  font-weight: 800;
  line-height: 1.25;
  color: ${t.green};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${Card}:hover & {
    text-decoration: underline;
  }
`

export const CardAuthor = styled.span`
  display: block;
  font-size: 0.75rem;
  color: ${t.grey};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const SkeletonCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 8px 10px;
  border-radius: 4px;
  background: ${t.white};
  box-shadow: 0 0 0 1px ${cardLine};
`

export const SkeletonBar = styled.span`
  display: block;
  height: ${({ $h }) => $h || '0.7rem'};
  width: ${({ $w }) => $w || '70%'};
  margin-top: ${({ $mt }) => $mt || '0'};
  border-radius: 2px;
  background: #ececec;
`

export const Empty = styled.p`
  margin: 0;
  padding: 2.5rem 1rem;
  text-align: center;
  font-size: 0.95rem;
  color: ${t.bodyMuted};
`

export const LoadMore = styled.button`
  appearance: none;
  display: block;
  width: 100%;
  min-height: 3rem;
  margin: 1.35rem auto 0;
  padding: 0.75rem 1.25rem;
  border: 1px solid ${cardLine};
  border-radius: 4px;
  background: ${t.white};
  color: ${t.coal};
  font-family: inherit;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover:not(:disabled) {
    background: #fafafa;
  }

  &:disabled {
    color: ${t.grey};
    cursor: wait;
  }

  &:focus-visible {
    outline: 2px solid ${t.green};
    outline-offset: 3px;
  }
`
