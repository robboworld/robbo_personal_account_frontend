import instance from './instance'

export async function issueLicense(payload) {
  const { data } = await instance.post('licensing/issue', payload, { withCredentials: true })
  return data
}

export async function listMyLicenses() {
  const { data } = await instance.get('licensing/mine', { withCredentials: true })
  return data?.licenses || []
}

export async function revokeSeat(licenseId, seatId) {
  const { data } = await instance.delete(`licensing/${licenseId}/seats/${seatId}`, { withCredentials: true })
  return data
}

export async function confirmDeviceLink({ userCode, licenseId }) {
  const { data } = await instance.post(
    'licensing/device/link/confirm',
    { userCode, licenseId: licenseId || '' },
    { withCredentials: true },
  )
  return data
}
