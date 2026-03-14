import { createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { RootLayout } from '@/layouts/RootLayout'

export const Route = createRootRoute({
  component: () => (
    <>
      <RootLayout />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  ),
})
