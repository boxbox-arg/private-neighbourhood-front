# Arquitectura del Sistema - Barrios Privados

## Gestión de paquetes

El frontend utiliza **pnpm** para todas las operaciones de dependencias (install, add, scripts). No usar npm ni yarn.

---

## 1. Visión General

Aplicación web mobile-first para la administración de barrios privados (gated communities), enfocada en:
- **Accesos de invitados** mediante QR
- **Reservas de espacios comunes**
- **Registro de pagos** (expensas)

---

## 2. Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (React SPA)                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │   Auth      │  │ Invitations │  │ Reservations│  │    Payments     │ │
│  │   Module    │  │   Module    │  │   Module    │  │     Module      │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────────┬────────┘ │
│         │                │                │                   │          │
│         └────────────────┴────────────────┴───────────────────┘          │
│                                    │                                     │
│                         TanStack Query + API Client                       │
│                                    │                                     │
└────────────────────────────────────┼─────────────────────────────────────┘
                                     │ HTTPS
                                     │ JWT Bearer
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          BACKEND API (REST)                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │   Auth      │  │ Invitations │  │ Reservations│  │    Payments     │ │
│  │   Service   │  │   Service   │  │   Service   │  │    Service      │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────┘ │
│                                    │                                     │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Middleware: JWT + RBAC                         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                     │
└────────────────────────────────────┼─────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    PostgreSQL + S3/Storage                               │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Modelo de Datos

### Diagrama ER

```
Users ──────┬──────────────────────────────────────────────────────
│           │
│ 1:N       │ 1:N
▼           ▼
Invitations    Payments
│           │
│ 1:N       │
▼           │
AccessLogs  │
            │
CommonSpaces ◄──── Reservations (N:1 Resident)
```

### Entidades Detalladas

#### Users
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| name | string | Nombre completo |
| email | string | Email único |
| phone | string | Teléfono |
| house_number | string | Número de casa/lote |
| role | enum | ADMIN, RESIDENT, SECURITY |
| status | enum | ACTIVE, INACTIVE, SUSPENDED |
| password_hash | string | Hash bcrypt (solo backend) |
| created_at | timestamp | |
| updated_at | timestamp | |

#### Invitations
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| resident_id | UUID | FK → Users |
| max_guests | int | Límite de invitados |
| used_guests | int | Invitados ya utilizados |
| expires_at | timestamp | Fecha de expiración |
| qr_token | string | Token aleatorio único (indexado) |
| status | enum | PENDING, ACTIVE, EXPIRED, EXHAUSTED |
| created_at | timestamp | |
| updated_at | timestamp | |

#### AccessLogs
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| invitation_id | UUID | FK → Invitations |
| guest_name | string | Nombre del invitado |
| scanned_by_security_id | UUID | FK → Users (rol SECURITY) |
| timestamp | timestamp | |
| validation_result | enum | VALID, EXPIRED, NO_CAPACITY, INVALID_TOKEN |

#### CommonSpaces
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| name | string | ej: Quincho, Cancha, Salón |
| description | text | |
| max_hours | int | Default 6 |

#### Reservations
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| resident_id | UUID | FK → Users |
| space_id | UUID | FK → CommonSpaces |
| start_time | timestamp | |
| end_time | timestamp | |
| status | enum | PENDING, CONFIRMED, CANCELLED, COMPLETED |
| created_at | timestamp | |
| updated_at | timestamp | |

#### Payments
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| resident_id | UUID | FK → Users |
| amount | decimal | Monto |
| date | date | Fecha del pago |
| description | string | Concepto |
| receipt_url | string | URL del comprobante (S3) |
| created_by | UUID | FK → Users (Admin) |
| created_at | timestamp | |
| updated_at | timestamp | |

---

## 4. API Endpoints

### Autenticación
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Login, retorna JWT | No |
| POST | `/api/auth/refresh` | Renovar token | Refresh token |
| POST | `/api/auth/logout` | Invalidar sesión | Sí |
| GET | `/api/auth/me` | Usuario actual | Sí |

### Invitaciones
| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| POST | `/api/invitations` | Crear invitación | RESIDENT |
| GET | `/api/invitations` | Listar mis invitaciones | RESIDENT |
| GET | `/api/invitations/:id` | Detalle invitación | RESIDENT, ADMIN |
| GET | `/api/invitations/all` | Todas las invitaciones | ADMIN |
| GET | `/api/invitations/validate/:qr_token` | Validar QR (pre-check) | SECURITY |
| POST | `/api/invitations/scan` | Registrar acceso (scan completo) | SECURITY |

### Body POST /api/invitations/scan
```json
{
  "qr_token": "8a7d91a2-32b1-4e3a-9c8c-0a1b2d3e4f5g",
  "guest_name": "Juan Pérez"
}
```

### Espacios Comunes
| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| GET | `/api/spaces` | Listar espacios | RESIDENT, ADMIN |
| POST | `/api/spaces` | Crear espacio | ADMIN |
| PUT | `/api/spaces/:id` | Actualizar espacio | ADMIN |
| DELETE | `/api/spaces/:id` | Eliminar espacio | ADMIN |

### Reservas
| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| GET | `/api/reservations` | Mis reservas / filtrar | RESIDENT, ADMIN |
| GET | `/api/reservations/calendar` | Eventos para calendario | RESIDENT, ADMIN |
| POST | `/api/reservations` | Crear reserva | RESIDENT |
| DELETE | `/api/reservations/:id` | Cancelar reserva | RESIDENT, ADMIN |
| GET | `/api/spaces/:id/availability` | Horarios disponibles | RESIDENT, ADMIN |

### Pagos
| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| GET | `/api/payments` | Listar pagos (filtrado por residente si no admin) | RESIDENT, ADMIN |
| POST | `/api/payments` | Registrar pago + upload | ADMIN |
| GET | `/api/payments/:id/receipt` | Obtener comprobante | RESIDENT, ADMIN |

### Accesos
| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| GET | `/api/access-logs` | Registros de acceso | ADMIN, SECURITY |
| GET | `/api/access-logs?invitation_id=` | Por invitación | ADMIN |

### Usuarios (Admin)
| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| GET | `/api/users` | Listar residentes/usuarios | ADMIN |
| POST | `/api/users` | Crear usuario | ADMIN |
| PUT | `/api/users/:id` | Actualizar usuario | ADMIN |

### Archivos
| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| POST | `/api/upload` | Subir comprobante (multipart/form-data) | ADMIN |

---

## 5. Flujo de Autenticación (JWT)

```
┌──────────┐     POST /auth/login      ┌──────────┐
│  Client  │ ────────────────────────► │  Backend │
│          │   { email, password }     │          │
│          │ ◄──────────────────────── │          │
│          │   { access_token,         │          │
│          │     refresh_token,        │  Valida  │
│          │     user }                │  bcrypt  │
└────┬─────┘                           └──────────┘
     │
     │  Guarda tokens (httpOnly cookie o memory + secure storage)
     │
     │  Cada request:
     │  Authorization: Bearer <access_token>
     │
     ▼
┌──────────────────────────────────────────────┐
│  Middleware: Verifica JWT → extrae role      │
│  → autoriza según RBAC                       │
└──────────────────────────────────────────────┘
```

### Estrategia de Tokens
- **Access Token**: JWT, exp 15-30 min, claims: `{ sub (userId), role, email }`
- **Refresh Token**: opcional, exp 7 días, almacenado seguro
- En mobile/PWA: considerar `localStorage` o `sessionStorage` para access; refresh en httpOnly si hay backend con cookies

---

## 6. Sistema de QR - Generación y Validación

### Generación (Residente)

1. Residente crea invitación: `max_guests`, `expires_at`
2. Backend genera `qr_token` (UUID v4 o random 32 chars)
3. Guarda en `invitations` con `status: ACTIVE`
4. Frontend genera QR con URL: `https://app.com/invite/qr/{qr_token}`

```javascript
// react-qr-code
<QRCodeSVG value={`${APP_URL}/invite/qr/${invitation.qr_token}`} size={256} />
```

### URL del QR
- **Producción**: `https://tu-app.com/invite/qr/8a7d91a2-32b1-4e3a-9c8c-0a1b2d3e4f5g`
- Esta URL abre una página **pública** que muestra:
  - "Invitación válida - Mostrar este QR en el acceso"
  - El mismo QR o mensaje para el guardia

### Flujo de Escaneo (Seguridad)

```
Seguridad abre app → Pantalla escáner (cámara o input manual)
    │
    ▼
Escanea QR → Extrae token de la URL
    │
    ▼
GET /api/invitations/validate/:token (opcional, para preview)
    │
    ▼
Seguridad ingresa nombre del invitado
    │
    ▼
POST /api/invitations/scan { qr_token, guest_name }
    │
    ▼
Backend (transaccional):
  1. SELECT invitation WHERE qr_token = ? FOR UPDATE
  2. Validar: !expired, used_guests < max_guests
  3. INSERT access_log
  4. UPDATE invitations SET used_guests = used_guests + 1
  5. COMMIT
    │
    ▼
Response: { success, message, validation_result }
```

### Feedback Visual
- 🟢 **VALID**: Acceso permitido
- 🔴 **EXPIRED**: Invitación expirada
- 🟡 **NO_CAPACITY**: Sin cupo disponible
- 🔴 **INVALID_TOKEN**: Token inexistente o inválido

---

## 7. Estrategia de Subida de Archivos

### Opción A: Upload directo al Backend
```
Client → POST /api/upload (multipart/form-data)
         Backend guarda en disco/S3
         Retorna: { url: "https://storage/..." }
```

### Opción B: Presigned URL (recomendado para S3)
```
Client → POST /api/payments (con metadata, sin archivo)
         Backend genera presigned URL S3
         Retorna: { upload_url, payment_id }

Client → PUT upload_url (archivo directo a S3)

Client → PATCH /api/payments/:id/confirm (confirmar subida)
```

### Campos del formulario de pago
- `resident_id`, `amount`, `date`, `description`
- `receipt`: File (image/*, application/pdf)
- Validación frontend: max 5MB, tipos permitidos

### Almacenamiento
- **S3** (o compatible: MinIO, Cloudflare R2)
- Bucket privado, URLs firmadas con expiración
- Path: `receipts/{community_id}/{payment_id}/{filename}`

---

## 8. Recomendaciones de Seguridad

### General
1. **HTTPS** obligatorio en producción
2. **CORS** restrictivo: solo dominios de la app
3. **Rate limiting** en login y en `/invitations/scan`
4. **Validación de entrada** estricta (Zod, Joi, etc.)

### Autenticación
5. **JWT** en header, no en query params
6. **Refresh token rotation** si se implementa
7. **Logout** invalidar token en blacklist (opcional) o confiar en exp

### QR
8. **qr_token** debe ser impredecible (crypto.randomBytes)
9. **Transacciones** para incrementar `used_guests` (evitar race conditions)
10. **No exponer** datos sensibles en el QR, solo token

### Archivos
11. **Validar MIME type** en backend (no confiar en extensión)
12. **Escaneo de malware** en uploads (ClamAV, etc.)
13. **URLs firmadas** con expiración corta para descarga

### Autorización
14. **Middleware RBAC** en cada ruta
15. **Filtrado de datos** por tenant/community si es multi-tenant
16. Residente solo ve sus invitaciones, pagos, reservas

---

## 9. Frontend - Estructura Detallada

Ver `STRUCTURE.md` en este directorio.

---

## 10. Consideraciones de Reservas

### Validaciones Backend
- `end_time - start_time <= max_hours` (6)
- No superposición: `NOT (new.end < existing.start OR new.start > existing.end)`
- `start_time` y `end_time` en slots de 1 hora (opcional, para simplificar)

### Vista Calendario
- Librería sugerida: `@fullcalendar/core` + `@fullcalendar/daygrid` + `@fullcalendar/timegrid`
- O componente custom con grid de días/horas
