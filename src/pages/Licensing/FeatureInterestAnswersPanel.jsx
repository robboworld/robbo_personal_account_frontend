import React, { useCallback, useEffect, useState } from 'react'
import { Empty, Spin, Table, Tag, Tooltip, Typography } from 'antd'
import { useIntl } from 'react-intl'

import { GlassPanel, SectionHeader, SectionHint, SectionTitle } from '@/components/AccountShell'
import { listFeatureInterestAnswers } from '@/api/licensing'
import { apiErrorMessage } from '@/helpers/apiErrorMessage'

const { Text, Paragraph } = Typography
const PAGE_SIZE = 20
// Sources with their own tooltip text; the backend drops any other value.
const KNOWN_SOURCES = ['landing', 'licenses', 'home', 'rs-desktop', 'rs-web']
const TAG_STYLE = { cursor: 'help' }

// SuperAdmin only: feedback collected by the paid-edition survey above.
const FeatureInterestAnswersPanel = () => {
  const intl = useIntl()
  const t = (id, values) => intl.formatMessage({ id }, values)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [data, setData] = useState({ answers: [], total: 0 })

  const load = useCallback(
    async nextPage => {
      setLoading(true)
      setError('')
      try {
        setData(
          await listFeatureInterestAnswers({
            limit: PAGE_SIZE,
            offset: (nextPage - 1) * PAGE_SIZE,
          }),
        )
        setPage(nextPage)
      } catch (e) {
        setError(apiErrorMessage(e, intl))
      } finally {
        setLoading(false)
      }
    },
    [intl],
  )

  useEffect(() => {
    load(1)
  }, [load])

  const formatDate = iso => (iso ? intl.formatDate(iso, { dateStyle: 'medium', timeStyle: 'short' }) : '')

  const columns = [
    {
      title: t('interest_admin.col_date'),
      dataIndex: 'updatedAt',
      width: 160,
      render: formatDate,
    },
    {
      title: t('interest_admin.col_role'),
      dataIndex: 'role',
      width: 150,
      render: role => t(`interest.role.${role}`),
    },
    {
      title: t('interest_admin.col_feature'),
      dataIndex: 'feature',
      width: 260,
      render: (feature, row) => (
        <React.Fragment>
          <div>{t(`interest.feature.${feature}`)}</div>
          {row.other ? <Text type='secondary'>{row.other}</Text> : null}
        </React.Fragment>
      ),
    },
    {
      title: t('interest_admin.col_pain'),
      dataIndex: 'pain',
      render: pain =>
        pain ? <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{pain}</Paragraph> : '—',
    },
    {
      title: t('interest_admin.col_org'),
      dataIndex: 'org',
      width: 180,
      render: org => org || '—',
    },
    {
      title: t('interest_admin.col_extra'),
      key: 'extra',
      width: 140,
      render: (_, row) => (
        <React.Fragment>
          {row.notify ? (
            <Tooltip title={t('interest_admin.notify_tip')}>
              <Tag color='green' style={TAG_STYLE}>
                {t('interest_admin.notify')}
              </Tag>
            </Tooltip>
          ) : null}
          {row.source ? (
            <Tooltip
              title={t(
                KNOWN_SOURCES.includes(row.source)
                  ? `interest_admin.source_tip.${row.source}`
                  : 'interest_admin.source_tip.unknown',
              )}>
              <Tag style={TAG_STYLE}>{row.source}</Tag>
            </Tooltip>
          ) : null}
        </React.Fragment>
      ),
    },
  ]

  return (
    <GlassPanel id='interest-answers'>
      <SectionHeader>
        <SectionTitle>{t('interest_admin.title')}</SectionTitle>
        <SectionHint>{t('interest_admin.hint', { total: data.total })}</SectionHint>
      </SectionHeader>
      {error ? (
        <Text type='danger'>{error}</Text>
      ) : loading && data.answers.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
          <Spin />
        </div>
      ) : (
        <Table
          rowKey='key'
          size='middle'
          loading={loading}
          columns={columns}
          dataSource={data.answers.map((row, i) => ({ ...row, key: (page - 1) * PAGE_SIZE + i }))}
          scroll={{ x: 900 }}
          locale={{ emptyText: <Empty description={t('interest_admin.empty')} /> }}
          pagination={{
            current: page,
            pageSize: PAGE_SIZE,
            total: data.total,
            showSizeChanger: false,
            hideOnSinglePage: true,
            onChange: load,
          }}
        />
      )}
    </GlassPanel>
  )
}

export default FeatureInterestAnswersPanel
