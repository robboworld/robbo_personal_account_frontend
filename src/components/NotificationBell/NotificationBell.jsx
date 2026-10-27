import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { message } from 'antd'
import {
  ArrowRightOutlined,
  AuditOutlined,
  BarChartOutlined,
  BellOutlined,
  BookOutlined,
  CalendarOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  CloudUploadOutlined,
  CommentOutlined,
  ExceptionOutlined,
  FallOutlined,
  FileDoneOutlined,
  FlagOutlined,
  HourglassOutlined,
  InfoCircleOutlined,
  MailOutlined,
  MessageOutlined,
  ReadOutlined,
  SettingOutlined,
  SoundOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import styled, { css } from 'styled-components'

import {
  fetchNotificationFeed,
  fetchUnreadNotificationCount,
  markPersonalNotificationRead,
  markAnnouncementRead,
  markAllNotificationsRead,
  markLmsNotificationRead,
} from '@/api/notifications'
import theme from '@/theme'
import robboGuestTokens from '@/theme/robboGuestTokens'
import { apiErrorMessage } from '@/helpers/apiErrorMessage'

import { dayLabel, groupByDay, iconKind, isExternalUrl, isUnread, kindLabelId } from './feed'

// Every open tab polls: keep it cheap. Focus and visibility changes refresh at once.
const UNREAD_POLL_MS = 30000
const FEED_POLL_MS = 15000
const FEED_LIMIT = 40
const NARROW_QUERY = '(max-width: 575.98px)'
const PANEL_GAP = 10
const VIEWPORT_MARGIN = 8

// The same look as the LMS header bell (openedx-platform robbo_notifications/widget): a panel
// under the bell, day groups, a tick per unread entry and «Прочитать все» — one bell for the
// learner on both sides.
const ICONS = {
  update: SoundOutlined,
  review: AuditOutlined,
  graded: FileDoneOutlined,
  report: FlagOutlined,
  deadline: CalendarOutlined,
  missed: ExceptionOutlined,
  waiting: HourglassOutlined,
  section: ReadOutlined,
  certificate: TrophyOutlined,
  course: BookOutlined,
  learnerIn: UserAddOutlined,
  learnerOut: UserDeleteOutlined,
  lowScore: FallOutlined,
  inactive: ClockCircleOutlined,
  report_week: BarChartOutlined,
  studio: CloudUploadOutlined,
  team: TeamOutlined,
  learner: UserOutlined,
  discussion: CommentOutlined,
  announcement: SoundOutlined,
  teacher: MessageOutlined,
  system: InfoCircleOutlined,
  admin: MailOutlined,
}

const green = robboGuestTokens.green
const greenDark = robboGuestTokens.greenDark
const greenTint = robboGuestTokens.greenLight
const greenSoft = '#d3f1df'
const headTint = '#e3f6ea'
const text = '#1f2328'
const muted = robboGuestTokens.bodyMuted
const grey = robboGuestTokens.grey
const line = '#e8eaed'
const hover = '#f6f7f8'

const IconTrigger = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 0.65rem;
  background: rgba(0, 175, 65, 0.1);
  color: ${theme.colors.secondary};
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background 0.22s cubic-bezier(0.32, 0.72, 0, 1),
    color 0.22s ease,
    transform 0.18s ease;

  &:hover {
    background: rgba(0, 175, 65, 0.18);
    color: ${theme.colors.accentGreen};
  }

  &:active {
    transform: scale(0.96);
  }

  &:focus-visible {
    outline: 2px solid ${green};
    outline-offset: 2px;
  }

  &[aria-expanded='true'] {
    background: ${green};
    color: #fff;
  }

  .anticon {
    font-size: 1.05rem;
    color: inherit;
  }

  /* Floating over the page (desktop): a round white button that reads as its own layer. */
  &.is-floating {
    width: 40px;
    height: 40px;
    border: 1px solid ${line};
    border-radius: 50%;
    background: #fff;
    box-shadow:
      0 6px 18px rgba(17, 24, 39, 0.12),
      0 1px 3px rgba(17, 24, 39, 0.08);
    color: ${greenDark};
  }

  &.is-floating:hover {
    background: ${greenTint};
    color: ${greenDark};
    box-shadow:
      0 8px 22px rgba(17, 24, 39, 0.16),
      0 1px 3px rgba(17, 24, 39, 0.08);
  }

  &.is-floating .anticon {
    font-size: 18px;
  }

  &.is-floating[aria-expanded='true'] {
    border-color: ${green};
    background: ${green};
    color: #fff;
  }
`

const Badge = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 999px;
  background: ${green};
  box-shadow: 0 0 0 2px #fff;
  color: #fff;
  font-family: ${robboGuestTokens.fontFamily};
  font-size: 11px;
  font-weight: 800;
  line-height: 18px;
  text-align: center;
  pointer-events: none;

  .is-floating > & {
    top: -4px;
    right: -4px;
  }
`

const Panel = styled.div`
  position: fixed;
  z-index: 1060;
  display: flex;
  flex-direction: column;
  width: 400px;
  max-width: calc(100vw - ${VIEWPORT_MARGIN * 2}px);
  border: 1px solid ${line};
  border-radius: 16px;
  background: #fff;
  box-shadow:
    0 18px 48px rgba(17, 24, 39, 0.18),
    0 2px 6px rgba(17, 24, 39, 0.08);
  color: ${text};
  font-family: ${robboGuestTokens.fontFamily};
  font-size: 16px;
  line-height: 1.5;
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;

  &.is-open {
    opacity: 1;
    transform: none;
  }

  &,
  * {
    box-sizing: border-box;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

const Caret = styled.span`
  position: absolute;
  z-index: 1;
  top: -7px;
  width: 14px;
  height: 14px;
  border-top: 1px solid ${line};
  border-left: 1px solid ${line};
  background: ${headTint};
  transform: rotate(45deg);
`

const Head = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 16px 14px 20px;
  border-radius: 16px 16px 0 0;
  background: linear-gradient(135deg, ${headTint} 0%, #fff 85%);
`

const Title = styled.h2`
  margin: 0;
  outline: none;
  color: ${text};
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.01em;
  line-height: 1.25;
`

const Summary = styled.p`
  min-height: 1.4em;
  margin: 2px 0 0;
  color: ${muted};
  font-size: 14px;
  line-height: 1.4;

  &.has-unread {
    color: ${greenDark};
    font-weight: 700;
  }

  &.is-error {
    color: #b42318;
    font-weight: 700;
  }
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 2px;
  margin: -4px -4px 0 0;
`

const plainButton = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  border: 0;
  border-radius: 999px;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  transition:
    background-color 0.15s ease,
    opacity 0.15s ease;

  &:focus-visible {
    outline: 2px solid ${green};
  }

  &:disabled {
    cursor: progress;
    opacity: 0.6;
  }
`

const ReadAllButton = styled.button`
  ${plainButton};
  gap: 6px;
  height: 36px;
  padding: 0 12px;
  color: ${greenDark};
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;

  &:hover {
    background: ${greenSoft};
  }
`

const CloseButton = styled.button`
  ${plainButton};
  width: 40px;
  height: 40px;
  padding: 0;
  color: ${muted};

  &:hover {
    background: ${hover};
    color: ${text};
  }
`

const Body = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  padding: 0 8px 8px;
  border-top: 1px solid ${line};
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-color: #d5d8dc transparent;
  scrollbar-width: thin;
`

const DayTitle = styled.h3`
  position: sticky;
  top: 0;
  z-index: 2;
  margin: 0;
  padding: 14px 12px 8px;
  background: #fff;
  color: ${text};
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.04em;
  line-height: 1.3;
  text-transform: uppercase;
`

const Entries = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;

  > li {
    position: relative;
    margin: 0;
    padding: 0;
  }
`

const Kind = styled.span`
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-top: 1px;
  border-radius: 10px;
  background: ${greenTint};
  color: ${greenDark};
  font-size: 16px;
`

const Entry = styled.div`
  display: flex;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  color: inherit;
  transition: background-color 0.15s ease;

  &[role='link'] {
    cursor: pointer;
  }

  &[role='link']:hover {
    background: ${hover};
  }

  &.is-unread {
    padding-right: 48px;
    background: ${greenTint};
  }

  &.is-unread ${Kind} {
    background: #fff;
  }

  &.is-unread[role='link']:hover {
    background: ${greenSoft};
  }

  &:focus-visible {
    outline: 2px solid ${green};
    outline-offset: -2px;
  }
`

const Content = styled.span`
  flex: 1 1 auto;
  min-width: 0;
`

const TypeLine = styled.span`
  display: block;
  margin: 0 0 2px;
  color: ${greenDark};
  font-size: 12px;
  font-weight: 700;
  line-height: 1.3;
`

const Dot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  margin: 0 6px 1px 0;
  border-radius: 50%;
  background: ${green};
  vertical-align: middle;
`

const EntryTitle = styled.span`
  display: block;
  color: ${text};
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
  overflow-wrap: anywhere;
`

const EntryText = styled.span`
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  color: ${text};
  font-size: 14px;
  line-height: 1.45;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
`

const Meta = styled.span`
  display: block;
  margin: 6px 0 0;
  color: ${grey};
  font-size: 12px;
  line-height: 1.3;

  time {
    white-space: nowrap;
  }

  span + time {
    margin-left: 8px;
  }
`

const MarkButton = styled.button`
  ${plainButton};
  position: absolute;
  top: 10px;
  right: 8px;
  z-index: 1;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid transparent;
  color: ${greenDark};

  &:hover {
    border-color: ${green};
    background: #fff;
  }

  @media (hover: hover) {
    opacity: 0.55;

    li:hover > &,
    &:focus-visible {
      opacity: 1;
    }
  }
`

const Note = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px 16px;
  color: ${muted};
  font-size: 15px;
  text-align: center;

  p {
    margin: 0;
  }

  > .anticon {
    color: ${green};
    font-size: 28px;
  }
`

const NoteTitle = styled.p`
  color: ${text};
  font-weight: 700;
`

const Skeleton = styled.div`
  display: flex;
  gap: 12px;
  padding: 12px;

  i {
    display: block;
    height: 12px;
    border-radius: 8px;
    background: #f1f2f4;
    animation: lk-nt-shimmer 1.2s ease-in-out infinite;
  }

  > i {
    flex: 0 0 32px;
    height: 32px;
    border-radius: 10px;
  }

  span {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: 8px;
    padding-top: 4px;
  }

  span i:nth-child(1) {
    width: 40%;
  }

  span i:nth-child(2) {
    width: 95%;
  }

  span i:nth-child(3) {
    width: 55%;
  }

  @keyframes lk-nt-shimmer {
    50% {
      opacity: 0.45;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    i {
      animation: none;
    }
  }
`

const Foot = styled.div`
  display: flex;
  gap: 4px;
  padding: 8px;
  border-top: 1px solid ${line};
`

const FootLink = styled.a`
  display: inline-flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 44px;
  padding: 0 10px;
  border-radius: 10px;
  color: ${greenDark};
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  transition: background-color 0.15s ease;

  &:hover {
    background: ${greenTint};
    color: ${greenDark};
  }

  &:focus-visible {
    outline: 2px solid ${green};
    outline-offset: 2px;
  }

  /* The settings: a square gear, its name in the tooltip and for screen readers. */
  & + & {
    flex: 0 0 44px;
    padding: 0;
    font-size: 18px;
  }
`

const SrOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
`

// The bell's tabs: LK first, Open edX notifications second (quieter: smaller, grey count).
const Tabs = styled.div`
  display: flex;
  gap: 4px;
  padding: 0 12px;
  background: #fff;
`

const Tab = styled.button`
  ${plainButton};
  position: relative;
  gap: 6px;
  height: 40px;
  padding: 0 10px;
  border-radius: 10px 10px 0 0;
  color: ${muted};
  font-size: 14px;
  font-weight: 700;

  &:hover {
    background: ${hover};
  }

  &[aria-selected='true'] {
    color: ${text};
  }

  &[aria-selected='true']::after {
    content: '';
    position: absolute;
    right: 10px;
    bottom: -1px;
    left: 10px;
    height: 3px;
    border-radius: 3px 3px 0 0;
    background: ${green};
  }

  &.is-secondary {
    font-size: 13px;
    font-weight: 600;
  }

  &:focus-visible {
    outline-offset: -2px;
  }
`

const TabCount = styled.span`
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 999px;
  background: ${green};
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  line-height: 20px;
  text-align: center;

  .is-secondary & {
    background: #e6e8eb;
    color: ${muted};
  }
`

// Unread Open edX notifications only: a quiet grey dot instead of a number.
const LmsDot = styled.span`
  position: absolute;
  right: -3px;
  bottom: -3px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${grey};
  box-shadow: 0 0 0 2px #fff;
  pointer-events: none;

  .is-floating > & {
    right: 0;
    bottom: 0;
  }
`

// The bell's tabs, also the backend's feed sources.
const SOURCE_LK = 'lk'
const SOURCE_LMS = 'lms'
const SOURCES = [SOURCE_LK, SOURCE_LMS]

const markRowRead = row => {
  if (row.feedKind === 'personal') return markPersonalNotificationRead(row.id)
  if (row.feedKind === 'lms') return markLmsNotificationRead(row.id)
  return markAnnouncementRead(row.id)
}

const rowKey = row => `${row.feedKind}:${row.id}`
const rowSource = row => (row.feedKind === 'lms' ? SOURCE_LMS : SOURCE_LK)

// variant 'floating': the round desktop button over the page (PageLayout); default: in a top bar.
const NotificationBell = ({ variant }) => {
  const intl = useIntl()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [shown, setShown] = useState(false)
  const [counts, setCounts] = useState({ lk: 0, lms: 0, lmsEnabled: false })
  const [tab, setTab] = useState(SOURCE_LK)
  // Items per tab: null until the first load.
  const [feeds, setFeeds] = useState({ lk: null, lms: null })
  const [lmsLinks, setLmsLinks] = useState(null)
  const [loadError, setLoadError] = useState({})
  // { text, error }: what the line under the title says for a while.
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState({})
  const [readingAll, setReadingAll] = useState(false)
  const [place, setPlace] = useState(null)
  const triggerRef = useRef(null)
  const panelRef = useRef(null)
  const titleRef = useRef(null)
  const inFlightRef = useRef({})
  const statusTimerRef = useRef(null)
  const panelId = useRef(`lk-notifications-${Math.random().toString(36).slice(2, 8)}`).current
  const activeTab = counts.lmsEnabled ? tab : SOURCE_LK

  const t = useCallback((id, values) => intl.formatMessage({ id }, values), [intl])

  const refreshCount = useCallback(async () => {
    try {
      const data = await fetchUnreadNotificationCount()
      const number = value => (typeof value === 'number' ? value : 0)
      setCounts({
        // An older backend answers only { count }: all of it is LK then.
        lk: number(data.lk ?? data.count),
        lms: number(data.lms),
        lmsEnabled: Boolean(data.lmsEnabled),
      })
    } catch {
      /* ignore when logged out or network */
    }
  }, [])

  const loadFeed = useCallback(async source => {
    if (inFlightRef.current[source]) return
    inFlightRef.current[source] = true
    try {
      const data = await fetchNotificationFeed(FEED_LIMIT, source)
      setFeeds(prev => ({ ...prev, [source]: data.items || [] }))
      if (source === SOURCE_LMS) setLmsLinks(data.lms || null)
      setLoadError(prev => ({ ...prev, [source]: false }))
    } catch (e) {
      const raw = e?.message || String(e)
      if (!/token is expired|Session expired|unauthorized|401/i.test(raw)) {
        setLoadError(prev => ({ ...prev, [source]: true }))
      }
    } finally {
      inFlightRef.current[source] = false
    }
  }, [])

  // The counter: every 30 s while the tab is visible, at once on focus.
  useEffect(() => {
    let timer
    const startPolling = () => {
      clearInterval(timer)
      if (document.visibilityState === 'visible') {
        refreshCount()
        timer = setInterval(refreshCount, UNREAD_POLL_MS)
      }
    }
    const onFocus = () => refreshCount()
    startPolling()
    document.addEventListener('visibilitychange', startPolling)
    window.addEventListener('focus', onFocus)
    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', startPolling)
      window.removeEventListener('focus', onFocus)
    }
  }, [refreshCount])

  // The open panel: the shown tab fresh on open and on switch, then every 15 s while visible.
  useEffect(() => {
    if (!open) return undefined
    let timer
    const startFeedPolling = () => {
      clearInterval(timer)
      if (document.visibilityState === 'visible') {
        loadFeed(activeTab)
        timer = setInterval(() => loadFeed(activeTab), FEED_POLL_MS)
      }
    }
    startFeedPolling()
    document.addEventListener('visibilitychange', startFeedPolling)
    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', startFeedPolling)
    }
  }, [open, activeTab, loadFeed])

  useEffect(() => {
    if (open) refreshCount()
  }, [open, refreshCount])

  // Under the bell, toward the free side, the caret at the bell; on a phone across the whole width.
  const placePanel = useCallback(() => {
    const button = triggerRef.current
    const panel = panelRef.current
    if (!button || !panel) return
    const rect = button.getBoundingClientRect()
    const viewport = document.documentElement.clientWidth
    const top = Math.round(rect.bottom + PANEL_GAP)
    const narrow = Boolean(window.matchMedia && window.matchMedia(NARROW_QUERY).matches)
    const width = narrow
      ? viewport - VIEWPORT_MARGIN * 2
      : Math.min(panel.offsetWidth || 400, viewport - VIEWPORT_MARGIN * 2)
    const toRight = rect.left + rect.width / 2 < viewport / 2
    let left = toRight ? rect.left - 4 : rect.right + 4 - width
    left = Math.max(VIEWPORT_MARGIN, Math.min(left, viewport - VIEWPORT_MARGIN - width))
    setPlace({
      top,
      left,
      width: narrow ? width : undefined,
      maxHeight: Math.max(240, window.innerHeight - top - 12),
      caret: Math.round(rect.left + rect.width / 2 - left - 8),
      origin: toRight ? 'top left' : 'top right',
    })
  }, [])

  useLayoutEffect(() => {
    if (!open) return undefined
    placePanel()
    const frame = window.requestAnimationFrame(() => setShown(true))
    window.addEventListener('resize', placePanel)
    window.addEventListener('scroll', placePanel, true)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', placePanel)
      window.removeEventListener('scroll', placePanel, true)
    }
  }, [open, placePanel])

  const close = useCallback((returnFocus = false) => {
    setShown(false)
    setOpen(false)
    setPlace(null)
    if (returnFocus) triggerRef.current?.focus()
  }, [])

  // The title gets the focus once the panel is placed (a hidden element cannot take it).
  const placed = Boolean(place)
  useEffect(() => {
    if (open && placed) titleRef.current?.focus({ preventScroll: true })
  }, [open, placed])

  // Outside click and Escape close.
  useEffect(() => {
    if (!open) return undefined
    const onPointer = event => {
      const inside =
        panelRef.current?.contains(event.target) || triggerRef.current?.contains(event.target)
      if (!inside) close(false)
    }
    const onKey = event => {
      if (event.key === 'Escape') close(true)
    }
    document.addEventListener('pointerdown', onPointer, true)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer, true)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, close])

  useEffect(() => () => clearTimeout(statusTimerRef.current), [])

  const showStatus = (textValue, error) => {
    clearTimeout(statusTimerRef.current)
    setStatus({ text: textValue, error })
    if (error) {
      statusTimerRef.current = setTimeout(() => setStatus(null), 4000)
    }
  }

  const setRead = (source, predicate) => {
    const now = new Date().toISOString()
    setFeeds(prev => ({
      ...prev,
      [source]: (prev[source] || []).map(row =>
        predicate(row) && isUnread(row) ? { ...row, readAt: now } : row,
      ),
    }))
  }

  const switchTab = source => {
    setStatus(null)
    setTab(source)
  }

  const handleMarkRead = async (row, button) => {
    const key = rowKey(row)
    const source = rowSource(row)
    const hadFocus = document.activeElement === button
    setBusy(prev => ({ ...prev, [key]: true }))
    try {
      await markRowRead(row)
      setRead(source, other => rowKey(other) === key)
      setCounts(prev => ({ ...prev, [source]: Math.max(0, prev[source] - 1) }))
      refreshCount()
      if (hadFocus) {
        // Keyboard users keep their place: the next tick, or the panel title.
        window.requestAnimationFrame(() => {
          const next = panelRef.current?.querySelector('[data-mark]')
          ;(next || titleRef.current)?.focus({ preventScroll: true })
        })
      }
    } catch {
      showStatus(t('notifications.read_error'), true)
    } finally {
      setBusy(prev => {
        const rest = { ...prev }
        delete rest[key]
        return rest
      })
    }
  }

  // «Прочитать все» reads the shown tab only.
  const handleMarkAll = async () => {
    const source = activeTab
    setReadingAll(true)
    try {
      await markAllNotificationsRead(source)
      setRead(source, () => true)
      setCounts(prev => ({ ...prev, [source]: 0 }))
      showStatus(t('notifications.read_all_done'), false)
      titleRef.current?.focus({ preventScroll: true })
      refreshCount()
    } catch {
      showStatus(t('notifications.read_error'), true)
    } finally {
      setReadingAll(false)
    }
  }

  const handleOpenRow = async row => {
    if (!row.actionUrl) return
    try {
      if (isUnread(row)) await markRowRead(row)
    } catch (e) {
      message.error(apiErrorMessage(e, intl))
      return
    }
    close(false)
    if (isExternalUrl(row.actionUrl)) {
      window.location.assign(row.actionUrl)
    } else {
      navigate(row.actionUrl)
    }
  }

  const items = feeds[activeTab]
  const unreadInTab = counts[activeTab]
  const unreadInList = (items || []).some(isUnread)
  let summaryText = unreadInTab
    ? t('notifications.summary_unread', { count: unreadInTab })
    : t('notifications.summary_none')
  let summaryClass = unreadInTab && activeTab === SOURCE_LK ? 'has-unread' : ''
  if (status) {
    summaryText = status.text
    summaryClass = status.error ? 'is-error' : ''
  }
  let buttonLabel = t('notifications.title')
  if (counts.lk && counts.lms) {
    buttonLabel = t('notifications.button_unread_both', { count: counts.lk, lms: counts.lms })
  } else if (counts.lk) {
    buttonLabel = t('notifications.button_unread', { count: counts.lk })
  } else if (counts.lms) {
    buttonLabel = t('notifications.button_unread_lms', { lms: counts.lms })
  }

  const renderRow = row => {
    const unread = isUnread(row)
    const Icon = ICONS[iconKind(row)] || BellOutlined
    const isLms = row.feedKind === 'lms'
    const clickable = Boolean(row.actionUrl)
    const created = new Date(row.createdAt)
    const key = rowKey(row)
    const openRow = () => handleOpenRow(row)
    return (
      <li key={key}>
        <Entry
          className={unread ? 'is-unread' : undefined}
          role={clickable ? 'link' : undefined}
          tabIndex={clickable ? 0 : undefined}
          onClick={clickable ? openRow : undefined}
          onKeyDown={
            clickable
              ? event => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    openRow()
                  }
                }
              : undefined
          }>
          <Kind aria-hidden='true'>
            <Icon />
          </Kind>
          <Content>
            <TypeLine>
              {unread && (
                <React.Fragment>
                  <Dot aria-hidden='true' />
                  <SrOnly>{t('notifications.unread')}: </SrOnly>
                </React.Fragment>
              )}
              {isLms ? row.title : t(kindLabelId(row))}
            </TypeLine>
            {!isLms && row.title && <EntryTitle>{row.title}</EntryTitle>}
            {row.body && <EntryText>{row.body}</EntryText>}
            <Meta>
              {row.courseName && <span>{row.courseName}</span>}
              {!Number.isNaN(created.getTime()) && (
                <time dateTime={row.createdAt}>
                  {intl.formatTime(created, { hour: '2-digit', minute: '2-digit' })}
                </time>
              )}
            </Meta>
          </Content>
        </Entry>
        {unread && (
          <MarkButton
            type='button'
            data-mark
            disabled={Boolean(busy[key])}
            aria-label={t('notifications.mark_read_hint')}
            title={t('notifications.mark_read_hint')}
            onClick={event => {
              event.stopPropagation()
              handleMarkRead(row, event.currentTarget)
            }}>
            <CheckOutlined />
          </MarkButton>
        )}
      </li>
    )
  }

  let body
  if (items === null && !loadError[activeTab]) {
    body = (
      <React.Fragment>
        {[0, 1, 2].map(i => (
          <Skeleton key={i} aria-hidden='true'>
            <i />
            <span>
              <i />
              <i />
              <i />
            </span>
          </Skeleton>
        ))}
        <SrOnly>{t('notifications.loading')}</SrOnly>
      </React.Fragment>
    )
  } else if (loadError[activeTab] && !items?.length) {
    body = (
      <Note>
        <NoteTitle>{t('notifications.load_error')}</NoteTitle>
      </Note>
    )
  } else if (!items.length) {
    body = (
      <Note>
        <BellOutlined aria-hidden='true' />
        <NoteTitle>{t('notifications.empty')}</NoteTitle>
        <p>
          {activeTab === SOURCE_LMS
            ? t('notifications.empty_body_lms')
            : t('notifications.empty_body')}
        </p>
      </Note>
    )
  } else {
    body = groupByDay(items).map(group => (
      <section key={group.key}>
        <DayTitle>{dayLabel(group.date, intl)}</DayTitle>
        <Entries>{group.items.map(renderRow)}</Entries>
      </section>
    ))
  }

  const tabLabel = source =>
    source === SOURCE_LMS ? t('notifications.tab_lms') : t('notifications.tab_lk')
  const onTabKey = event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const next = SOURCES[(SOURCES.indexOf(activeTab) + 1) % SOURCES.length]
    switchTab(next)
    window.requestAnimationFrame(() => document.getElementById(`${panelId}-tab-${next}`)?.focus())
  }

  const panel = open
    ? createPortal(
        <Panel
          ref={panelRef}
          id={panelId}
          role='dialog'
          aria-labelledby={`${panelId}-title`}
          className={shown && place ? 'is-open' : undefined}
          style={
            place
              ? {
                  top: place.top,
                  left: place.left,
                  width: place.width,
                  maxHeight: place.maxHeight,
                  transformOrigin: place.origin,
                }
              : { visibility: 'hidden', top: 0, left: 0 }
          }>
          {place && <Caret aria-hidden='true' style={{ left: place.caret }} />}
          <Head>
            <div>
              <Title ref={titleRef} id={`${panelId}-title`} tabIndex={-1}>
                {t('notifications.title')}
              </Title>
              <Summary className={summaryClass} aria-live='polite'>
                {summaryText}
              </Summary>
            </div>
            <Actions>
              {unreadInList && (
                <ReadAllButton type='button' onClick={handleMarkAll} disabled={readingAll}>
                  <CheckOutlined aria-hidden='true' />
                  {t('notifications.mark_all')}
                </ReadAllButton>
              )}
              <CloseButton
                type='button'
                aria-label={t('notifications.close')}
                onClick={() => close(true)}>
                <CloseOutlined />
              </CloseButton>
            </Actions>
          </Head>
          {counts.lmsEnabled && (
            <Tabs role='tablist' aria-label={t('notifications.title')}>
              {SOURCES.map(source => (
                <Tab
                  key={source}
                  type='button'
                  role='tab'
                  id={`${panelId}-tab-${source}`}
                  aria-selected={activeTab === source}
                  aria-controls={`${panelId}-body`}
                  tabIndex={activeTab === source ? 0 : -1}
                  className={source === SOURCE_LMS ? 'is-secondary' : undefined}
                  onClick={() => switchTab(source)}
                  onKeyDown={onTabKey}>
                  {tabLabel(source)}
                  {counts[source] > 0 && (
                    <TabCount aria-hidden='true'>
                      {counts[source] > 99 ? '99+' : counts[source]}
                    </TabCount>
                  )}
                </Tab>
              ))}
            </Tabs>
          )}
          <Body
            id={`${panelId}-body`}
            role={counts.lmsEnabled ? 'tabpanel' : undefined}
            aria-labelledby={counts.lmsEnabled ? `${panelId}-tab-${activeTab}` : undefined}>
            {body}
          </Body>
          {activeTab === SOURCE_LMS && lmsLinks && (
            <Foot>
              <FootLink href={lmsLinks.feed}>
                {t('notifications.lms_all')}
                <ArrowRightOutlined aria-hidden='true' />
              </FootLink>
              <FootLink
                href={lmsLinks.settings}
                aria-label={t('notifications.lms_settings_hint')}
                title={t('notifications.lms_settings_hint')}>
                <SettingOutlined aria-hidden='true' />
              </FootLink>
            </Foot>
          )}
        </Panel>,
        document.body,
      )
    : null

  return (
    <React.Fragment>
      <IconTrigger
        ref={triggerRef}
        className={variant === 'floating' ? 'is-floating' : undefined}
        type='button'
        aria-label={buttonLabel}
        title={buttonLabel}
        aria-haspopup='dialog'
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => {
          setStatus(null)
          if (open) {
            close(false)
          } else {
            setOpen(true)
          }
        }}>
        <BellOutlined />
        {counts.lk > 0 && <Badge aria-hidden='true'>{counts.lk > 99 ? '99+' : counts.lk}</Badge>}
        {counts.lms > 0 && <LmsDot aria-hidden='true' />}
      </IconTrigger>
      {panel}
    </React.Fragment>
  )
}

export default NotificationBell
