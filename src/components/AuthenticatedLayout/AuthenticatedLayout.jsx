import React from 'react'
import { Outlet } from 'react-router-dom'

import PageLayout from '@/components/PageLayout'
import RouteTransitionOverlay from '@/components/RouteTransitionOverlay/RouteTransitionOverlay'
import { RequireAuth } from '@/helpers'

/** Persistent LK shell: sidebar + header + footer stay mounted across child routes. */
const PersistentShell = () => (
  <PageLayout>
    <RouteTransitionOverlay />
    <Outlet />
  </PageLayout>
)

const AuthenticatedShell = () => (
  <RequireAuth>
    <PersistentShell />
  </RequireAuth>
)

export default AuthenticatedShell
