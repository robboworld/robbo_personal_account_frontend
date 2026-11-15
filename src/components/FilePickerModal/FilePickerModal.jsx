import React, { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Checkbox,
  Empty,
  Input,
  Modal,
  Select,
  Space,
  Spin,
  Tag,
  Tooltip,
  Typography,
  theme,
} from 'antd'
import { SearchOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons'
import { FormattedMessage, useIntl } from 'react-intl'

import FileThumb from './FileThumb'
import { PICKER_GROUPS, pickerGroupIndex, pickerGroupOf } from './kindGroups'

import { EXTENSIONS_BY_KIND, fetchFileBlob } from '@/api/userFiles'
import { FileNameCell } from '@/components/FileIcon'
import { formatFileSize } from '@/helpers/tariffs'

const { Text } = Typography

const byName = (a, b) => String(a.name).localeCompare(String(b.name), 'ru', { numeric: true })
const extOf = name => String(name).split('.').pop().toLowerCase()

/** Ascending comparators; each field starts in the direction one usually wants. */
const SORTS = {
  date: {
    cmp: (a, b) => String(a.createdAt || '').localeCompare(String(b.createdAt || '')),
    desc: true,
  },
  name: { cmp: byName, desc: false },
  size: { cmp: (a, b) => (Number(a.sizeBytes) || 0) - (Number(b.sizeBytes) || 0), desc: true },
  // Pictures, then Scratch… as in the type filter; then by extension and name.
  type: {
    cmp: (a, b) =>
      pickerGroupIndex(a.kind) - pickerGroupIndex(b.kind) ||
      extOf(a.name).localeCompare(extOf(b.name)) ||
      byName(a, b),
    desc: false,
  },
}

const comparator = (field, desc) => {
  const { cmp } = SORTS[field]
  // Ties keep a stable order by name whichever way the field goes.
  return (a, b) => (desc ? cmp(b, a) : cmp(a, b)) || byName(a, b)
}

/** One tile: preview, name, size and date; the whole tile toggles the checkbox. */
const Tile = ({ file, checked, disabled, reason, onToggle }) => {
  const intl = useIntl()
  const { token } = theme.useToken()
  const date = file.createdAt
    ? intl.formatDate(file.createdAt, { day: '2-digit', month: '2-digit', year: 'numeric' })
    : ''
  return (
    <label
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        border: `${checked ? 2 : 1}px solid ${checked ? token.colorPrimary : token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        overflow: 'hidden',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: reason ? 0.55 : 1,
        background: token.colorBgContainer,
      }}>
      <Checkbox
        checked={checked}
        disabled={disabled}
        onChange={() => onToggle(file.id)}
        aria-label={file.name}
        style={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}
      />
      {reason ? (
        <Tag style={{ position: 'absolute', top: 6, right: 0, zIndex: 1 }}>{reason}</Tag>
      ) : null}
      <FileThumb file={file} height={110} fetchBlob={signal => fetchFileBlob(file.id, signal)} />
      <div
        style={{
          padding: '8px 10px',
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}>
        <FileNameCell name={file.name} hasScripts={file.hasScripts} />
        <Text type='secondary' style={{ fontSize: 12 }}>
          {formatFileSize(intl, file.sizeBytes)}
          {date ? ` · ${date}` : ''}
        </Text>
      </div>
    </label>
  )
}

/**
 * Choosing files from "Мои файлы" as tiles with previews, search, type chips (several at once)
 * and sorting by date, name, size or type in either direction.
 * files: the library (null while it loads). unavailable(file) → a short reason (the tile is shown
 * greyed and can't be picked) or null. max: how many may be picked (undefined — no limit).
 * onPick(files) gets the chosen rows in the chosen sort order.
 */
const FilePickerModal = ({
  open,
  title,
  okText,
  files,
  unavailable = () => null,
  max,
  emptyText,
  onCancel,
  onPick,
}) => {
  const intl = useIntl()
  const [query, setQuery] = useState('')
  const [groups, setGroups] = useState([]) // none — every type
  const [sortField, setSortField] = useState('date')
  const [desc, setDesc] = useState(true)
  const [picked, setPicked] = useState([])

  useEffect(() => {
    if (!open) return
    setQuery('')
    setGroups([])
    setSortField('date')
    setDesc(true)
    setPicked([])
  }, [open])

  const all = useMemo(() => files || [], [files])
  // Types the library has, with how many files of each.
  const present = useMemo(() => {
    const counts = {}
    all.forEach(f => {
      const g = pickerGroupOf(f.kind)
      counts[g] = (counts[g] || 0) + 1
    })
    return PICKER_GROUPS.filter(g => counts[g.key]).map(g => ({ ...g, count: counts[g.key] }))
  }, [all])

  const order = useMemo(() => comparator(sortField, desc), [sortField, desc])
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return all
      .filter(
        f =>
          (!groups.length || groups.includes(pickerGroupOf(f.kind))) &&
          (!q || f.name.toLowerCase().includes(q)),
      )
      .sort(order)
  }, [all, query, groups, order])

  const toggleGroup = key =>
    setGroups(gs => (gs.includes(key) ? gs.filter(g => g !== key) : [...gs, key]))
  const chooseSort = field => {
    setSortField(field)
    setDesc(SORTS[field].desc)
  }

  const limited = Number.isFinite(max)
  const left = limited ? Math.max(0, max - picked.length) : Infinity
  const toggle = id =>
    setPicked(ids => (ids.includes(id) ? ids.filter(x => x !== id) : left > 0 ? [...ids, id] : ids))
  // Picked files stay picked when the search hides them.
  const pick = () => onPick(all.filter(f => picked.includes(f.id)).sort(order))

  const footer = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <Text type='secondary' style={{ marginRight: 'auto' }}>
        <FormattedMessage id='file_picker.selected' values={{ count: picked.length }} />
        {limited ? <FormattedMessage id='file_picker.left' values={{ left }} /> : null}
      </Text>
      <Button onClick={onCancel}>
        <FormattedMessage id='common.cancel' />
      </Button>
      <Button type='primary' disabled={!picked.length} onClick={pick}>
        {okText}
        {picked.length ? ` (${picked.length})` : ''}
      </Button>
    </div>
  )

  let body
  if (!files) {
    body = (
      <div style={{ textAlign: 'center', padding: 32 }}>
        <Spin />
      </div>
    )
  } else if (!all.length) {
    body = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={emptyText} />
  } else {
    body = (
      <Space orientation='vertical' size={12} style={{ width: '100%' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={intl.formatMessage({ id: 'file_picker.search' })}
            aria-label={intl.formatMessage({ id: 'file_picker.search' })}
            style={{ flex: '1 1 200px' }}
          />
          <Select
            value={sortField}
            onChange={chooseSort}
            aria-label={intl.formatMessage({ id: 'file_picker.sort' })}
            style={{ minWidth: 170 }}
            options={Object.keys(SORTS).map(k => ({
              value: k,
              label: intl.formatMessage({ id: `file_picker.sort_${k}` }),
            }))}
          />
          <Tooltip
            title={intl.formatMessage({
              id: desc ? 'file_picker.sort_desc' : 'file_picker.sort_asc',
            })}>
            <Button
              icon={desc ? <SortDescendingOutlined /> : <SortAscendingOutlined />}
              onClick={() => setDesc(d => !d)}
              aria-label={intl.formatMessage({
                id: desc ? 'file_picker.sort_desc' : 'file_picker.sort_asc',
              })}
              aria-pressed={desc}
            />
          </Tooltip>
        </div>
        {/* Always shown, even for one type: the student sees what kinds of files are here. */}
        <div
          role='group'
          aria-label={intl.formatMessage({ id: 'file_picker.kind' })}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <Tag.CheckableTag checked={!groups.length} onChange={() => setGroups([])}>
            <FormattedMessage id='file_picker.kind_all' /> {all.length}
          </Tag.CheckableTag>
          {present.map(g => (
            <Tooltip
              key={g.key}
              title={g.kinds.flatMap(k => EXTENSIONS_BY_KIND[k] || []).join(', ')}>
              <Tag.CheckableTag
                checked={groups.includes(g.key)}
                onChange={() => toggleGroup(g.key)}>
                {intl.formatMessage({ id: g.label })} {g.count}
              </Tag.CheckableTag>
            </Tooltip>
          ))}
        </div>
        {shown.length ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: 12,
              maxHeight: '55vh',
              overflowY: 'auto',
              padding: 2,
            }}>
            {shown.map(f => {
              const reason = unavailable(f)
              const checked = picked.includes(f.id)
              return (
                <Tile
                  key={f.id}
                  file={f}
                  checked={checked}
                  reason={reason}
                  disabled={!!reason || (!checked && left <= 0)}
                  onToggle={toggle}
                />
              )
            })}
          </div>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={intl.formatMessage({ id: 'file_picker.nothing_found' })}
          />
        )}
      </Space>
    )
  }

  return (
    <Modal
      open={open}
      title={title}
      onCancel={onCancel}
      footer={files && all.length ? footer : null}
      width='min(880px, calc(100vw - 32px))'
      destroyOnHidden>
      {body}
    </Modal>
  )
}

export default FilePickerModal
