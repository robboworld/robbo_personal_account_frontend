import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Spin, Alert } from 'antd'
import { useIntl } from 'react-intl'

import { projectPageAPI } from '@/api/projectPage'
import config from '@/config'

import './ScratchPlayerEmbed.css'

const READY_TIMEOUT_MS = 20000
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

export default function ScratchPlayerEmbed({ projectPageId, locale, playToken: playTokenProp, reloadKey = 0 }) {
    const intl = useIntl()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [playToken, setPlayToken] = useState(playTokenProp || null)
    const [ready, setReady] = useState(false)
    const [playerHeight, setPlayerHeight] = useState(DEFAULT_PLAYER_HEIGHT)
    const readyTimerRef = useRef(null)
    const rootRef = useRef(null)
    const iframeRef = useRef(null)

    const clearReadyTimer = () => {
        if (readyTimerRef.current) {
            clearTimeout(readyTimerRef.current)
            readyTimerRef.current = null
        }
    }

    const notifyIframeResize = useCallback(() => {
        const iframe = iframeRef.current
        if (!iframe?.contentWindow) return
        try {
            iframe.contentWindow.dispatchEvent(new Event('resize'))
        } catch (e) {
            // cross-origin fallback — iframe resize still triggers layout in most browsers
        }
    }, [])

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
            }
            if (event.data.type === 'scratch:error') {
                clearReadyTimer()
                setError(event.data.message || intl.formatMessage({ id: 'project_page.player_error' }))
            }
        }
        window.addEventListener('message', onMessage)
        return () => window.removeEventListener('message', onMessage)
    }, [intl])

    const iframeSrc = useMemo(() => {
        if (!playToken?.jsonUrl && !playToken?.playUrl) return null
        return buildPlayerSrc(playToken, locale || intl.locale)
    }, [playToken, locale, intl.locale])

    useEffect(() => {
        setReady(false)
        clearReadyTimer()
        if (!iframeSrc) return undefined
        readyTimerRef.current = setTimeout(() => {
            setError(intl.formatMessage({ id: 'project_page.player_load_timeout' }))
        }, READY_TIMEOUT_MS)
        return clearReadyTimer
    }, [iframeSrc, reloadKey, intl])

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

    const handleIframeLoad = () => {
        clearReadyTimer()
        readyTimerRef.current = setTimeout(() => {
            setReady(true)
            clearReadyTimer()
            notifyIframeResize()
        }, 800)
    }

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

    return (
        <div
            ref={rootRef}
            className='scratch-player-embed'
            style={{ height: playerHeight }}
        >
            <div className='scratch-player-embed__frame'>
                {!ready && (
                    <div className='scratch-player-embed__loading'>
                        <Spin />
                    </div>
                )}
                <iframe
                    ref={iframeRef}
                    title='Scratch player'
                    src={iframeSrc}
                    allow='autoplay'
                    sandbox='allow-scripts allow-same-origin'
                    onLoad={handleIframeLoad}
                    className='scratch-player-embed__iframe'
                    style={{ opacity: ready ? 1 : 0.3 }}
                />
            </div>
        </div>
    )
}
