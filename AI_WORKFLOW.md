# Sistema de Pedidos de Domicilio - Salchipapas 🍟

## Estrategia de Interacción con IA

### Metodología: AI-First Development

Utilizamos un enfoque **"AI-First"** donde la IA actúa como **Junior Developer** y el equipo humano como **Arquitectos y Revisores**. Este enfoque ha demostrado ser altamente efectivo para acelerar el desarrollo manteniendo calidad.

---

## 📋 Plantilla de Prompt Obligatoria

### Estructura Base (Siempre Incluir)

```
@[contexto-del-proyecto] Actúa como [rol] y [especialidad]

[Descripción del problema/requerimiento]

[Contexto específico del código/archivos afectados]

[Restricciones y requisitos técnicos]

[Resultado esperado]
```

### Ejemplos de Prompts Exitosos

#### Ejemplo 1: Desarrollo FullStack
```
@prueba-restaurante- Funciona bien, Actua como desarrollador FullStack y Dev ops, 
Aun no se contabiliza los pedidos que se generan y los ingresos, quiero que soluciones 
esto para tener esta funcion activa, recuerda utilizar siempre el worker de RabbitMQ
```

**Resultado:** ✅ Implementación exitosa de contabilización de pedidos e ingresos con integración RabbitMQ

#### Ejemplo 2: Separación de Aplicaciones
```
@prueba-restaurante- Actua como fullStack y Devops, si queremos cumplir con la peticion 
anterior lo mejor seria establecer la web del panel de administrador en un puerto diferente 
al de la web del cliente, de esta forma podemos lograr que sean independientes
```

**Resultado:** ✅ Separación completa de frontends en puertos 3000 (cliente) y 3001 (admin)

#### Ejemplo 3: Corrección de Sesiones
```
@prueba-restaurante- No funciona del todo bien, Actua como fullStack y Devops, 
si un usuario logeado recarga la pagina lo dirige automaticamente al panel de administrador 
y esto es una mala practica, recuerda que ambas webs son independientes
```

**Resultado:** ✅ Implementación de sesiones completamente independientes con localStorage separado

---

## 🛠️ Herramientas de IA Utilizadas

### Herramientas Principales

1. **Cursor AI** (Editor Principal)
   - **Uso:** Generación de código, refactorización, debugging
   - **Casos de uso:**
     - Generación de componentes React
     - Creación de endpoints FastAPI
     - Configuración de Docker
     - Corrección de errores de sintaxis y lógica

2. **GitHub Copilot** (Asistente de Código)
   - **Uso:** Autocompletado inteligente, sugerencias de código
   - **Casos de uso:**
     - Completado de funciones
     - Generación de tests
     - Documentación inline

### Casos de Uso Protocolarios

#### ✅ Refactorización
- **Prompt tipo:** "Refactoriza [componente/archivo] para mejorar [aspecto específico]"
- **Ejemplo:** "Refactoriza ClientPage.jsx para separar la lógica de autenticación en un hook personalizado"

#### ✅ Generación de Tests
- **Prompt tipo:** "Genera tests unitarios para [componente/función] usando [framework de testing]"
- **Ejemplo:** "Genera tests para el endpoint de creación de pedidos usando pytest"

#### ✅ Debugging
- **Prompt tipo:** "Analiza este error [error específico] en [archivo] y proporciona solución"
- **Ejemplo:** "El cálculo de estadísticas no funciona correctamente, revisa calculateStats en AdminPage.jsx"

#### ✅ Generación de Código
- **Prompt tipo:** "Crea [componente/endpoint/función] que [descripción funcional] usando [tecnologías específicas]"
- **Ejemplo:** "Crea un componente OrderManagement que muestre pedidos con filtros por estado usando React y Tailwind"

#### ✅ Configuración DevOps
- **Prompt tipo:** "Configura [servicio] en docker-compose.yml con [requisitos específicos]"
- **Ejemplo:** "Agrega un servicio admin-frontend en puerto 3001 con las mismas dependencias que frontend"

---

## 📚 Documentos Clave y Contextualización

### Documentos de Entrada Obligatorios

Antes de interactuar con la IA, **SIEMPRE** proporcionar estos documentos como contexto:

1. **AI_WORKFLOW.md** (Este documento)
   - Define metodología y stack tecnológico
   - **Uso:** Contexto inicial obligatorio para cualquier prompt

2. **README.md**
   - Descripción general del proyecto
   - Instrucciones de instalación
   - **Uso:** Contexto de arquitectura y setup

3. **docker-compose.yml**
   - Configuración de servicios
   - **Uso:** Contexto de infraestructura y dependencias

4. **Archivos de Configuración**
   - `package.json` (frontend/admin-frontend/backend/worker)
   - `requirements.txt` (api)
   - `prisma/schema.prisma`
   - **Uso:** Contexto de dependencias y estructura de datos

5. **Documentos de Cambios Recientes**
   - `CAMBIOS_FINALES_IMPLEMENTADOS.md`
   - `RESUMEN_CAMBIOS.md`
   - `SOLUCION_ERRORES_ORDENES_CLIENTES.md`
   - **Uso:** Contexto de decisiones técnicas recientes

### Orden de Prioridad para Contexto

1. **Alta Prioridad:** Archivos directamente relacionados con la tarea
2. **Media Prioridad:** Archivos de configuración y estructura
3. **Baja Prioridad:** Documentación histórica y resúmenes

---

## 🏗️ Stack Tecnológico Base (Contexto Obligatorio para IA)

### Backend/API

**Producer API (FastAPI - Python)**
- FastAPI 0.104.1
- Uvicorn (ASGI server)
- SQLAlchemy 2.0.23 (ORM)
- asyncpg 0.29.0 (PostgreSQL async driver)
- psycopg2-binary 2.9.9 (PostgreSQL sync driver)
- python-jose[cryptography] 3.3.0 (JWT)
- passlib[bcrypt] 1.7.4 (Password hashing)
- aio-pika 9.2.0 (RabbitMQ client)
- Pydantic 2.5.0 (Data validation)

**Consumer Worker (Node.js - TypeScript)**
- Node.js 20+
- TypeScript
- Prisma ORM
- amqplib (RabbitMQ client)
- Express (opcional, para health checks)

**Backend Legacy (Node.js - TypeScript)**
- Node.js + Express
- TypeScript
- Prisma ORM
- JWT Authentication

### Frontend

**Cliente (React - JavaScript)**
- React 18.2.0
- Vite 4.4.5 (Build tool)
- Axios 1.6.0 (HTTP client)
- Tailwind CSS 3.3.3
- Lucide React 0.263.1 (Iconos)
- **Puerto:** 3000

**Administración (React - JavaScript)**
- React 18.2.0
- Vite 4.4.5
- Axios 1.6.0
- Tailwind CSS 3.3.3
- Lucide React 0.263.1
- **Puerto:** 3001

### Base de Datos

- **PostgreSQL 15-alpine**
- **Prisma ORM** (para Node.js)
- **SQLAlchemy** (para Python)
- **asyncpg** (driver async para Python)

### Message Broker

- **RabbitMQ 3-management-alpine**
- **aio-pika** (Python client)
- **amqplib** (Node.js client)
- Cola: `order_queue`

### DevOps

- **Docker** + **Docker Compose**
- **Healthchecks** configurados para todos los servicios
- **Volumes** para persistencia de datos
- **Networks** para comunicación entre servicios

### Arquitectura

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────┐
│  Frontend       │────▶│  API (FastAPI│────▶│  PostgreSQL │
│  (Puerto 3000)  │     │  Puerto 5000)│     │  (Puerto    │
└─────────────────┘     └──────────────┘     │   5432)     │
                                             └─────────────┘
┌─────────────────┐           │
│ Admin Frontend  │           │
│ (Puerto 3001)   │           ▼
└─────────────────┘     ┌──────────────┐
                         │  RabbitMQ    │
                         │  (Puerto     │
                         │   5672)      │
                         └──────────────┘
                                │
                                ▼
                         ┌──────────────┐
                         │  Worker      │
                         │  (Node.js +  │
                         │   Prisma)    │
                         └──────────────┘
```

---

## 🔄 Dinámicas de Interacción

### Regla de Verificación Humana Obligatoria

**⚠️ CRÍTICO:** Todo código generado por IA debe pasar por revisión humana antes de ser mergeado a ramas principales.

#### Checklist de Verificación

- [ ] **Lógica de Negocio:** Verificar que la lógica implementada es correcta
- [ ] **Seguridad:** Revisar manejo de tokens, validaciones, SQL injection
- [ ] **Performance:** Verificar queries, optimizaciones necesarias
- [ ] **Estándares de Código:** Formato, naming conventions, estructura
- [ ] **Testing:** Verificar que funcionalidades críticas tienen tests
- [ ] **Documentación:** Actualizar documentación si es necesario

### Flujo de Trabajo Estándar

1. **Prompt a IA** → Generación de código
2. **Revisión Humana** → Validación y ajustes
3. **Testing Local** → Verificación funcional
4. **Commit** → Con mensaje descriptivo
5. **Documentación** → Actualizar cambios relevantes

### Política de Propiedad Intelectual y Confidencialidad

#### ⚠️ REGLAS CRÍTICAS

1. **NO usar datos sensibles en IAs públicas:**
   - ❌ Credenciales de base de datos
   - ❌ Tokens JWT secretos
   - ❌ API keys
   - ❌ Información de clientes reales
   - ❌ Datos de producción

2. **Usar datos de ejemplo:**
   - ✅ Datos sintéticos para testing
   - ✅ Variables de entorno para configuración
   - ✅ Archivos `.env.example` como plantillas

3. **Revisar código generado:**
   - Verificar que no se hardcodean credenciales
   - Asegurar uso de variables de entorno
   - Validar que no se exponen datos sensibles

4. **Gestión de archivos:**
   - `.gitignore` debe incluir `.env`, `node_modules`, `__pycache__`
   - No commitear archivos con información sensible

---

## 📁 Estructura del Proyecto (Contexto para IA)

```
prueba-restaurante/
├── api/                          # Producer API (FastAPI)
│   ├── routers/                  # Endpoints de la API
│   │   ├── auth.py
│   │   ├── products.py
│   │   ├── orders.py
│   │   ├── admin.py
│   │   └── addresses.py
│   ├── services/                 # Lógica de negocio
│   │   ├── database_service.py
│   │   ├── auth_service.py
│   │   └── rabbitmq.py
│   ├── models.py                 # Modelos SQLAlchemy
│   ├── database.py               # Configuración DB
│   ├── main.py                   # Punto de entrada FastAPI
│   └── requirements.txt
│
├── backend/                       # Backend Legacy (Node.js)
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── middleware/
│   └── prisma/
│       └── schema.prisma
│
├── worker/                        # Consumer Worker (Node.js)
│   ├── src/
│   │   └── index.ts              # Procesador de mensajes RabbitMQ
│   └── prisma/
│       └── schema.prisma
│
├── frontend/                      # Frontend Cliente (React)
│   ├── src/
│   │   ├── components/
│   │   │   ├── client/           # Componentes de cliente
│   │   │   └── common/           # Componentes compartidos
│   │   ├── pages/
│   │   │   └── ClientPage.jsx
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── App.jsx
│   └── package.json
│
├── admin-frontend/                # Frontend Admin (React)
│   ├── src/
│   │   ├── components/
│   │   │   └── admin/           # Componentes de admin
│   │   ├── pages/
│   │   │   ├── AdminPage.jsx
│   │   │   └── AdminLogin.jsx
│   │   └── App.jsx
│   └── package.json
│
├── docker-compose.yml             # Orquestación de servicios
├── README.md                      # Documentación principal
└── AI_WORKFLOW.md                 # Este documento
```

---

## ✅ Estado del Proyecto

### Funcionalidades Implementadas

1. ✅ **Autenticación de usuarios**
   - Registro y login de clientes
   - Login de administradores
   - JWT con sesiones independientes (clientToken/adminToken)
   - Roles: CUSTOMER, ADMIN

2. ✅ **Gestión de productos**
   - CRUD completo de productos
   - Categorías: SALCHIPAPAS, BEBIDAS, ADICIONALES, COMBOS
   - Disponibilidad de productos

3. ✅ **Sistema de carrito**
   - Agregar/remover productos
   - Actualizar cantidades
   - Cálculo de totales

4. ✅ **Gestión de direcciones**
   - Múltiples direcciones por usuario
   - Dirección predeterminada
   - Validación de direcciones

5. ✅ **Procesamiento de pedidos**
   - Creación de pedidos
   - Integración con RabbitMQ
   - Worker para procesamiento asíncrono
   - Estados: PENDING, PREPARING, READY, DELIVERED, CANCELLED

6. ✅ **Panel de administración**
   - Gestión de pedidos
   - Gestión de productos
   - Gestión de clientes
   - Estadísticas en tiempo real (pedidos e ingresos del día)
   - Aplicación separada en puerto 3001

7. ✅ **Sesiones independientes**
   - Frontend cliente (puerto 3000) - solo clientToken
   - Frontend admin (puerto 3001) - solo adminToken
   - Redirecciones sin interferencia de sesiones

### Arquitectura de Sesiones

- **Cliente → Admin:** Redirige con `?forceLogin=true` (siempre muestra login)
- **Admin → Cliente:** Redirige con `?noSession=true` (sin sesión de cliente)
- **Tokens separados:** `clientToken` y `adminToken` en localStorage independiente

---

## 🎯 Próximos Pasos Sugeridos

1. **Testing**
   - Tests unitarios para componentes React
   - Tests de integración para endpoints FastAPI
   - Tests E2E para flujos críticos

2. **Mejoras de Performance**
   - Caché de productos
   - Optimización de queries SQL
   - Lazy loading de componentes

3. **Funcionalidades Adicionales**
   - Sistema de notificaciones en tiempo real (WebSockets)
   - Integración de pagos (Stripe/PayPal)
   - Sistema de reseñas y calificaciones
   - Dashboard de analytics avanzado

4. **Seguridad**
   - Rate limiting en API
   - Validación más estricta de inputs
   - Auditoría de acciones administrativas

5. **DevOps**
   - CI/CD pipeline
   - Monitoreo y logging
   - Backup automatizado de base de datos

---

## 📝 Notas Importantes para IA

### Convenciones de Código

- **Python (API):** PEP 8, type hints, async/await para operaciones I/O
- **JavaScript/React:** ES6+, functional components, hooks
- **TypeScript:** Tipado estricto, interfaces claras
- **Naming:** camelCase para variables/funciones, PascalCase para componentes/clases

### Patrones de Diseño

- **API:** RESTful, separación de routers/services/models
- **Frontend:** Component-based, hooks personalizados, separación de concerns
- **Worker:** Event-driven, procesamiento asíncrono de mensajes

### Mejores Prácticas

- Siempre usar variables de entorno para configuración
- Validar inputs tanto en frontend como backend
- Manejar errores de forma consistente
- Documentar funciones complejas
- Mantener componentes pequeños y reutilizables

---

**Última actualización:** Noviembre 2025
**Versión del documento:** 2.0
