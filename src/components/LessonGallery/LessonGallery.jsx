import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Drawer,
  Empty,
  Input,
  Modal,
  Popconfirm,
  Space,
  Spin,
  Switch,
  Tag,
  Tooltip,
  Typography,
  Upload,
  message,
} from 'antd'
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  DeleteOutlined,
  EditOutlined,
  FolderOpenOutlined,
  PictureOutlined,
  PushpinFilled,
  PushpinOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { FormattedMessage, useIntl } from 'react-intl'

import * as api from '@/api/teacherClass'
import { ALLOWED_FILE_ACCEPT, isUploadCanceled, listFiles, uploadFile } from '@/api/userFiles'
import { getEntitlements } from '@/api/licensing'
import { FileDownloadButton } from '@/components/AssignmentFiles'
import { FileNameCell } from '@/components/FileIcon'
import FilePickerModal, { FileThumb } from '@/components/FilePickerModal'
import UploadProgress from '@/components/UploadProgress'
import { apiErrorMessage } from '@/helpers/apiErrorMessage'
import { formatFileSize } from '@/helpers/tariffs'
import { precheckUpload, uploadProblemMessage } from '@/pages/MyFiles/fileChecks'

const { Text, Paragraph } = Typography

export const CAPTION_MAX = 200

// Per-viewer convenience: the choice lives in this browser only and may be unavailable.
// On by default: only an explicit "off" turns it off.
const SPLIT_KEY = 'lessonGallery.splitMine'
const readSplit = () => {
  try {
    return window.localStorage.getItem(SPLIT_KEY) !== '0'
  } catch (_) {
    return true
  }
}
const saveSplit = on => {
  try {
    window.localStorage.setItem(SPLIT_KEY, on ? '1' : '0')
  } catch (_) {
    /* the choice lasts until the page closes */
  }
}

const CaptionModal = ({ item, onCancel, onSave }) => {
  const intl = useIntl()
  const [value, setValue] = useState('')
  const [saving, setSaving] = useState(false)
  useEffect(() => setValue(item?.caption || ''), [item])
  const save = async () => {
    setSaving(true)
    try {
      await onSave(value)
    } finally {
      setSaving(false)
    }
  }
  return (
    <Modal
      open={!!item}
      title={<FormattedMessage id='lesson_gallery.caption_title' />}
      onCancel={onCancel}
      onOk={save}
      okButtonProps={{ loading: saving }}
      okText={<FormattedMessage id='common.save' />}
      cancelText={<FormattedMessage id='common.cancel' />}>
      <Paragraph type='secondary'>
        <FormattedMessage id='lesson_gallery.caption_hint' />
      </Paragraph>
      <Input.TextArea
        autoFocus
        value={value}
        onChange={e => setValue(e.target.value)}
        maxLength={CAPTION_MAX}
        showCount
        autoSize={{ minRows: 2, maxRows: 4 }}
        aria-label={intl.formatMessage({ id: 'lesson_gallery.caption_title' })}
      />
    </Modal>
  )
}

/**
 * The lesson gallery of an assignment: files the class shares. Everyone in the class sees and
 * downloads them; a student adds files and removes their own; a teacher (canManage) removes any,
 * captions, pins and orders them, and closes the gallery to students.
 */
export const LessonGallery = ({ assignmentId, onChanged }) => {
  const intl = useIntl()
  const [gallery, setGallery] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(null) // id of the item being changed
  const [captioning, setCaptioning] = useState(null)
  const [uploads, setUploads] = useState([])
  const [picker, setPicker] = useState(false)
  const [library, setLibrary] = useState(null) // "Мои файлы" while the picker is open
  const [split, setSplit] = useState(readSplit) // own files apart, above the others
  const queue = useRef(Promise.resolve())

  const fail = useCallback(e => message.error(apiErrorMessage(e, intl)), [intl])

  const apply = useCallback(
    data => {
      setGallery(data)
      onChanged?.(data)
    },
    [onChanged],
  )

  const load = useCallback(async () => {
    try {
      const { data } = await api.getGallery(assignmentId)
      setGallery(data)
    } catch (e) {
      fail(e)
    } finally {
      setLoading(false)
    }
  }, [assignmentId, fail])

  useEffect(() => {
    setLoading(true)
    load()
  }, [load])

  const run = async (itemId, call) => {
    setBusy(itemId)
    try {
      const { data } = await call()
      apply(data)
      return true
    } catch (e) {
      fail(e)
      return false
    } finally {
      setBusy(null)
    }
  }

  const share = async row => {
    const { data } = await api.addGalleryFile(assignmentId, row.id)
    apply(data)
    if (row.hasScripts) {
      message.warning(intl.formatMessage({ id: 'my_files.scripts_uploaded' }, { name: row.name }))
    }
  }

  const beforeUpload = async file => {
    let ent = null
    try {
      ent = await getEntitlements()
    } catch (_) {
      /* the backend checks the limits again */
    }
    const problem = precheckUpload(file, ent)
    if (problem) {
      message.error(uploadProblemMessage(intl, file, problem))
      return Upload.LIST_IGNORE
    }
    return true
  }

  // The backend takes two uploads per account at a time: several files go one by one.
  const upload = file => {
    const { uid, name } = file
    const controller = new AbortController()
    const patch = fields =>
      setUploads(all => all.map(u => (u.uid === uid ? { ...u, ...fields } : u)))
    const forget = () => setUploads(all => all.filter(u => u.uid !== uid))
    const cancel = () => {
      controller.abort()
      forget()
    }
    setUploads(all => [...all, { uid, name, percent: null, cancel }])
    queue.current = queue.current.then(async () => {
      if (controller.signal.aborted) return
      patch({ percent: 0 })
      try {
        const row = await uploadFile(file, percent => patch({ percent }), controller.signal)
        patch({ cancel: null })
        if (row) await share(row)
      } catch (e) {
        if (!isUploadCanceled(e)) fail(e)
      } finally {
        forget()
      }
    })
  }

  const openPicker = async () => {
    setLibrary(null)
    setPicker(true)
    try {
      setLibrary(await listFiles())
    } catch (e) {
      setPicker(false)
      fail(e)
    }
  }

  const sharePicked = async chosen => {
    setPicker(false)
    for (const row of chosen) {
      try {
        await share(row)
      } catch (e) {
        fail(e)
        break
      }
    }
  }

  // Swaps the file with the neighbour the viewer sees next to it; with own files apart that
  // neighbour need not be next to it in the gallery's order.
  const move = (item, neighbour) => {
    const ids = gallery.items.map(it => it.id)
    const a = ids.indexOf(item.id)
    const b = ids.indexOf(neighbour.id)
    ;[ids[a], ids[b]] = [ids[b], ids[a]]
    run(item.id, () => api.reorderGallery(assignmentId, ids))
  }

  const toggleSplit = on => {
    setSplit(on)
    saveSplit(on)
  }

  if (loading) {
    return <Spin />
  }
  if (!gallery) {
    return <Empty />
  }

  const items = gallery.items || []
  const manage = gallery.canManage
  const mineCount = items.filter(it => it.mine).length
  const limitReached = !manage && mineCount >= gallery.maxFilesPerUser
  const sharedIds = new Set(items.map(it => it.file.id))

  const cardActions = (item, index, list) => {
    const out = [
      <FileDownloadButton
        key='dl'
        file={item.file}
        download={f => api.downloadGalleryFile(assignmentId, item.id, f.name)}
      />,
    ]
    if (manage) {
      const prev = list[index - 1]
      const next = list[index + 1]
      out.push(
        <Tooltip
          key='pin'
          title={intl.formatMessage({
            id: item.pinned ? 'lesson_gallery.unpin' : 'lesson_gallery.pin',
          })}>
          <Button
            type='text'
            icon={item.pinned ? <PushpinFilled /> : <PushpinOutlined />}
            aria-label={intl.formatMessage({
              id: item.pinned ? 'lesson_gallery.unpin' : 'lesson_gallery.pin',
            })}
            loading={busy === item.id}
            onClick={() =>
              run(item.id, () =>
                api.updateGalleryItem(assignmentId, item.id, { pinned: !item.pinned }),
              )
            }
          />
        </Tooltip>,
        <Button
          key='caption'
          type='text'
          icon={<EditOutlined />}
          aria-label={intl.formatMessage({ id: 'lesson_gallery.caption_title' })}
          title={intl.formatMessage({ id: 'lesson_gallery.caption_title' })}
          onClick={() => setCaptioning(item)}
        />,
        // Pinned files stay first: a file moves only next to one of its own group.
        <Button
          key='left'
          type='text'
          icon={<ArrowLeftOutlined />}
          aria-label={intl.formatMessage({ id: 'lesson_gallery.move_earlier' })}
          title={intl.formatMessage({ id: 'lesson_gallery.move_earlier' })}
          disabled={!prev || prev.pinned !== item.pinned}
          onClick={() => move(item, prev)}
        />,
        <Button
          key='right'
          type='text'
          icon={<ArrowRightOutlined />}
          aria-label={intl.formatMessage({ id: 'lesson_gallery.move_later' })}
          title={intl.formatMessage({ id: 'lesson_gallery.move_later' })}
          disabled={!next || next.pinned !== item.pinned}
          onClick={() => move(item, next)}
        />,
      )
    }
    if (item.canRemove) {
      out.push(
        <Popconfirm
          key='rm'
          title={intl.formatMessage(
            { id: item.mine ? 'lesson_gallery.remove_own' : 'lesson_gallery.remove_other' },
            { name: item.file.name },
          )}
          okText={intl.formatMessage({ id: 'lesson_gallery.remove' })}
          cancelText={intl.formatMessage({ id: 'common.cancel' })}
          onConfirm={() => run(item.id, () => api.removeGalleryItem(assignmentId, item.id))}>
          <Button
            type='text'
            danger
            icon={<DeleteOutlined />}
            aria-label={intl.formatMessage({ id: 'lesson_gallery.remove' })}
            title={intl.formatMessage({ id: 'lesson_gallery.remove' })}
          />
        </Popconfirm>,
      )
    }
    return out
  }

  const grid = list => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 12,
      }}>
      {list.map((item, index) => (
        <Card
          key={item.id}
          size='small'
          cover={
            <FileThumb
              file={item.file}
              alt={item.caption || item.file.name}
              fetchBlob={signal => api.fetchGalleryBlob(assignmentId, item.id, signal)}
            />
          }
          actions={cardActions(item, index, list)}
          styles={{ actions: { flexWrap: 'wrap' } }}>
          <Space orientation='vertical' size={2} style={{ width: '100%' }}>
            <Space size={4} style={{ maxWidth: '100%' }}>
              {item.pinned ? (
                <Tag color='gold' icon={<PushpinFilled />}>
                  <FormattedMessage id='lesson_gallery.pinned' />
                </Tag>
              ) : null}
            </Space>
            <Text strong ellipsis={{ tooltip: item.file.name }}>
              <FileNameCell name={item.file.name} hasScripts={item.file.hasScripts} />
            </Text>
            {item.caption ? <Text>{item.caption}</Text> : null}
            <Text type='secondary' style={{ fontSize: 12 }}>
              {item.mine ? (
                <FormattedMessage id='lesson_gallery.by_me' />
              ) : (
                item.uploaderName ||
                intl.formatMessage({ id: 'class_history.unknown_user' }, { id: item.uploaderId })
              )}
              {' · '}
              {formatFileSize(intl, item.file.sizeBytes)}
            </Text>
          </Space>
        </Card>
      ))}
    </div>
  )

  const mine = items.filter(it => it.mine)
  const others = items.filter(it => !it.mine)
  const section = (titleId, list, emptyId) => (
    <Space orientation='vertical' size={8} style={{ width: '100%' }}>
      <Text strong>
        <FormattedMessage id={titleId} values={{ count: list.length }} />
      </Text>
      {list.length ? (
        grid(list)
      ) : (
        <Text type='secondary'>
          <FormattedMessage id={emptyId} />
        </Text>
      )}
    </Space>
  )

  return (
    <Space orientation='vertical' size={16} style={{ width: '100%' }}>
      {manage ? (
        <Space>
          <Switch
            checked={!gallery.closed}
            loading={busy === 'closed'}
            onChange={open => run('closed', () => api.setGalleryClosed(assignmentId, !open))}
            aria-label={intl.formatMessage({ id: 'lesson_gallery.students_upload' })}
          />
          <Text>
            <FormattedMessage id='lesson_gallery.students_upload' />
          </Text>
        </Space>
      ) : null}
      {gallery.closed && !manage ? (
        <Alert type='info' showIcon title={<FormattedMessage id='lesson_gallery.closed' />} />
      ) : null}
      {gallery.canUpload ? (
        <Space orientation='vertical' size={8} style={{ width: '100%' }}>
          <Space wrap>
            <Upload
              accept={ALLOWED_FILE_ACCEPT}
              multiple
              showUploadList={false}
              disabled={limitReached}
              beforeUpload={beforeUpload}
              customRequest={({ file }) => upload(file)}>
              <Button type='primary' icon={<UploadOutlined />} disabled={limitReached}>
                <FormattedMessage id='lesson_gallery.upload' />
              </Button>
            </Upload>
            <Button icon={<FolderOpenOutlined />} onClick={openPicker} disabled={limitReached}>
              <FormattedMessage id='lesson_gallery.pick' />
            </Button>
          </Space>
          <Text type='secondary'>
            <FormattedMessage
              id={manage ? 'lesson_gallery.hint_teacher' : 'lesson_gallery.hint_student'}
              values={{ max: gallery.maxFilesPerUser, count: mineCount }}
            />
          </Text>
          {uploads.map(u => (
            <UploadProgress
              key={u.uid}
              name={u.name}
              percent={u.percent}
              size='small'
              onCancel={u.cancel}
            />
          ))}
        </Space>
      ) : null}
      {items.length ? (
        <Space>
          <Switch
            size='small'
            checked={split}
            onChange={toggleSplit}
            aria-label={intl.formatMessage({ id: 'lesson_gallery.split_mine' })}
          />
          <Text>
            <FormattedMessage id='lesson_gallery.split_mine' />
          </Text>
        </Space>
      ) : null}
      {!items.length ? (
        <Empty description={<FormattedMessage id='lesson_gallery.empty' />} />
      ) : split ? (
        <React.Fragment>
          {section('lesson_gallery.section_mine', mine, 'lesson_gallery.empty_mine')}
          {section('lesson_gallery.section_others', others, 'lesson_gallery.empty_others')}
        </React.Fragment>
      ) : (
        grid(items)
      )}
      <CaptionModal
        item={captioning}
        onCancel={() => setCaptioning(null)}
        onSave={async caption => {
          const ok = await run(captioning.id, () =>
            api.updateGalleryItem(assignmentId, captioning.id, { caption }),
          )
          if (ok) setCaptioning(null)
        }}
      />
      <FilePickerModal
        open={picker}
        title={<FormattedMessage id='lesson_gallery.pick' />}
        okText={<FormattedMessage id='lesson_gallery.share' />}
        files={library}
        unavailable={f =>
          sharedIds.has(f.id) ? intl.formatMessage({ id: 'file_picker.in_gallery' }) : null
        }
        max={manage ? undefined : Math.max(0, gallery.maxFilesPerUser - mineCount)}
        emptyText={<FormattedMessage id='class_files.pick_empty' />}
        onCancel={() => setPicker(false)}
        onPick={sharePicked}
      />
    </Space>
  )
}

/**
 * "Галерея урока" button of an assignment with the number of files; opens the gallery in a
 * drawer. Shown only when the backend has galleries on (assignment.galleryEnabled).
 */
const LessonGalleryButton = ({ assignment, onChanged }) => {
  const [open, setOpen] = useState(false)
  const [count, setCount] = useState(assignment.galleryCount || 0)
  useEffect(() => setCount(assignment.galleryCount || 0), [assignment.galleryCount])
  const changed = useCallback(data => setCount((data?.items || []).length), [])

  if (!assignment.galleryEnabled) return null
  const close = () => {
    setOpen(false)
    onChanged?.()
  }
  return (
    <React.Fragment>
      <Button type='link' icon={<PictureOutlined />} onClick={() => setOpen(true)}>
        <FormattedMessage id='lesson_gallery.open' values={{ count }} />
      </Button>
      <Drawer
        open={open}
        onClose={close}
        size='min(760px, 100vw)'
        destroyOnHidden
        title={<FormattedMessage id='lesson_gallery.title' values={{ title: assignment.title }} />}>
        {open ? <LessonGallery assignmentId={assignment.id} onChanged={changed} /> : null}
      </Drawer>
    </React.Fragment>
  )
}

export default LessonGalleryButton
