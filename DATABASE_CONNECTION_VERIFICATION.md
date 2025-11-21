# 🔍 Verificación de Conexión a Base de Datos

## 📊 Configuración Actual de PostgreSQL

### Docker Compose (`docker-compose.yml`)

```yaml
postgres:
  image: postgres:15-alpine
  container_name: salchipapas-db
  environment:
    POSTGRES_USER: salchipapas_user
    POSTGRES_PASSWORD: salchipapas_pass
    POSTGRES_DB: salchipapas_user  # ⚠️ Base de datos
  ports:
    - "5432:5432"
```

**Configuración:**
- **Usuario:** `salchipapas_user`
- **Contraseña:** `salchipapas_pass`
- **Base de datos:** `salchipapas_user`
- **Host (desde contenedores):** `postgres` (nombre del servicio)
- **Puerto:** `5432`

---

## 🔌 Conexiones por Servicio

### 1. API FastAPI (`salchipapas-api`)

**Variable de Entorno:**
```yaml
DATABASE_URL: postgresql://salchipapas_user:salchipapas_pass@postgres:5432/salchipapas_user
```

**Archivo de Conexión:** `api/database.py`
```python
DATABASE_URL = os.getenv("DATABASE_URL", "").replace("postgresql://", "postgresql+asyncpg://")
engine = create_async_engine(DATABASE_URL, echo=False)
```

**Librería:** `asyncpg` (conexiones asíncronas directas)
- Usa SQL queries directas
- No usa ORM (SQLAlchemy solo para estructura, no para queries)
- Conexiones por función (abre/cierra en cada operación)

**Archivo de Servicios:** `api/services/database_service.py`
- Cada función abre su propia conexión
- Usa `asyncpg.connect()` directamente
- Cierra conexión en `finally`

**✅ Estado:** CORRECTO
- URL usa nombre del servicio `postgres`
- Credenciales coinciden
- Base de datos: `salchipapas_user`

---

### 2. Worker Node.js (`salchipapas-worker`)

**Variable de Entorno:**
```yaml
DATABASE_URL: postgresql://salchipapas_user:salchipapas_pass@postgres:5432/salchipapas_user
```

**Archivo de Conexión:** `worker/prisma/schema.prisma`
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Librería:** `Prisma Client`
- ORM con conexión pool automática
- Prisma Client se inicializa: `new PrismaClient()`
- Lee `DATABASE_URL` desde variables de entorno

**Uso en Código:** `worker/src/index.ts`
```typescript
const prisma = new PrismaClient();
// Prisma lee DATABASE_URL automáticamente
await prisma.order.update({ ... });
```

**⚠️ PROBLEMA DETECTADO:**
El schema tiene `binaryTargets: ["native", "linux-musl-openssl-3.0.x"]` pero ahora usamos `node:20-slim` (Debian, no Alpine).

**✅ Estado:** CORRECTO (pero necesita ajuste en binaryTargets)
- URL usa nombre del servicio `postgres`
- Credenciales coinciden
- Base de datos: `salchipapas_user`

---

## 🔄 Flujo de Datos

### Creación de Pedido:
```
1. Frontend → POST /api/orders/create (FastAPI)
2. FastAPI (asyncpg) → INSERT INTO orders (status: PENDING)
3. FastAPI → Publica mensaje a RabbitMQ
4. Worker (Prisma) → Consume mensaje
5. Worker (Prisma) → UPDATE orders SET status = 'PREPARING'
```

### Lectura de Productos:
```
1. Frontend → GET /api/products (FastAPI)
2. FastAPI (asyncpg) → SELECT * FROM products
3. Retorna JSON al frontend
```

---

## ✅ Verificación de Consistencia

| Aspecto | PostgreSQL Config | API FastAPI | Worker Prisma | Estado |
|---------|------------------|-------------|---------------|--------|
| **Host** | `postgres` | `postgres` | `postgres` | ✅ |
| **Puerto** | `5432` | `5432` | `5432` | ✅ |
| **Usuario** | `salchipapas_user` | `salchipapas_user` | `salchipapas_user` | ✅ |
| **Contraseña** | `salchipapas_pass` | `salchipapas_pass` | `salchipapas_pass` | ✅ |
| **Base de Datos** | `salchipapas_user` | `salchipapas_user` | `salchipapas_user` | ✅ |
| **URL Completa** | - | `postgresql://...@postgres:5432/salchipapas_user` | `postgresql://...@postgres:5432/salchipapas_user` | ✅ |

---

## ⚠️ Problemas Detectados y Correcciones Necesarias

### 1. Prisma binaryTargets Incorrecto

**Problema:** El schema de Prisma tiene `linux-musl-openssl-3.0.x` pero usamos `node:20-slim` (Debian).

**Solución:** Actualizar `worker/prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "debian-openssl-3.0.x"]  // Cambiar de musl a debian
}
```

---

## 🧪 Comandos de Verificación

### 1. Verificar que PostgreSQL está corriendo:
```powershell
docker-compose ps postgres
```

### 2. Verificar conexión desde API:
```powershell
docker-compose exec api python -c "import os; print(os.getenv('DATABASE_URL'))"
```

### 3. Verificar conexión desde Worker:
```powershell
docker-compose exec worker node -e "console.log(process.env.DATABASE_URL)"
```

### 4. Probar conexión directa a PostgreSQL:
```powershell
docker-compose exec postgres psql -U salchipapas_user -d salchipapas_user -c "SELECT current_database();"
```

### 5. Verificar tablas existentes:
```powershell
docker-compose exec postgres psql -U salchipapas_user -d salchipapas_user -c "\dt"
```

### 6. Verificar datos:
```powershell
# Productos
docker-compose exec postgres psql -U salchipapas_user -d salchipapas_user -c "SELECT COUNT(*) FROM products;"

# Usuarios
docker-compose exec postgres psql -U salchipapas_user -d salchipapas_user -c "SELECT COUNT(*) FROM users;"
```

---

## 📋 Resumen de Conexiones

### Formato de DATABASE_URL:
```
postgresql://[usuario]:[contraseña]@[host]:[puerto]/[base_de_datos]
```

### Ejemplo Actual:
```
postgresql://salchipapas_user:salchipapas_pass@postgres:5432/salchipapas_user
```

### Desglose:
- **Protocolo:** `postgresql://`
- **Usuario:** `salchipapas_user`
- **Contraseña:** `salchipapas_pass`
- **Host:** `postgres` (nombre del servicio Docker)
- **Puerto:** `5432`
- **Base de datos:** `salchipapas_user`

---

## ✅ Conclusión

**Estado General:** ✅ **CONFIGURACIÓN CORRECTA**

Todas las conexiones están configuradas correctamente:
- ✅ Variables de entorno coinciden
- ✅ Nombres de servicios Docker correctos
- ✅ Credenciales consistentes
- ✅ Base de datos única para todos los servicios

**Acción Requerida:**
- ⚠️ Actualizar `binaryTargets` en Prisma schema (ver corrección abajo)

