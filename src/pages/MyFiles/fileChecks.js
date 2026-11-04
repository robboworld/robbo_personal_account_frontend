import { isAllowedFileName } from '@/api/userFiles'
import { formatFileSize, formatStorageMb } from '@/helpers/tariffs'

const MB = 1024 * 1024

/** Per-file limit in MB: maxFileSizeMb, or the project limit from an older backend. */
export const maxFileSizeMb = entitlements =>
  Number(entitlements?.maxFileSizeMb ?? entitlements?.maxProjectSizeMb) || 0

/** Free space in bytes, or null when the quota is unknown. */
export const freeStorageBytes = entitlements => {
  const quotaMb = Number(entitlements?.storageQuotaMb) || 0
  if (quotaMb <= 0) return null
  return Math.max(0, quotaMb * MB - (Number(entitlements.usedBytes) || 0))
}

/**
 * What stops the upload before it starts, or null. The backend checks everything again;
 * this only saves the user a long upload that would be refused.
 */
export const precheckUpload = (file, entitlements) => {
  if (!isAllowedFileName(file?.name)) {
    return { reason: 'type' }
  }
  const limitMb = maxFileSizeMb(entitlements)
  if (limitMb > 0 && file.size > limitMb * MB) {
    return { reason: 'size', limitMb }
  }
  const free = freeStorageBytes(entitlements)
  if (free !== null && file.size > free) {
    return { reason: 'quota', freeBytes: free }
  }
  return null
}

/** The message for a precheckUpload problem. */
export const uploadProblemMessage = (intl, file, problem) => {
  if (problem.reason === 'type') {
    return intl.formatMessage({ id: 'my_files.type_not_allowed' })
  }
  if (problem.reason === 'size') {
    return intl.formatMessage(
      { id: 'my_files.too_large' },
      { name: file.name, size: formatStorageMb(intl, problem.limitMb) },
    )
  }
  return intl.formatMessage(
    { id: 'my_files.no_space' },
    { free: formatFileSize(intl, problem.freeBytes), size: formatFileSize(intl, file.size) },
  )
}
