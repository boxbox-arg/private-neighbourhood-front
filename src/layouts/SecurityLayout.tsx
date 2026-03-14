import { Outlet } from '@tanstack/react-router'

export function SecurityLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Outlet />
    </div>
  )
}
