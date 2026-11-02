import React from 'react'
import { Progress, Typography } from 'antd'
import { useIntl } from 'react-intl'

import { UsageMeter, UsageMeterLabel, UsageMeterTop, UsageMeterValue } from './styles'

import { formatStorageMb } from '@/helpers/tariffs'
import theme from '@/theme'

export const METER_COLOR = theme.colors.accentGreen

const MB = 1024 * 1024

const { Text } = Typography

export const meterPercent = (used, limit) => {
  if (!limit || limit <= 0) {
    return 0
  }
  return Math.min(100, Math.round((used / limit) * 100))
}

export const meterStatus = percent => {
  if (percent >= 95) return 'exception'
  if (percent >= 80) return 'active'
  return 'normal'
}

/**
 * Account storage from /licensing/entitlements: usedBytes (projects + files) against
 * storageQuotaMb. Renders nothing when the quota is unknown.
 */
const StorageMeter = ({ entitlements, showBreakdown = false, fullMessageId }) => {
  const intl = useIntl()
  const storageMb = Number(entitlements?.storageQuotaMb) || 0
  if (storageMb <= 0) {
    return null
  }
  const usedMb = (Number(entitlements.usedBytes) || 0) / MB
  const storagePercent = meterPercent(usedMb, storageMb)
  const storageFull = usedMb >= storageMb

  return (
    <UsageMeter>
      <UsageMeterTop>
        <UsageMeterLabel>{intl.formatMessage({ id: 'licensing.storage' })}</UsageMeterLabel>
        <UsageMeterValue>
          {intl.formatMessage(
            { id: 'licensing.usage_count_value' },
            { used: formatStorageMb(intl, usedMb), limit: formatStorageMb(intl, storageMb) },
          )}
        </UsageMeterValue>
      </UsageMeterTop>
      <Progress
        percent={storagePercent}
        status={meterStatus(storagePercent)}
        strokeColor={storagePercent >= 95 ? undefined : METER_COLOR}
      />
      {showBreakdown ? (
        <Text type='secondary' style={{ fontSize: 13 }}>
          {intl.formatMessage(
            { id: 'storage.breakdown' },
            {
              projects: formatStorageMb(intl, (Number(entitlements.usedBytesProjects) || 0) / MB),
              files: formatStorageMb(intl, (Number(entitlements.usedBytesFiles) || 0) / MB),
            },
          )}
        </Text>
      ) : null}
      {storageFull ? (
        <Text type='secondary' style={{ fontSize: 13 }}>
          {intl.formatMessage({ id: fullMessageId || 'licensing.storage_full' })}
        </Text>
      ) : null}
    </UsageMeter>
  )
}

export default StorageMeter
