# Estructura del Proyecto Frontend

## Gestión de dependencias (pnpm)

**El proyecto utiliza pnpm exclusivamente.** Todos los comandos deben ejecutarse con pnpm:

```bash
pnpm install          # Instalar dependencias
pnpm dev              # Servidor de desarrollo
pnpm build            # Build de producción
pnpm preview          # Preview del build
pnpm add <pkg>        # Añadir dependencia
pnpm add -D <pkg>     # Añadir dependencia de desarrollo
pnpm exec <cmd>       # Ejecutar comando (ej: pnpm exec vite)
```

El `package.json` incluye `"packageManager": "pnpm"` para forzar su uso (Corepack).

---

## Árbol de directorios

```
src/
├── components/           # Componentes UI reutilizables
│   ├── ui/              # Shadcn components
│   ├── layout/          # Header, Sidebar, etc.
│   └── common/          # Button, Card, Modal, etc.
│
├── features/            # Módulos por dominio
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   └── types.ts
│   ├── invitations/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   └── types.ts
│   ├── reservations/
│   ├── payments/
│   └── security/
│
├── hooks/               # Hooks globales
│   ├── api/             # Custom hooks de TanStack Query por dominio
│   │   ├── useAuth.ts
│   │   ├── useInvitations.ts
│   │   ├── useReservations.ts
│   │   ├── usePayments.ts
│   │   └── useSpaces.ts
│   └── useMediaQuery.ts
│
├── api/                 # Cliente HTTP y servicios
│   ├── client.ts        # Axios/fetch configurado con interceptors
│   ├── endpoints.ts     # Constantes de endpoints
│   └── services/
│       ├── auth.service.ts
│       ├── invitations.service.ts
│       ├── reservations.service.ts
│       ├── payments.service.ts
│       ├── spaces.service.ts
│       └── upload.service.ts
│
├── store/               # Zustand (solo si es necesario)
│   └── auth.store.ts    # Estado de auth si no se usa solo TanStack Query
│
├── routes/              # TanStack Router (file-based)
│   ├── __root.tsx       # Root layout
│   ├── index.tsx        # / (redirect)
│   ├── login.tsx        # /login
│   ├── _authenticated/  # Layout pathless (protegido)
│   │   ├── route.tsx
│   │   ├── dashboard.tsx
│   │   ├── invitations/
│   │   │   ├── index.tsx
│   │   │   └── new.tsx
│   │   ├── reservations.tsx
│   │   └── payments.tsx
│   ├── _security/       # Layout pathless (seguridad)
│   │   ├── route.tsx
│   │   └── scan.tsx
│   └── invite/qr/
│       └── $token.tsx   # /invite/qr/:token
│
├── layouts/
│   ├── AuthLayout.tsx
│   ├── DashboardLayout.tsx
│   └── SecurityLayout.tsx
│
├── lib/
│   ├── utils.ts
│   └── constants.ts
│
├── types/               # Tipos compartidos
│   └── index.ts
│
├── utils/
│   ├── validators.ts
│   └── format.ts
│
├── main.tsx
└── App.tsx
```

## Convenciones

### Custom Hooks por dominio
Cada feature tiene sus hooks en `hooks/api/` que encapsulan TanStack Query:

```ts
// hooks/api/useInvitations.ts
export function useInvitations() {
  return useQuery({ queryKey: ['invitations'], queryFn: invitationsService.getAll })
}
export function useCreateInvitation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: invitationsService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invitations'] })
  })
}
```

### Services
Cada service llama al API client y retorna datos tipados:

```ts
// api/services/invitations.service.ts
export const invitationsService = {
  getAll: () => apiClient.get<Invitation[]>('/invitations'),
  create: (data) => apiClient.post<Invitation>('/invitations', data),
  validate: (token) => apiClient.get(`/invitations/validate/${token}`),
  scan: (data) => apiClient.post('/invitations/scan', data),
}
```

### Rutas protegidas por rol
```ts
// _authenticated/route.tsx
const role = useAuthStore(s => s.user?.role)
if (!role) redirect('/login')
// children solo si tiene acceso al rol requerido
```
