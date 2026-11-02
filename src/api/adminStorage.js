import instance from './instance'

/**
 * GET /api/admin/storage → { volume, totals, databases, top }.
 * volume is null when "My files" is off (no file volume to measure).
 */
export async function getStorageOverview() {
  const { data } = await instance.get('/api/admin/storage')
  return {
    volume: data?.volume || null,
    totals: data?.totals || {},
    databases: data?.databases || {},
    top: data?.top || [],
  }
}
