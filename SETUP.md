# Setup local — Marketplace de Músicos

## Paso previo único (solo la primera vez)

Elimina el archivo `next.config.ts` de la carpeta del proyecto. Next.js 14 no soporta ese formato — ya existe el reemplazo `next.config.mjs`.

---

## Guía para subir el proyecto a GitHub

### 1. Limpieza previa

Antes de hacer el commit, elimina la carpeta duplicada y el repositorio git incompleto que se creó automáticamente:

```bash
cd "/Users/miguelleo/Desktop/Musicians project"

# Eliminar carpeta prisma anidada (duplicado innecesario)
rm -rf prisma/prisma/

# Eliminar el .git incompleto si existe
rm -rf .git
```

---

### 2. Aplicar cambios de base de datos (si no lo has hecho aún)

```bash
npx prisma db push
npx prisma generate
```

---

### 3. Inicializar el repositorio Git con tu firma

```bash
git init
git branch -m main
git config user.name "Miguel Leo"
git config user.email "migueluxleo@gmail.com"
```

---

### 4. Agregar todos los archivos y hacer el primer commit

```bash
git add .
git commit -m "feat: initial commit — Musicians Marketplace by Miguel Leo"
```

Verifica que el commit quedó con tu nombre:

```bash
git log --oneline
# Debes ver algo como:
# abc1234 feat: initial commit — Musicians Marketplace by Miguel Leo
```

---

### 5. Crear el repositorio en GitHub

1. Ve a [https://github.com/new](https://github.com/new)
2. **Nombre:** `musicians-marketplace` (o el que prefieras)
3. **Descripción:** `Marketplace de músicos y bandas para eventos`
4. **Visibilidad:** Public ✅
5. **NO** marques "Add a README", "Add .gitignore" ni "Choose a license" (ya los tienes)
6. Haz clic en **Create repository**

---

### 6. Conectar y subir

GitHub te mostrará instrucciones. Usa estas (reemplaza `TU_USUARIO`):

```bash
git remote add origin https://github.com/TU_USUARIO/musicians-marketplace.git
git push -u origin main
```

Si tienes autenticación de dos factores activa en GitHub (recomendado), necesitas un **Personal Access Token** en lugar de contraseña. Para generarlo:

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Genera uno nuevo con permiso `repo`
3. Úsalo cuando git te pida la contraseña

---

### 7. Verificación final en GitHub

Abre `https://github.com/TU_USUARIO/musicians-marketplace` y confirma:

- ✅ La pestaña **Code** muestra todos los archivos
- ✅ El archivo `LICENSE` aparece (GitHub lo reconoce como "All Rights Reserved")
- ✅ El `README.md` se renderiza con tu nombre y copyright
- ✅ **No** aparece ningún `.env` ni `.env.local`
- ✅ **No** aparece ningún archivo `*.db`
- ✅ La carpeta `public/uploads/` solo contiene `.gitkeep`

---

## Archivos de seguridad — qué está excluido

| Archivo | Estado |
|---------|--------|
| `.env` | ✅ Excluido por `.gitignore` |
| `.env.local` | ✅ Excluido por `.gitignore` |
| `prisma/dev.db` | ✅ Excluido por `.gitignore` |
| `public/uploads/*.jpg` | ✅ Excluido por `.gitignore` |
| `node_modules/` | ✅ Excluido por `.gitignore` |
| `.env.example` | ✅ Incluido — es solo una plantilla sin valores reales |

---

## Tu firma de autor está en

- `LICENSE` — Licencia propietaria "All Rights Reserved", Copyright © 2026 Miguel Leo
- `README.md` — Aviso de copyright visible al final
- Cada commit lleva `user.name = "Miguel Leo"` y `user.email = "migueluxleo@gmail.com"`

```bash
rm "/Users/miguelleo/Desktop/Musicians project/next.config.ts"
```

O bórralo manualmente desde el Finder.

---

## Instalación completa

```bash
cd "/Users/miguelleo/Desktop/Musicians project"
npm install
npm run db:push
npm run db:seed
npm run dev
```

La app estará en: **http://localhost:3000**

---

## Si ya instalaste pero tuviste errores

Si ya corriste `npm install`, solo ejecuta:

```bash
cd "/Users/miguelleo/Desktop/Musicians project"
npm run db:push
npm run db:seed
npm run dev
```

---

## Comandos útiles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run db:push` | Aplica cambios del schema a la BD |
| `npm run db:studio` | Abre Prisma Studio (interfaz visual de la BD) |
| `npm run db:seed` | Pobla géneros y tipos de evento |
| `npm run db:reset` | Reinicia la BD completa y vuelve a hacer seed |

---

## Archivos importantes

| Archivo | Descripción |
|---------|-------------|
| `.env` | DATABASE_URL para Prisma CLI |
| `.env.local` | Variables de Next.js (NEXTAUTH_URL, etc.) |
| `prisma/schema.prisma` | Modelo de datos completo |
| `prisma/dev.db` | Base de datos SQLite (se crea al hacer db:push) |
| `public/uploads/` | Imágenes subidas localmente |

---

## Migrar a producción (cuando estés listo)

1. Crear proyecto en [Supabase](https://supabase.com) (gratis)
2. Cambiar en `.env`:
   ```
   DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"
   ```
3. Cambiar en `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. Ejecutar `npm run db:push`
5. Deploy en [Vercel](https://vercel.com) conectando tu repo Git
