# Desarrollo Local (Sin Docker completo)

Este modo ejecuta solo PostgreSQL y RabbitMQ en Docker, y el resto (backend, frontend, worker) localmente.

## Requisitos

- ✅ Docker Desktop (solo para PostgreSQL y RabbitMQ)
- ✅ Python 3.11+ (instalado)
- ✅ Node.js 20+ (instalado)
- ✅ npm (instalado)

## Inicio Rápido

### 1. Iniciar servicios base (PostgreSQL y RabbitMQ)

```powershell
.\start-local.ps1
```

### 2. Terminal 1 - Backend API (FastAPI)

```powershell
cd api
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.local .env
uvicorn main:app --reload --host 0.0.0.0 --port 5000
```

### 3. Terminal 2 - Worker (Node.js)

```powershell
cd worker
Copy-Item .env.local .env
npm install
npm run dev
```

### 4. Terminal 3 - Frontend (React + Vite)

```powershell
cd frontend
npm install
npm run dev
```

## URLs de Acceso

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Documentación API**: http://localhost:5000/docs
- **RabbitMQ Management**: http://localhost:15672 (admin/admin123)

## Detener los Servicios

1. **Backend, Worker, Frontend**: Presiona `Ctrl+C` en cada terminal
2. **PostgreSQL y RabbitMQ**: 
```powershell
.\stop-local.ps1
```

## Volver a Docker Completo

Cuando termines el desarrollo y quieras volver a usar Docker:

```powershell
# Detener servicios locales (Ctrl+C en cada terminal)
.\stop-local.ps1

# Iniciar todo en Docker
docker-compose up -d
```

## Ventajas del Desarrollo Local

✅ Menos consumo de RAM (solo 2 contenedores vs 5)
✅ Hot reload más rápido en backend y frontend
✅ Más fácil de debuggear
✅ Mismo código funciona en Docker después

## Notas

- Los datos en PostgreSQL persisten aunque detengas Docker
- Puedes alternar entre modo local y Docker sin perder datos
- Los cambios en código se aplican inmediatamente (hot reload)
