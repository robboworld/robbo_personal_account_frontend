import React, { useEffect, useRef, useState } from 'react'
import { PictureOutlined } from '@ant-design/icons'

import FileIcon from '@/components/FileIcon'

const IMAGE_KINDS = ['png', 'jpeg', 'gif']
// A picture is fetched whole for its preview: a big one shows as an icon.
export const PREVIEW_MAX_BYTES = 8 * 1024 * 1024

export const isPicture = file =>
  IMAGE_KINDS.includes(file?.kind) && Number(file?.sizeBytes) <= PREVIEW_MAX_BYTES

/**
 * The picture of a file, fetched with the session once the tile scrolls into view; other files
 * show their type icon. fetchBlob(signal) → Promise<Blob>.
 */
const FileThumb = ({ file, fetchBlob, alt, height = 140 }) => {
  const box = useRef(null)
  const fetcher = useRef(fetchBlob)
  fetcher.current = fetchBlob
  const [visible, setVisible] = useState(typeof IntersectionObserver === 'undefined')
  const [url, setUrl] = useState(null)
  const picture = isPicture(file)

  useEffect(() => {
    if (!picture || visible || !box.current) return undefined
    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setVisible(true)
          io.disconnect()
        }
      },
      { rootMargin: '200px' },
    )
    io.observe(box.current)
    return () => io.disconnect()
  }, [picture, visible])

  useEffect(() => {
    if (!picture || !visible) return undefined
    const controller = new AbortController()
    let objectUrl = null
    Promise.resolve()
      .then(() => fetcher.current(controller.signal))
      .then(blob => {
        if (controller.signal.aborted) return
        objectUrl = URL.createObjectURL(blob)
        setUrl(objectUrl)
      })
      .catch(() => {
        /* the icon stays */
      })
    return () => {
      controller.abort()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [file?.id, picture, visible])

  return (
    <div
      ref={box}
      style={{
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--ant-color-fill-quaternary, rgba(0,0,0,0.02))',
        overflow: 'hidden',
        fontSize: Math.round(height / 3),
      }}>
      {url ? (
        <img
          src={url}
          alt={alt || file.name}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
        />
      ) : picture ? (
        <PictureOutlined aria-hidden />
      ) : (
        <FileIcon name={file.name} />
      )}
    </div>
  )
}

export default FileThumb
