import { useEffect, useState } from 'react'

import { listCatalog } from '@/api/payments'

// Limits the backend enforces (licensing.Free* constants, products table). Used until
// /payments/products answers, and if it cannot be reached. maxProjectSizeMb is per project,
// storageQuotaMb is the account total; no tariff caps the number of projects.
export const DEFAULT_TARIFFS = Object.freeze({
  // seatLimit 0: seats are RS3 Desktop activations by license key, Free has no license.
  free: {
    maxProjectSizeMb: 10,
    storageQuotaMb: 100,
    sessionLimit: 5,
    seatLimit: 0,
    amount: 0,
  },
  individual: {
    maxProjectSizeMb: 50,
    storageQuotaMb: 1024,
    sessionLimit: 10,
    seatLimit: 2,
    amount: 1990,
    durationDays: 365,
  },
  class: {
    maxProjectSizeMb: 50,
    storageQuotaMb: 5120,
    sessionLimit: 30,
    seatLimit: 30,
    amount: 35000,
    durationDays: 365,
  },
})

const SKU_TO_TARIFF = { 'rs3-premium-1y': 'individual', 'rs3-class-1y': 'class' }

const TARIFF_NAME_IDS = {
  free: 'tariff.name.free',
  individual: 'tariff.name.individual',
  class: 'tariff.name.class',
}

/**
 * Localized tariff name. The backend and products.title keep the English names
 * ("Free", "Individual", "Class") as identifiers; an unknown name is shown as is.
 */
export function tariffDisplayName(intl, name, sku) {
  const key = SKU_TO_TARIFF[sku] || String(name || 'free').trim().toLowerCase()
  const id = TARIFF_NAME_IDS[key]
  return id ? intl.formatMessage({ id }) : name
}

const productLimits = product => ({
  maxProjectSizeMb: Number(product.cloudQuotaMb) || 0,
  storageQuotaMb: Number(product.storageQuotaMb) || 0,
  sessionLimit: Number(product.sessionLimit) || 0,
  seatLimit: Number(product.seatLimit) || 0,
  amount: Number(product.amount) || 0,
  durationDays: Number(product.durationDays) || 0,
})

/** Merges /payments/products ({products, free}) over the defaults. */
export function tariffsFromCatalog(catalog) {
  const tariffs = { ...DEFAULT_TARIFFS }
  const free = catalog?.free
  if (free) {
    tariffs.free = {
      ...DEFAULT_TARIFFS.free,
      maxProjectSizeMb: Number(free.maxProjectSizeMb) || DEFAULT_TARIFFS.free.maxProjectSizeMb,
      storageQuotaMb: Number(free.storageQuotaMb) || DEFAULT_TARIFFS.free.storageQuotaMb,
      sessionLimit: Number(free.sessionLimit) || 0,
      seatLimit: Number(free.seatLimit) || 0,
    }
  }
  for (const product of catalog?.products || []) {
    const key = SKU_TO_TARIFF[product.sku]
    if (key) {
      tariffs[key] = productLimits(product)
    }
  }
  return tariffs
}

export function useTariffs() {
  const [tariffs, setTariffs] = useState(DEFAULT_TARIFFS)
  useEffect(() => {
    let active = true
    listCatalog()
      .then(catalog => {
        if (active) setTariffs(tariffsFromCatalog(catalog))
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])
  return tariffs
}

/** "100 MB", "1 GB", "1.5 GB" for a size in MB (1 GB = 1024 MB, as the backend counts). */
export function formatStorageMb(intl, megabytes) {
  const value = Number(megabytes) || 0
  if (value >= 1024) {
    const gb = intl.formatNumber(value / 1024, { maximumFractionDigits: 1 })
    return intl.formatMessage({ id: 'units.gb' }, { value: gb })
  }
  const mbValue = intl.formatNumber(value, { maximumFractionDigits: value < 10 ? 1 : 0 })
  return intl.formatMessage({ id: 'units.mb' }, { value: mbValue })
}

/** "Project up to N MB" + account total + "unlimited number of projects". */
export function projectLimitLines(intl, { maxProjectSizeMb, storageQuotaMb }) {
  return [
    intl.formatMessage({ id: 'tariff.project_size' }, { mb: maxProjectSizeMb }),
    ...(storageQuotaMb > 0
      ? [
          intl.formatMessage(
            { id: 'tariff.storage_total' },
            { size: formatStorageMb(intl, storageQuotaMb) },
          ),
        ]
      : []),
    intl.formatMessage({ id: 'tariff.projects_unlimited' }),
  ]
}

/** "N devices and M sign-ins"; only sign-ins without a device limit (Free has no seats). */
export function devicesSessionsLine(intl, { seatLimit, sessionLimit }) {
  if (!(seatLimit > 0)) {
    return intl.formatMessage({ id: 'tariff.sessions_only' }, { sessions: sessionLimit })
  }
  return intl.formatMessage(
    { id: 'tariff.devices_sessions' },
    { devices: seatLimit, sessions: sessionLimit },
  )
}

export function formatTariffPrice(intl, amount) {
  return intl.formatNumber(amount, { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })
}
