import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Spin, Alert } from 'antd'
import { useIntl } from 'react-intl'

import { projectPageAPI } from '@/api/projectPage'
import config from '@/config'
import { resolveProjectPreviewUrl } from '@/helpers/projectPreview'

import './ScratchPlayerEmbed.css'

const READY_TIMEOUT_MS = 20000
const GREEN_FLAG_RETRY_MS = 150
const GREEN_FLAG_RETRY_MAX_MS = 15000
const MIN_PLAYER_HEIGHT = 200
const DEFAULT_PLAYER_HEIGHT = 400

function clampHeight(value) {
    const maxHeight = typeof window !== 'undefined'
        ? Math.min(window.innerHeight * 0.85, 960)
        : 960
    return Math.min(maxHeight, Math.max(MIN_PLAYER_HEIGHT, value))
}

function buildPlayerSrc(playToken, locale) {
    const base = (config.scratchPlayerURL || '').replace(/\/?$/, '')
    const params = new URLSearchParams()
    params.set('embed', '1')
    if (locale) params.set('lang', locale)
    if (playToken?.jsonUrl) params.set('jsonUrl', playToken.jsonUrl)
    if (playToken?.playUrl) params.set('playUrl', playToken.playUrl)
    return `${base}?${params.toString()}`
}

function mapPlayerErrorMessage(raw, intl) {
    const msg = String(raw || '')
    if (
        msg === 'INVALID_PROJECT_FILE' ||
        msg.includes('validationError') ||
        msg.includes('Could not parse as a valid SB2 or SB3') ||
        msg.includes('playUrl did not return a .sb3')
    ) {
        return intl.formatMessage({ id: 'project_page.invalid_project_file' })
    }
    return msg || intl.formatMessage({ id: 'project_page.player_error' })
}

function CoverGreenFlag() {
    return (
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16.63 17.5'
aria-hidden>
            <path
                fill='#4cbf56'
                stroke='#45993d'
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M.75,2A6.44,6.44,0,0,1,8.44,2h0a6.44,6.44,0,0,0,7.69,0V12.4a6.44,6.44,0,0,1-7.69,0h0a6.44,6.44,0,0,0-7.69,0'
            />
            <line
                x1='0.75'
                y1='16.75'
                x2='0.75'
                y2='0.75'
                fill='#4cbf56'
                stroke='#45993d'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='1.5'
            />
        </svg>
    )
}

const ScratchPlayerEmbed = forwardRef(function ScratchPlayerEmbed({
    projectPageId,
    locale,
    playToken: playTokenProp,
    preview,
    previewCacheKey,
    reloadKey = 0,
    onRunningChange,
}, ref) {
    const intl = useIntl()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [playToken, setPlayToken] = useState(playTokenProp || null)
    const [ready, setReady] = useState(false)
    const [coverVisible, setCoverVisible] = useState(true)
    const [playerHeight, setPlayerHeight] = useState(DEFAULT_PLAYER_HEIGHT)
    const readyTimerRef = useRef(null)
    const greenFlagRetryRef = useRef(null)
    const rootRef = useRef(null)
    const iframeRef = useRef(null)
    const pendingGreenFlagRef = useRef(false)

    const previewUrl = useMemo(
        () => resolveProjectPreviewUrl(preview, previewCacheKey),
        [preview, previewCacheKey],
    )

    const clearReadyTimer = useCallback(() => {
        if (readyTimerRef.current) {
            clearTimeout(readyTimerRef.current)
            readyTimerRef.current = null
        }
    }, [])

    const stopGreenFlagRetry = useCallback(() => {
        if (greenFlagRetryRef.current) {
            clearInterval(greenFlagRetryRef.current)
            greenFlagRetryRef.current = null
        }
    }, [])

    const focusPlayer = useCallback(() => {
        if (iframeRef.current) iframeRef.current.focus()
    }, [])

    const postCommand = useCallback(type => {
        const iframe = iframeRef.current
        if (!iframe?.contentWindow) return false
        try {
            iframe.contentWindow.postMessage({ type }, '*')
        } catch (e) {
            return false
        }
        if (type === 'scratch:greenFlag') {
            window.setTimeout(() => {
                try { iframe.focus() } catch (err) { /* ignore */ }
            }, 0)
        }
        return true
    }, [])

    const startGreenFlagRetry = useCallback(() => {
        stopGreenFlagRetry()
        const startedAt = Date.now()
        const ping = () => {
            postCommand('scratch:greenFlag')
            postCommand('scratch:clickGreenFlag')
        }
        ping()
        greenFlagRetryRef.current = window.setInterval(() => {
            if (!pendingGreenFlagRef.current) {
                stopGreenFlagRetry()
                return
            }
            if (Date.now() - startedAt > GREEN_FLAG_RETRY_MAX_MS) {
                stopGreenFlagRetry()
                return
            }
            ping()
        }, GREEN_FLAG_RETRY_MS)
    }, [postCommand, stopGreenFlagRetry])

    const requestStopAll = useCallback(() => {
        pendingGreenFlagRef.current = false
        stopGreenFlagRetry()
        postCommand('scratch:stopAll')
        // Immediate local UI feedback; scratch:runStop confirms from player.
        if (onRunningChange) onRunningChange(false)
    }, [postCommand, stopGreenFlagRetry, onRunningChange])

    const requestGreenFlag = useCallback(() => {
        // Hide cover immediately so the stage is visible; keep pinging until runStart.
        setCoverVisible(false)
        pendingGreenFlagRef.current = true
        startGreenFlagRetry()
    }, [startGreenFlagRetry])

    useImperativeHandle(ref, () => ({
        sendCommand(type) {
            if (type === 'scratch:greenFlag') {
                requestGreenFlag()
                return
            }
            if (type === 'scratch:stopAll') {
                requestStopAll()
                return
            }
            postCommand(type)
        },
        focusPlayer,
        dismissCover() {
            setCoverVisible(false)
        },
    }), [focusPlayer, postCommand, requestGreenFlag, requestStopAll])

    const notifyIframeResize = useCallback(() => {
        const iframe = iframeRef.current
        if (!iframe?.contentWindow) return
        try {
            iframe.contentWindow.dispatchEvent(new Event('resize'))
        } catch (e) {
            // cross-origin fallback
        }
    }, [])

    useEffect(() => {
        setCoverVisible(true)
        pendingGreenFlagRef.current = false
        setReady(false)
        stopGreenFlagRetry()
    }, [projectPageId, reloadKey, stopGreenFlagRetry])

    useEffect(() => () => {
        clearReadyTimer()
        stopGreenFlagRetry()
    }, [clearReadyTimer, stopGreenFlagRetry])

    useEffect(() => {
        if (playTokenProp?.jsonUrl || playTokenProp?.playUrl) {
            setPlayToken(playTokenProp)
            setError(null)
            setLoading(false)
            return undefined
        }

        let cancelled = false
        const token = localStorage.getItem('token')
        if (!token || !projectPageId) {
            setError(intl.formatMessage({ id: 'project_page.player_error' }))
            setLoading(false)
            return undefined
        }
        setLoading(true)
        setError(null)
        setReady(false)
        projectPageAPI.getProjectPlayToken(token, projectPageId)
            .then(res => {
                if (cancelled) return
                setPlayToken(res.data?.playToken || res.data)
            })
            .catch(e => {
                if (cancelled) return
                const status = e?.response?.status
                if (status === 404) {
                    setError(intl.formatMessage({ id: 'project_page.player_not_ready' }))
                    return
                }
                setError(e?.message || intl.formatMessage({ id: 'project_page.player_error' }))
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })
        return () => { cancelled = true }
    }, [projectPageId, playTokenProp, reloadKey, intl])

    useEffect(() => {
        const onMessage = event => {
            if (!event?.data?.type) return
            if (event.data.type === 'scratch:ready') {
                clearReadyTimer()
                setReady(true)
                if (pendingGreenFlagRef.current) {
                    startGreenFlagRetry()
                }
            }
            if (event.data.type === 'scratch:error') {
                clearReadyTimer()
                stopGreenFlagRetry()
                setError(mapPlayerErrorMessage(
                    event.data.message,
                    intl,
                ))
            }
            if (event.data.type === 'scratch:runStart') {
                pendingGreenFlagRef.current = false
                stopGreenFlagRetry()
                setCoverVisible(false)
                if (onRunningChange) onRunningChange(true)
            }
            if (event.data.type === 'scratch:runStop') {
                if (onRunningChange) onRunningChange(false)
            }
        }
        window.addEventListener('message', onMessage)
        return () => window.removeEventListener('message', onMessage)
    }, [intl, onRunningChange, clearReadyTimer, startGreenFlagRetry, stopGreenFlagRetry])

    const iframeSrc = useMemo(() => {
        if (!playToken?.jsonUrl && !playToken?.playUrl) return null
        return buildPlayerSrc(playToken, locale || intl.locale)
    }, [playToken, locale, intl.locale])

    useEffect(() => {
        setReady(false)
        pendingGreenFlagRef.current = false
        stopGreenFlagRetry()
        if (onRunningChange) onRunningChange(false)
        clearReadyTimer()
        if (!iframeSrc) return undefined
        readyTimerRef.current = setTimeout(() => {
            setError(intl.formatMessage({ id: 'project_page.player_load_timeout' }))
        }, READY_TIMEOUT_MS)
        return clearReadyTimer
    }, [iframeSrc, reloadKey, intl, onRunningChange, clearReadyTimer, stopGreenFlagRetry])

    useEffect(() => {
        const root = rootRef.current
        if (!root) return undefined
        const syncHeight = () => {
            const width = root.offsetWidth
            if (width > 0) {
                setPlayerHeight(clampHeight(Math.round(width * 0.75)))
            }
        }
        syncHeight()
        window.addEventListener('resize', syncHeight)
        return () => window.removeEventListener('resize', syncHeight)
    }, [])

    useEffect(() => {
        notifyIframeResize()
    }, [playerHeight, ready, notifyIframeResize])

    if (loading) {
        return <Spin style={{ width: '100%', padding: '2rem 0' }} />
    }
    if (error) {
        return <Alert type='warning' showIcon
message={error} />
    }
    if (!iframeSrc) {
        return <Alert type='info' showIcon
message={intl.formatMessage({ id: 'project_page.player_empty' })} />
    }

    const greenFlagLabel = intl.formatMessage({ id: 'project_page.green_flag' })
    const coverStyle = previewUrl
        ? { backgroundImage: `linear-gradient(180deg, rgba(13, 17, 23, 0.12) 0%, rgba(13, 17, 23, 0.5) 100%), url(${previewUrl})` }
        : undefined

    return (
        <div
            ref={rootRef}
            className='scratch-player-embed'
            style={{ height: playerHeight }}
        >
            <div className='scratch-player-embed__frame'>
                {!ready && !coverVisible && (
                    <div className='scratch-player-embed__loading'>
                        <Spin />
                    </div>
                )}
                <iframe
                    ref={iframeRef}
                    title='Scratch player'
                    src={iframeSrc}
                    tabIndex={0}
                    allow='autoplay'
                    sandbox='allow-scripts allow-same-origin'
                    onLoad={notifyIframeResize}
                    className='scratch-player-embed__iframe'
                    style={{ opacity: ready || coverVisible ? 1 : 0.3 }}
                />
                {coverVisible && (
                    <button
                        type='button'
                        className='scratch-player-embed__cover'
                        style={coverStyle}
                        aria-label={greenFlagLabel}
                        title={greenFlagLabel}
                        onClick={requestGreenFlag}
                    >
                        {!ready ? (
                            <Spin />
                        ) : (
                            <span className='scratch-player-embed__cover-flag'>
                                <CoverGreenFlag />
                            </span>
                        )}
                    </button>
                )}
            </div>
        </div>
    )
})

export default ScratchPlayerEmbed
