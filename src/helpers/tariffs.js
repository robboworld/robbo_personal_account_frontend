import { useEffect, useState } from 'react'

import { listCatalog } from '@/api/payments'

// Limits the backend enforces (licensing.Free* constants, products table). Used until
// /payments/products answers, and if it cannot be reached. The size limit is per project:
// paid tariffs do not cap the number of projects.
export const DEFAULT_TARIFFS = Object.freeze({
  free: { maxProjectSizeMb: 10, maxProjects: 20, sessionLimit: 2, seatLimit: 1, amount: 0 },
  individual: {
    maxProjectSizeMb: 100,
    maxProjects: 0,
    sessionLimit: 2,
    seatLimit: 2,
    amount: 1990,
    durationDays: 365,
  },
  class: {
    maxProjectSizeMb: 500,
    maxProjects: 0,
    sessionLimit: 20,
    seatLimit: 20,
    amount: 4990,
    durationDays: 365,
  },
})

const SKU_TO_TARIFF = { 'rs3-premium-1y': 'individual', 'rs3-class-1y': 'class' }

const productLimits = product => ({
  maxProjectSizeMb: Number(product.cloudQuotaMb) || 0,
  maxProjects: 0,
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
      maxProjects: Number(free.maxProjects) || 0,
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

/** "Project up to N MB" + project count line. */
export function projectLimitLines(intl, { maxProjectSizeMb, maxProjects }) {
  return [
    intl.formatMessage({ id: 'tariff.project_size' }, { mb: maxProjectSizeMb }),
    maxProjects > 0
      ? intl.formatMessage({ id: 'tariff.projects_max' }, { count: maxProjects })
      : intl.formatMessage({ id: 'tariff.projects_unlimited' }),
  ]
}

export function devicesSessionsLine(intl, { seatLimit, sessionLimit }) {
  return intl.formatMessage(
    { id: 'tariff.devices_sessions' },
    { devices: seatLimit, sessions: sessionLimit },
  )
}

export function formatTariffPrice(intl, amount) {
  return intl.formatNumber(amount, { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })
}
