# HANDOFF.md

## Project: Musician and Band Booking Marketplace

**Last updated:** 2026-05-07
**Current phase:** UI local estilo Airbnb — resultados limpios, imágenes visibles y flujo principal build-verificados

---

## Estado actual

⚠️ **MIGRACIÓN PENDIENTE** — Se agregaron campos de demos al schema. Correr en la máquina local:
```bash
npx prisma db push
npx prisma generate
npm run build
```

✅ El proyecto puede correr en **http://localhost:3000**
✅ Base de datos SQLite creada (`prisma/dev.db`)
✅ Seed aplicado: 18 géneros + 13 tipos de evento
✅ Prisma Client generado
✅ API routes principales creadas
✅ `npm run build` completado correctamente el 2026-05-07
⚠️ `npm run lint` pendiente: Next.js solicita configuración inicial interactiva de ESLint.
✅ Servidor de producción local actualizado levantado para revisión en `http://127.0.0.1:3007`
⚠️ `http://127.0.0.1:3006` quedó ocupado por un proceso anterior que no pudo cerrarse desde Codex por permisos del sistema; usar `3007` para ver la build más reciente.
⚠️ `next dev` en `http://127.0.0.1:3000` arrancó con errores `EMFILE: too many open files` del watcher y sirvió 404 en `/`; usar `npm run start -- --hostname 127.0.0.1 --port 3001` después de `npm run build` para revisar la UI sin watcher.

Para reiniciar el servidor: `npm run dev` dentro de la carpeta del proyecto.

---

## Lo que está construido y funciona

### Infraestructura
- Next.js 14.2.29 (App Router) + TypeScript + Tailwind CSS
- Prisma ORM con SQLite (`prisma/dev.db`) — 10 modelos
- NextAuth.js v4 con credentials provider
- Utilidad de detección de contactos (`src/lib/contact-detection.ts`)
- Utilidad de uploads locales (`src/lib/upload.ts`)

### API routes (creadas, build-verificadas; no probadas manualmente en navegador aún)

| Endpoint | Story | Estado |
|----------|-------|--------|
| `POST /api/auth/register` | US-MUS-001 | ✅ Creado |
| `GET /api/providers` | US-CON-003/004/005/006 | ✅ Creado |
| `GET /api/providers/[id]` | US-CON-008 | ✅ Creado |
| `PATCH /api/providers/[id]` | US-MUS-004/014 | ✅ Creado con detección |
| `GET /api/providers/[id]/contacts` | US-MON-001/002/004 | ✅ Creado con gate |
| `GET /api/genres` | US-MUS-007 | ✅ Creado |
| `GET /api/event-types` | US-MUS-006 | ✅ Creado |
| `PUT /api/providers/[id]/genres` | US-MUS-007 | ✅ Creado |
| `PUT /api/providers/[id]/event-types` | US-MUS-006 | ✅ Creado |
| `GET/POST /api/providers/[id]/repertoire` | US-MUS-009 | ✅ Creado |
| `DELETE /api/providers/[id]/repertoire/[songId]` | US-MUS-009 | ✅ Creado |
| `GET/POST /api/providers/[id]/contact-points` | US-MUS-013 | ✅ Creado |
| `DELETE /api/providers/[id]/contact-points/[contactPointId]` | US-MUS-013 | ✅ Creado |
| `POST /api/providers/[id]/publish` | US-MUS-015 | ✅ Creado |
| `POST /api/providers/[id]/image` | US-MUS-005 | ✅ Creado |
| `POST /api/providers/[id]/repertoire/upload` | US-MUS-010 | ✅ Creado |
| `POST /api/payments/unlock` | US-MON-001/002 | ✅ Stub local creado |
| `GET/POST/DELETE /api/subscriptions` | US-MON-003/004 | ✅ Stub local creado |
| `GET/POST/DELETE /api/saved` | US-CON-010 | ✅ Creado |
| `GET /api/unlocks` | US-MON-006 | ✅ Creado |
| `POST /api/providers/start` | US-MUS-001 | ✅ Creado |

### Base de datos
- 10 tablas creadas en SQLite
- 18 géneros musicales seeded
- 13 tipos de evento seeded

### Páginas UI
- `src/app/page.tsx` — Landing page estilo Airbnb
- `src/components/search/HomeSearchBox.tsx` — Búsqueda rápida editable desde la landing
- `src/app/(auth)/iniciar-sesion/page.tsx` — Login compartido
- `src/app/(auth)/registrarse/proveedor/page.tsx` — Registro de proveedor
- `src/app/(auth)/registrarse/contratante/page.tsx` — Registro de contratante
- `src/components/ui/Navbar.tsx` — Navegación compartida
- `src/app/(dashboard)/dashboard/page.tsx` — Dashboard básico del proveedor y contratante
- `src/app/(dashboard)/wizard/[step]/page.tsx` — Router dinámico del wizard
- `src/components/wizard/WizardShell.tsx` — Layout/progreso del wizard
- `src/components/wizard/steps/StepIdentidad.tsx` — Paso 1
- `src/components/wizard/steps/StepCategorias.tsx` — Paso 2
- `src/components/wizard/steps/StepDuraciones.tsx` — Paso 3
- `src/components/wizard/steps/StepRepertorio.tsx` — Paso 4 manual
- `src/components/wizard/steps/StepPrecios.tsx` — Paso 5
- `src/components/wizard/steps/StepDemos.tsx` — Paso 5 demos y muestras (nuevo)
- `src/components/wizard/steps/StepContactos.tsx` — Paso 7
- `src/components/wizard/steps/StepPreview.tsx` — Paso 8 preview/publicación
- `src/app/(public)/proveedores/page.tsx` — Listing público con filtros
- `src/components/search/SearchFilters.tsx` — Filtros colapsados detrás del botón "Filtros"
- `src/app/api/providers/route.ts` — Listing API con filtros y búsqueda `q`
- `src/app/uploads/[...path]/route.ts` — Sirve imágenes locales subidas desde `public/uploads/`
- `src/app/(public)/proveedores/[id]/page.tsx` — Detalle público con contacto bloqueado
- `src/app/(public)/como-funciona/page.tsx` — Explicación del modelo de acceso
- `src/app/(dashboard)/guardados/page.tsx` — Guardados del contratante
- `src/app/(dashboard)/contactos-desbloqueados/page.tsx` — Historial de contactos desbloqueados
- `src/app/(dashboard)/suscripcion/page.tsx` — Suscripción local
- `src/app/api/providers/start/route.ts` — Activación de perfil musical desde cuenta existente

---

## Lo que falta construir

### API routes pendientes

| Endpoint | Story | Prioridad |
|----------|-------|-----------|
| `PATCH /api/providers/[id]` validation hardening for prices/durations | US-MUS-008/011/012 | P1 |
| Real Stripe payment intent/checkout confirmation | US-MON-001 | P2 |
| Real Stripe subscription/webhooks/cancelation lifecycle | US-MON-003/004 | P2 |

### Pantallas UI pendientes

**Prioridad 1 — Fundación funcional:**
- Browser walkthrough del flujo completo: registro proveedor → wizard → publicar → dashboard → listing → detail.

**Prioridad 2 — Monetización:**
- Reemplazar stubs locales de desbloqueo/suscripción por Stripe real.

**Prioridad 3 — Confianza y eficiencia:**
- Mejorar estados visuales de guardado ya existente al cargar cards previamente guardadas.

---

## Siguiente paso recomendado

**Primero:** Correr en la máquina local para aplicar la migración de demos:
```bash
cd "/Users/miguelleo/Desktop/Musicians project"
npx prisma db push
npx prisma generate
npm run build
```

Luego, continuar con este orden:

1. Probar en navegador el flujo completo con un email nuevo para evitar el `409 Conflict` esperado de email duplicado.
2. Verificar manualmente en navegador que la búsqueda rápida desde `/` navega a `/proveedores?q=...` con Enter; el botón "Buscar" ya fue verificado en el navegador integrado.
3. Reemplazar los stubs locales por Stripe real cuando haya llaves de prueba.
4. Crear datos de ejemplo publicados o completar un perfil desde el wizard para poblar `/proveedores`.
5. Endurecer validación server-side de precios/duraciones en `PATCH /api/providers/[id]`.

---

## Comandos para continuar

```bash
cd "/Users/miguelleo/Desktop/Musicians project"
npm run dev           # levantar servidor
npm run db:studio     # ver base de datos visualmente
npm run db:reset      # reiniciar BD si es necesario
```

---

## Agent transfer note

1. Leer `claude.md` — instrucciones SDD
2. Leer `docs/behavioral_experience.md` — experiencia de producto
3. Leer `docs/requirements.md` — requisitos formalizados
4. Leer `docs/plan.md` — arquitectura y stack
5. Leer este archivo
6. Leer `CHANGELOG.md`
7. Verificar que `node_modules/` y `prisma/dev.db` existen antes de continuar
8. No implementar nada sin una task en `tasks.md`

## Latest decisions made

- La UI usa una paleta y composición inspiradas en Airbnb, con texto de interfaz en español.
- Se eliminó `next/font/google` para evitar fallos de build sin acceso a red; la app usa fuentes del sistema.
- Los contactos se administran en `/api/providers/[id]/contact-points`, dejando `/api/providers/[id]/contacts` como endpoint protegido para bookers que ya pagaron o tienen suscripción.
- El wizard permite publicar solo cuando están completos identidad, categorías, duraciones, al menos un precio y al menos un punto de contacto.
- Una cuenta puede tener capacidades de contratante y proveedor a la vez. Si un contratante loggeado visita `/registrarse/proveedor`, se le ofrece crear el perfil musical usando su nombre/email actuales, sin duplicar usuario.
- La búsqueda principal de la landing es un formulario editable. Envía `q` a `/proveedores`, busca coincidencias en campos públicos y puede combinarse con filtros avanzados sin exponer contactos.
- Los resultados de búsqueda muestran primero las cards. Los filtros avanzados están colapsados por defecto y se abren con el botón "Filtros".
- Las imágenes subidas localmente bajo `public/uploads/` se sirven también por `/uploads/[...path]` para que aparezcan en cards y detalle público durante runs locales de producción.

## Recently modified files

- `src/app/page.tsx`
- `src/components/search/HomeSearchBox.tsx`
- `src/app/(public)/proveedores/page.tsx`
- `src/app/api/providers/route.ts`
- `src/components/search/SearchFilters.tsx`
- `src/app/uploads/[...path]/route.ts`
- `docs/behavioral_experience.md`
- `docs/requirements.md`
- `docs/plan.md`
- `docs/tasks.md`
- `CHANGELOG.md`
- `HANDOFF.md`
- `src/app/layout.tsx`
- `src/app/(auth)/iniciar-sesion/page.tsx`
- `src/app/api/providers/[id]/genres/route.ts`
- `src/app/api/providers/[id]/event-types/route.ts`
- `src/app/api/providers/[id]/repertoire/route.ts`
- `src/app/api/providers/[id]/repertoire/[songId]/route.ts`
- `src/app/api/providers/[id]/contact-points/route.ts`
- `src/app/api/providers/[id]/contact-points/[contactPointId]/route.ts`
- `src/app/api/providers/[id]/publish/route.ts`
- `src/components/wizard/steps/StepPreview.tsx`
- `src/lib/contact-detection.ts`
- `docs/tasks.md`
- `CHANGELOG.md`
- `HANDOFF.md`
- `src/app/(public)/proveedores/page.tsx`
- `src/app/(public)/proveedores/[id]/page.tsx`
- `src/app/(public)/como-funciona/page.tsx`
- `src/app/(dashboard)/guardados/page.tsx`
- `src/app/(dashboard)/contactos-desbloqueados/page.tsx`
- `src/app/(dashboard)/suscripcion/page.tsx`
- `src/app/api/payments/unlock/route.ts`
- `src/app/api/subscriptions/route.ts`
- `src/app/api/saved/route.ts`
- `src/app/api/unlocks/route.ts`
- `src/app/api/providers/[id]/image/route.ts`
- `src/app/api/providers/[id]/repertoire/upload/route.ts`
- `src/components/search/ProviderCard.tsx`
- `src/components/search/SearchFilters.tsx`
- `src/components/provider/ContactAccessPanel.tsx`
- `src/components/provider/SaveProviderButton.tsx`
- `src/components/provider/SubscriptionActions.tsx`
- `src/components/wizard/steps/StepRepertorioUpload.tsx`
- `src/lib/provider-format.ts`
- `src/app/api/providers/start/route.ts`
- `src/app/(auth)/registrarse/proveedor/page.tsx`
- `src/lib/auth.ts`

## Open risks

- The UI has been build-verified; `/registrarse/proveedor` was opened in the in-app browser on `http://127.0.0.1:3005/registrarse/proveedor`.
- `409 Conflict` on registration means the email already exists; this is expected and should show the inline Spanish duplicate-email error.
- If the user is already logged in as a booker, they should not use the duplicate-email registration form; `/registrarse/proveedor` now shows a reuse-account activation path.
- The local payment/subscription flows are stubs and do not charge real money.
- `/proveedores` and quick-search results may be empty until at least one provider completes and publishes a profile.
- The quick-search button was browser-verified; Enter uses native form submission, but the in-app browser automation did not trigger submission from its synthetic Enter keypress. Manual browser validation is recommended.
- Current verified URL for the latest build: `http://127.0.0.1:3007/proveedores?q=banda`. It shows collapsed filters and the uploaded band image.
- ESLint has not been initialized; `npm run lint` opens Next.js interactive setup.
