# Sistema de Pedidos de Domicilio - Salchipapas 🍟

Sistema completo de pedidos de domicilio para un restaurante de salchipapas.

## Stack Tecnológico

### Backend
- **Node.js** con **Express** y **TypeScript**
- **PostgreSQL** como base de datos
- **Prisma** como ORM
- **JWT** para autenticación
- **Bcrypt** para hash de contraseñas

### Frontend
- **React** con **TypeScript**
- **Vite** como build tool
- **React Router** para navegación
- **Axios** para peticiones HTTP
- **Tailwind CSS** para estilos

### DevOps
- **Docker** y **Docker Compose** para containerización
- **Nginx** como reverse proxy (opcional)

## Estructura del Proyecto

```
salchipapas-delivery/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── utils/
│   ├── prisma/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── utils/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Funcionalidades

- ✅ Gestión de productos (salchipapas con opciones)
- ✅ Sistema de carrito de compras
- ✅ Autenticación de usuarios
- ✅ Procesamiento de pedidos
- ✅ Gestión de direcciones de entrega
- ✅ Historial de pedidos
- ✅ Panel administrativo (básico)

## Instalación y Ejecución

### Opción 1: Docker Compose (Recomendado)

```bash
# Clonar el repositorio
git clone <repo-url>
cd salchipapas-delivery

# Copiar archivos de ejemplo de variables de entorno
cp backend/env.example backend/.env
cp frontend/env.example frontend/.env

# Iniciar con Docker Compose
docker-compose up --build
```

### Opción 2: Desarrollo Local

#### Backend
```bash
cd backend
npm install
cp env.example .env
# Editar .env con tus configuraciones
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
cp env.example .env
npm run dev
```

El sistema estará disponible en:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- PostgreSQL: localhost:5432

## Variables de Entorno

Ver archivos `env.example` en cada directorio para configuración.

## Base de Datos

### Inicialización Automática

La base de datos se inicializa automáticamente al iniciar los servicios con Docker Compose. Las tablas se crean automáticamente y se crea un usuario administrador por defecto.

### Usuario Admin por Defecto

- Email: `Admin@sofka.com`
- Password: `Admin 123`

### Datos de Ejemplo

Para poblar la base de datos con datos de ejemplo (productos, usuarios de prueba, pedidos):

```powershell
# Opción 1: Script completo (recomendado)
.\scripts\initialize-database.ps1

# Opción 2: Solo ejecutar el seed
docker exec salchipapas-api python seed_data.py
```

### Compartir Datos entre Desarrolladores

El proyecto incluye un sistema de backups para compartir datos entre el equipo. Ver **[DATABASE_SHARING.md](DATABASE_SHARING.md)** para más detalles.

**Resumen rápido:**
```powershell
# Crear backup de datos actuales
.\scripts\backup-database.ps1

# Restaurar datos desde backup
.\scripts\restore-database.ps1 -BackupFile "database/backups/initial_data.sql"
```

Los backups se almacenan en `database/backups/` y pueden ser compartidos a través de Git.

