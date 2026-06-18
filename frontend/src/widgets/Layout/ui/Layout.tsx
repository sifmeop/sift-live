import { Outlet } from '@tanstack/react-router'

import { Header } from '~/widgets/Header'

export const Layout = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="flex-1">
      <Outlet />
    </main>
  </div>
)
