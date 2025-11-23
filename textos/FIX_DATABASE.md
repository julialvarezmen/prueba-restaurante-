# 🔧 Solución de Problemas de Base de Datos - Docker + Prisma

## ⚠️ Problema Identificado

El error `FATAL: database "salchipapas_user" does not exist` ocurre porque:
- La base de datos se llama **`salchipapas_db`** (no `salchipapas_user`)
- El usuario es **`salchipapas_user`**
- Las tablas no han sido creadas aún

## ✅ Verificación de Configuración

**docker-compose.yml** (CORRECTO):
```yaml
POSTGRES_USER: salchipapas_user
POSTGRES_PASSWORD: salchipapas_pass
POSTGRES_DB: salchipapas_db  # ← Esta es la base de datos
```

**DATABASE_URL** debe ser:
```
postgresql://salchipapas_user:salchipapas_pass@postgres:5432/salchipapas_db
```

---

## 🚀 Comandos de Solución (Ejecutar en Orden)

### Paso 1: Detener y Limpiar Todo

```powershell
# Detener todos los contenedores
docker-compose down

# Eliminar volúmenes (esto borra la base de datos completamente)
docker-compose down -v

# Verificar que no queden contenedores
docker ps -a | findstr salchipapas

# Si aparecen contenedores, eliminarlos manualmente:
docker rm -f salchipapas-db salchipapas-backend salchipapas-frontend

# Eliminar el volumen de postgres específicamente
docker volume rm cursor_postgres_data
# O si el nombre es diferente, listar todos los volúmenes:
docker volume ls
# Y eliminar el que corresponda a postgres_data
```

### Paso 2: Verificar Archivo .env del Backend

```powershell
# Navegar al directorio backend
cd backend

# Verificar que existe .env (si no existe, copiar de env.example)
if (!(Test-Path .env)) {
    Copy-Item env.example .env
    Write-Host "✅ Archivo .env creado desde env.example"
}

# Verificar contenido del .env (debe tener DATABASE_URL correcto)
Get-Content .env | Select-String "DATABASE_URL"

# El DATABASE_URL debe ser:
# DATABASE_URL="postgresql://salchipapas_user:salchipapas_pass@localhost:5432/salchipapas_db?schema=public"
```

**Si el .env tiene `salchipapas_user` como nombre de BD, corrígelo:**
```powershell
# Editar .env manualmente o usar este comando (PowerShell):
(Get-Content .env) -replace 'salchipapas_user\?schema', 'salchipapas_db?schema' | Set-Content .env
```

### Paso 3: Levantar Servicios (Base Limpia)

```powershell
# Volver al directorio raíz
cd ..

# Levantar solo postgres primero (para que se inicialice correctamente)
docker-compose up -d postgres

# Esperar 15-20 segundos para que postgres esté completamente listo
Start-Sleep -Seconds 20

# Verificar que postgres esté corriendo y saludable
docker-compose ps postgres
docker-compose logs postgres | Select-Object -Last 10
```

### Paso 4: Verificar Conexión a la Base de Datos

```powershell
# Probar conexión desde el contenedor de postgres
docker-compose exec postgres psql -U salchipapas_user -d salchipapas_db -c "\l"

# Si la base de datos existe, deberías ver "salchipapas_db" en la lista
# Si no existe, créala manualmente:
docker-compose exec postgres psql -U salchipapas_user -d postgres -c "CREATE DATABASE salchipapas_db;"
```

### Paso 5: Levantar Backend y Crear Tablas con Prisma

```powershell
# Levantar el backend
docker-compose up -d backend

# Esperar 10 segundos para que el backend se inicialice
Start-Sleep -Seconds 10

# Verificar que el contenedor esté corriendo
docker-compose ps backend

# EJECUTAR PRISMA DB PUSH (crea las tablas)
docker-compose exec backend npx prisma db push

# O si prefieres usar migrate:
docker-compose exec backend npx prisma migrate dev --name init
```

### Paso 6: Verificar que las Tablas se Crearon

```powershell
# Listar tablas desde postgres
docker-compose exec postgres psql -U salchipapas_user -d salchipapas_db -c "\dt"

# Deberías ver: users, products, orders, order_items, addresses
```

### Paso 7: Ejecutar Seed (Poblar Datos)

```powershell
# Ejecutar el script de seed
docker-compose exec backend npm run prisma:seed

# O directamente:
docker-compose exec backend npx prisma db seed
```

### Paso 8: Levantar Frontend y Verificar Todo

```powershell
# Levantar frontend
docker-compose up -d frontend

# Ver logs de todos los servicios
docker-compose logs -f
```

---

## 📋 Script Completo (Copia y Pega Todo)

```powershell
# ============================================
# SCRIPT COMPLETO DE INICIALIZACIÓN
# ============================================

Write-Host "🛑 Paso 1: Deteniendo y limpiando..." -ForegroundColor Yellow
docker-compose down -v
docker volume rm cursor_postgres_data -ErrorAction SilentlyContinue

Write-Host "✅ Paso 2: Verificando .env..." -ForegroundColor Yellow
cd backend
if (!(Test-Path .env)) {
    Copy-Item env.example .env
    Write-Host "✅ .env creado" -ForegroundColor Green
}
cd ..

Write-Host "🚀 Paso 3: Levantando postgres..." -ForegroundColor Yellow
docker-compose up -d postgres
Start-Sleep -Seconds 20

Write-Host "🔍 Paso 4: Verificando base de datos..." -ForegroundColor Yellow
docker-compose exec postgres psql -U salchipapas_user -d postgres -c "SELECT 1 FROM pg_database WHERE datname='salchipapas_db';" | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "📦 Creando base de datos..." -ForegroundColor Yellow
    docker-compose exec postgres psql -U salchipapas_user -d postgres -c "CREATE DATABASE salchipapas_db;"
}

Write-Host "🚀 Paso 5: Levantando backend..." -ForegroundColor Yellow
docker-compose up -d backend
Start-Sleep -Seconds 10

Write-Host "📊 Paso 6: Creando tablas con Prisma..." -ForegroundColor Yellow
docker-compose exec backend npx prisma db push --accept-data-loss

Write-Host "🌱 Paso 7: Ejecutando seed..." -ForegroundColor Yellow
docker-compose exec backend npm run prisma:seed

Write-Host "🎨 Paso 8: Levantando frontend..." -ForegroundColor Yellow
docker-compose up -d frontend

Write-Host "✅ ¡Completado! Verificando servicios..." -ForegroundColor Green
docker-compose ps

Write-Host "`n📝 Para ver logs: docker-compose logs -f" -ForegroundColor Cyan
```

---

## 🔍 Comandos de Diagnóstico

### Verificar Estado de Contenedores
```powershell
docker-compose ps
```

### Ver Logs de Postgres
```powershell
docker-compose logs postgres | Select-Object -Last 30
```

### Ver Logs de Backend
```powershell
docker-compose logs backend | Select-Object -Last 30
```

### Conectarse a Postgres Manualmente
```powershell
docker-compose exec postgres psql -U salchipapas_user -d salchipapas_db
```

### Listar Bases de Datos
```powershell
docker-compose exec postgres psql -U salchipapas_user -d postgres -c "\l"
```

### Listar Tablas
```powershell
docker-compose exec postgres psql -U salchipapas_user -d salchipapas_db -c "\dt"
```

### Verificar Variables de Entorno del Backend
```powershell
docker-compose exec backend env | findstr DATABASE
```

---

## ⚠️ Solución de Problemas Específicos

### Error: "database salchipapas_user does not exist"
**Causa:** El DATABASE_URL apunta a la base de datos incorrecta.

**Solución:**
```powershell
# Verificar DATABASE_URL en el contenedor
docker-compose exec backend env | findstr DATABASE_URL

# Debe mostrar: DATABASE_URL=postgresql://salchipapas_user:salchipapas_pass@postgres:5432/salchipapas_db
# Si muestra salchipapas_user al final, está mal configurado
```

### Error: P2021 "table does not exist"
**Causa:** Las tablas no se han creado.

**Solución:**
```powershell
# Forzar creación de tablas
docker-compose exec backend npx prisma db push --accept-data-loss --force-reset
```

### Error: "relation already exists"
**Causa:** Hay tablas parciales creadas.

**Solución:**
```powershell
# Resetear completamente la base de datos
docker-compose exec backend npx prisma migrate reset --force
```

---

## ✅ Verificación Final

Después de ejecutar todos los pasos, verifica:

```powershell
# 1. Contenedores corriendo
docker-compose ps

# 2. Base de datos existe
docker-compose exec postgres psql -U salchipapas_user -d salchipapas_db -c "SELECT current_database();"

# 3. Tablas creadas (debe mostrar 5 tablas)
docker-compose exec postgres psql -U salchipapas_user -d salchipapas_db -c "\dt"

# 4. Productos en la BD (debe mostrar 5 productos)
docker-compose exec postgres psql -U salchipapas_user -d salchipapas_db -c "SELECT COUNT(*) FROM products;"

# 5. Usuario admin creado
docker-compose exec postgres psql -U salchipapas_user -d salchipapas_db -c "SELECT email, name, role FROM users;"
```

---

## 🎯 Resumen de Comandos Clave

```powershell
# Limpiar todo
docker-compose down -v

# Levantar postgres
docker-compose up -d postgres

# Crear tablas
docker-compose exec backend npx prisma db push

# Poblar datos
docker-compose exec backend npm run prisma:seed
```

¡Listo! Con estos comandos deberías tener la base de datos funcionando correctamente. 🍟

