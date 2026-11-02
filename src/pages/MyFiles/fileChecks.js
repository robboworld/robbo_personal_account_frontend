import { isAllowedFileName } from '@/api/userFiles'

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
