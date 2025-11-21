from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

from database import engine, Base, get_db
from routers import auth, products, orders, admin, addresses

load_dotenv()

# Crear tablas al iniciar (solo para desarrollo)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    async with engine.begin() as conn:
        # No creamos tablas aquí, usamos Prisma desde el worker
        pass
    yield
    # Shutdown
    pass

app = FastAPI(
    title="Salchipapas API",
    description="API Producer para sistema de pedidos",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    # Añade ambos localhost y 127.0.0.1 explícitamente
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(orders.router, prefix="/api/orders", tags=["orders"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(addresses.router, prefix="/api", tags=["addresses"])

@app.get("/")
async def root():
    return {
        "message": "Salchipapas API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/health"
    }

@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "message": "Salchipapas API is running",
        "service": "producer"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)

