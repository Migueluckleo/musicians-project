# Músicos — Marketplace de Proveedores Musicales

> Plataforma que conecta músicos, bandas y proveedores de servicios musicales con contratantes que buscan música en vivo para sus eventos.

---

## ¿Qué es este proyecto?

Una plataforma de descubrimiento y contratación de músicos donde:

- Los **proveedores musicales** crean un perfil público, indexable y categorizado, con géneros, tipos de evento, repertorio, precios y demos de audio/video.
- Los **contratantes** buscan, filtran y comparan opciones sin ver los datos de contacto hasta que pagan o se suscriben.

El modelo de negocio protege la información de contacto: $1 USD por proveedor o $9.99 USD/mes para acceso ilimitado.

---

## Stack técnico

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Base de datos:** Prisma ORM + SQLite (local) / PostgreSQL en producción
- **Auth:** NextAuth.js v4
- **Estilos:** Tailwind CSS
- **Pagos:** Stripe (en integración)

---

## Instalación local

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/musicians-marketplace.git
cd musicians-marketplace

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus valores

# 4. Crear base de datos y generar cliente Prisma
npx prisma db push
npx prisma generate

# 5. Ejecutar seed (géneros y tipos de evento)
npx prisma db seed

# 6. Levantar en desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

---

## Variables de entorno

Consulta `.env.example` para la lista completa de variables necesarias. Nunca subas `.env.local` al repositorio.

---

## Estructura del proyecto

```
src/
├── app/                  # App Router de Next.js
│   ├── (auth)/           # Registro e inicio de sesión
│   ├── (dashboard)/      # Dashboard y wizard de perfil
│   ├── (public)/         # Páginas públicas (listing, detalle)
│   └── api/              # API Routes
├── components/           # Componentes React
│   ├── provider/         # Panel de contacto, guardados
│   ├── search/           # Cards, filtros, buscador
│   ├── ui/               # Componentes base (Button, Input, Navbar)
│   └── wizard/           # Pasos del wizard de perfil
├── lib/                  # Utilidades (auth, db, upload, detección de contactos)
└── types/                # Tipos compartidos
docs/
├── behavioral_experience.md   # Experiencia de producto y User Stories
├── requirements.md            # Requisitos funcionales y criterios de aceptación
├── plan.md                    # Arquitectura y modelo de datos
└── tasks.md                   # Tareas de implementación
```

---

## Documentación

La documentación de producto vive en `/docs`:

| Archivo | Contenido |
|--------|-----------|
| `behavioral_experience.md` | Job Stories, User Stories, criterios UX |
| `requirements.md` | Requisitos funcionales y reglas de negocio |
| `plan.md` | Arquitectura, modelo de datos, flujos |
| `tasks.md` | Tareas secuenciales de implementación |
| `CHANGELOG.md` | Historial de cambios |
| `HANDOFF.md` | Estado actual y notas de traspaso |

---

## Licencia

**Copyright (c) 2026 Miguel Leo. Todos los derechos reservados.**

Este software es propietario y confidencial. No se otorga ningún permiso para copiar, distribuir, modificar o usar este software sin el consentimiento expreso por escrito del autor. Consulta el archivo [LICENSE](./LICENSE) para los términos completos.

---

*Desarrollado por Miguel Leo — migueluxleo@gmail.com*
