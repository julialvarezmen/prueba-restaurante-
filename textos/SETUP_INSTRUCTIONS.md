# Instrucciones de Configuración - Sistema Salchipapas

## ✅ Cambios Realizados

### 1. Schema de Prisma
- ✅ Configurado `binaryTargets` para `linux-musl-openssl-3.0.x` (ya estaba configurado)
- ✅ Modelos `User` y `Product` verificados y correctos

### 2. Script de Semillas
- ✅ Actualizado `prisma/seed.ts` con exactamente **5 productos**:
  1. Salchipapa Clásica
  2. Salchipapa Especial
  3. Gaseosa
  4. Jugo Natural
  5. Queso Extra
- ✅ Usuario administrador por defecto creado
- ✅ Configurado `package.json` con sección `prisma.seed`

### 3. Autenticación
- ✅ Backend: Implementada con bcrypt y JWT
- ✅ Frontend: Páginas de Login/Registro funcionando

### 4. Pasarela de Pagos Simulada
- ✅ Endpoint `POST /api/payments` creado
- ✅ Integrado en el checkout del frontend
- ✅ Simula procesamiento de 2 segundos

---

## 🚀 Comandos para Aplicar Cambios

### Opción 1: Usando Docker Compose (Recomendado)

```bash
# 1. Asegúrate de estar en el directorio raíz del proyecto
cd C:\Users\a_jtibaduiza\Cursor

# 2. Detener contenedores si están corriendo
docker-compose down

# 3. Reconstruir y levantar los servicios
docker-compose up --build

# 4. En otra terminal, ejecutar migraciones y seed
docker-compose exec backend npm run prisma:migrate
docker-compose exec backend npm run prisma:seed
```

### Opción 2: Desarrollo Local (si tienes Node.js instalado)

```bash
# 1. Navegar al backend
cd backend

# 2. Instalar dependencias (si no están instaladas)
npm install

# 3. Configurar variables de entorno
# Copia env.example a .env y configura DATABASE_URL

# 4. Generar Prisma Client
npm run prisma:generate

# 5. Ejecutar migraciones (crea las tablas en la BD)
npm run prisma:migrate

# 6. Poblar la base de datos con datos iniciales
npm run prisma:seed

# 7. Iniciar el servidor
npm run dev
```

---

## 📋 Comandos Específicos de Prisma

### Generar Prisma Client
```bash
npm run prisma:generate
# o
npx prisma generate
```

### Crear y aplicar migraciones
```bash
npm run prisma:migrate
# o
npx prisma migrate dev
```

### Ejecutar seed (poblar base de datos)
```bash
npm run prisma:seed
# o
npx prisma db seed
```

### Abrir Prisma Studio (interfaz visual de la BD)
```bash
npm run prisma:studio
# o
npx prisma studio
```

---

## 🔍 Verificación

Después de ejecutar los comandos, verifica que:

1. **Base de datos poblada:**
   - 5 productos creados
   - 1 usuario admin (email: `admin@salchipapas.com`, password: `admin123`)

2. **API funcionando:**
   - `GET http://localhost:5000/api/health` debe responder
   - `GET http://localhost:5000/api/products` debe retornar 5 productos

3. **Autenticación:**
   - Puedes registrarte en `/register`
   - Puedes iniciar sesión en `/login`

4. **Pagos:**
   - Al hacer checkout, se procesa el pago antes de crear el pedido
   - El proceso tarda ~2 segundos (simulación)

---

## 🐛 Solución de Problemas

### Error P2021: Tabla no existe
**Solución:** Ejecuta las migraciones:
```bash
npm run prisma:migrate
```

### Error: Base de datos vacía
**Solución:** Ejecuta el seed:
```bash
npm run prisma:seed
```

### Error: Prisma Client no generado
**Solución:** Genera el cliente:
```bash
npm run prisma:generate
```

### Error de conexión a la base de datos
**Verifica:**
- Que PostgreSQL esté corriendo
- Que `DATABASE_URL` en `.env` sea correcta
- Que el contenedor de postgres esté activo (si usas Docker)

---

## 📝 Notas Importantes

1. **Primera vez:** Siempre ejecuta las migraciones antes del seed
2. **Docker:** Si usas Docker, los comandos deben ejecutarse dentro del contenedor con `docker-compose exec backend`
3. **Variables de entorno:** Asegúrate de tener un archivo `.env` configurado en el backend
4. **Seed repetido:** El seed limpia datos existentes antes de insertar nuevos (útil para desarrollo)

---

## 🎯 Flujo Completo Recomendado

```bash
# 1. Levantar servicios
docker-compose up -d

# 2. Esperar a que postgres esté listo (10-15 segundos)

# 3. Ejecutar migraciones
docker-compose exec backend npm run prisma:migrate

# 4. Ejecutar seed
docker-compose exec backend npm run prisma:seed

# 5. Verificar logs
docker-compose logs -f backend
```

¡Listo! Tu sistema debería estar funcionando correctamente. 🍟

