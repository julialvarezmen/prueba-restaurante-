# 🏗️ Resumen de Refactorización - Sistema Salchipapas

## ✅ Cambios Realizados

### 1. Infraestructura Docker

**Archivo modificado:** `docker-compose.yml`

- ✅ Agregado servicio **RabbitMQ** (puertos 5672, 15672)
- ✅ Creado servicio **api** (FastAPI Producer)
- ✅ Creado servicio **worker** (Node.js Consumer)
- ✅ Mantenido servicio **frontend** (React)
- ✅ Mantenido servicio **postgres** (Base de datos)

---

## 📁 Estructura de Archivos Creados/Modificados

### API FastAPI (Producer) - Nueva Carpeta `api/`

```
api/
├── Dockerfile
├── requirements.txt
├── main.py
├── database.py
├── models.py
├── .env.example
├── routers/
│   ├── __init__.py
│   ├── auth.py          # Login/Registro con JWT
│   ├── products.py      # GET /products
│   ├── orders.py        # POST /orders/create (Producer)
│   ├── payments.py      # POST /payment/process
│   └── admin.py         # GET /admin/orders, PATCH /admin/orders/:id/status
└── services/
    ├── __init__.py
    ├── rabbitmq.py      # Publicar mensajes a RabbitMQ
    ├── database_service.py  # Queries a PostgreSQL
    └── auth_service.py      # JWT y bcrypt
```

### Worker Node.js (Consumer) - Nueva Carpeta `worker/`

```
worker/
├── Dockerfile
├── package.json
├── tsconfig.json
├── prisma/
│   └── schema.prisma    # Copia del schema de Prisma
└── src/
    └── index.ts         # Consumer de RabbitMQ
```

### Frontend React - Modificaciones

```
frontend/src/
├── App.tsx              # ✅ Agregadas rutas /track/:orderId y /admin
├── services/
│   └── api.ts           # ✅ Actualizados endpoints (orders/create, payment/process, admin)
└── pages/
    ├── Cart.tsx         # ✅ Actualizado para usar nuevo endpoint
    ├── Orders.tsx       # ✅ Agregado link a rastreo
    ├── TrackOrder.tsx   # ✅ NUEVO - Portal de rastreo
    └── Admin.tsx        # ✅ NUEVO - Portal administrativo
```

---

## 🔄 Flujo de Arquitectura Implementado

```
1. Usuario hace pedido en Frontend
   ↓
2. Frontend → POST /api/orders/create (FastAPI)
   ↓
3. FastAPI crea pedido en BD (status: PENDING)
   ↓
4. FastAPI publica mensaje a RabbitMQ (cola: order_queue)
   ↓
5. Worker (Node.js) consume mensaje de RabbitMQ
   ↓
6. Worker procesa pedido (simula 5 segundos)
   ↓
7. Worker actualiza BD (status: PREPARING)
   ↓
8. Admin puede avanzar estados manualmente
   ↓
9. Usuario puede rastrear en tiempo real (/track/:orderId)
```

---

## 🚀 Comandos para Iniciar el Sistema

### Opción 1: Docker Compose (Recomendado)

```bash
# 1. Asegúrate de estar en el directorio raíz
cd C:\Users\a_jtibaduiza\Cursor

# 2. Detener servicios anteriores (si existen)
docker-compose down -v

# 3. Construir e iniciar todos los servicios
docker-compose up --build

# 4. En otra terminal, ejecutar migraciones y seed
docker-compose exec worker npm run prisma:generate
docker-compose exec worker npx prisma db push
docker-compose exec worker npm run prisma:seed
```

### Opción 2: Servicios Individuales

```bash
# Postgres
docker-compose up -d postgres

# RabbitMQ
docker-compose up -d rabbitmq

# API (FastAPI)
docker-compose up -d api

# Worker (Node.js)
docker-compose up -d worker

# Frontend
docker-compose up -d frontend
```

---

## 📋 Endpoints de la API FastAPI

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login (retorna JWT)
- `GET /api/auth/profile` - Perfil del usuario (requiere token)

### Productos
- `GET /api/products` - Lista de productos
- `GET /api/products/{id}` - Producto por ID

### Pedidos
- `POST /api/orders/create` - Crear pedido (Producer → RabbitMQ)
- `GET /api/orders/{orderId}/status` - Estado de pedido (para rastreo)

### Pagos
- `POST /api/payment/process` - Procesar pago (simulado)

### Admin
- `GET /api/admin/orders` - Todos los pedidos (solo admin)
- `PATCH /api/admin/orders/{orderId}/status` - Actualizar estado (solo admin)

---

## 🎯 Portales del Frontend

### 1. Portal Usuario (`/` o `/menu`)
- Ver productos
- Agregar al carrito
- Hacer pedidos
- Ver historial de pedidos

### 2. Portal de Rastreo (`/track/:orderId`)
- Estado actual del pedido
- Actualización en tiempo real (polling cada 3 segundos)
- Timeline de estados

### 3. Portal Administrador (`/admin`)
- Lista de todos los pedidos
- Avanzar estados manualmente
- Ver información de clientes

---

## 🔧 Variables de Entorno

### API (FastAPI)
```env
DATABASE_URL=postgresql://salchipapas_user:salchipapas_pass@postgres:5432/salchipapas_db
RABBITMQ_URL=amqp://admin:admin123@rabbitmq:5672/
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

### Worker (Node.js)
```env
DATABASE_URL=postgresql://salchipapas_user:salchipapas_pass@postgres:5432/salchipapas_db
RABBITMQ_URL=amqp://admin:admin123@rabbitmq:5672/
```

### Frontend
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📊 Servicios y Puertos

| Servicio | Puerto | URL |
|----------|--------|-----|
| Frontend | 3000 | http://localhost:3000 |
| API (FastAPI) | 5000 | http://localhost:5000 |
| RabbitMQ AMQP | 5672 | amqp://localhost:5672 |
| RabbitMQ Management | 15672 | http://localhost:15672 |
| PostgreSQL | 5432 | postgresql://localhost:5432 |

**Credenciales RabbitMQ:**
- Usuario: `admin`
- Contraseña: `admin123`

---

## ✅ Checklist de Funcionalidades

### Backend (FastAPI Producer)
- [x] Autenticación con JWT
- [x] Endpoint de productos
- [x] Crear pedido y publicar a RabbitMQ
- [x] Procesamiento de pagos simulado
- [x] Rastreo de pedidos
- [x] Panel administrativo

### Worker (Node.js Consumer)
- [x] Consumir mensajes de RabbitMQ
- [x] Procesar pedidos asíncronamente
- [x] Actualizar estado en BD

### Frontend
- [x] Portal de usuario
- [x] Portal de rastreo
- [x] Portal administrativo
- [x] Integración con nueva API

---

## 🐛 Notas Importantes

1. **Prisma Schema:** El schema está en `worker/prisma/schema.prisma`. El worker usa Prisma para actualizar estados.

2. **Base de Datos:** La API FastAPI usa `asyncpg` para queries directas, mientras que el Worker usa Prisma.

3. **RabbitMQ:** La cola `order_queue` se crea automáticamente cuando se publica el primer mensaje.

4. **Estados de Pedido:** 
   - `PENDING` → Creado, esperando procesamiento
   - `PREPARING` → Worker procesando (5 segundos)
   - `READY` → Listo para entrega
   - `ON_DELIVERY` → En camino
   - `DELIVERED` → Entregado

5. **Autenticación:** Todos los endpoints protegidos requieren header `Authorization: Bearer <token>`

---

## 🎉 ¡Sistema Completo!

El sistema ahora cumple con todos los requisitos:
- ✅ FastAPI como Producer
- ✅ RabbitMQ como Message Broker
- ✅ Node.js Worker como Consumer
- ✅ React Frontend con 3 portales
- ✅ Docker Compose para orquestación

**Comando final para iniciar todo:**
```bash
docker-compose up --build
```

¡Listo para producción! 🍟

