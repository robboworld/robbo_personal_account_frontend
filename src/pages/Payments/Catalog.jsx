import React from 'react'
import { Navigate } from 'react-router-dom'

import { MY_LICENSES_ROUTE } from '@/constants'

/** @deprecated Catalog merged into MyLicenses; keep redirect for old imports. */
const CatalogPage = () => <Navigate to={`${MY_LICENSES_ROUTE}#buy`} replace />

export default CatalogPage
