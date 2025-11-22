# Pasos de Verificación y Prueba

## ✅ Paso 1: Verificar que la tabla `addresses` existe

La tabla `addresses` se crea automáticamente cuando inicias el servidor API. El servidor ejecuta `init_db.py` en el startup que verifica y crea todas las tablas necesarias, incluyendo `addresses`.

### Opción A: Verificar desde el código (Recomendado)

El servidor API ya tiene lógica para crear la tabla automáticamente. Solo necesitas:

1. **Iniciar el servidor API** - La tabla se creará automáticamente si no existe
2. **Revisar los logs** - Verás mensajes como:
   - `✅ Las tablas ya existen en la base de datos` (si ya existe)
   - `📊 Creando tablas en la base de datos...` (si se está creando)

### Opción B: Verificar manualmente con SQL

Si quieres verificar manualmente, puedes conectarte a PostgreSQL:

```powershell
# Conectarse al contenedor de PostgreSQL
docker exec -it prueba-restaurante--postgres-1 psql -U postgres -d restaurante_db

# Luego ejecutar:
\dt addresses
# O
SELECT * FROM information_schema.tables WHERE table_name = 'addresses';
```

## ✅ Paso 2: Reiniciar el servidor API

Para aplicar los cambios realizados:

### Si estás usando modo local (sin Docker para API):

1. **Detener el servidor API** (Ctrl+C en la terminal donde está corriendo)
2. **Reiniciar el servidor**:
   ```powershell
   cd api
   .\venv\Scripts\Activate.ps1
   uvicorn main:app --reload --host 0.0.0.0 --port 5000
   ```

### Si estás usando Docker completo:

```powershell
# Reiniciar solo el servicio API
docker-compose restart api

# O reiniciar todo
docker-compose restart
```

## ✅ Paso 3: Probar guardar una dirección desde el frontend

1. **Abrir el frontend**: http://localhost:3000
2. **Iniciar sesión** como cliente (o registrarse si no tienes cuenta)
3. **Ir al formulario de pedido**
4. **Hacer clic en "+ Agregar dirección"**
5. **Llenar el formulario**:
   - Calle: (requerido)
   - Ciudad: (requerido)
   - Departamento: (requerido)
   - Código Postal: (requerido)
   - País: Colombia (por defecto)
   - Instrucciones adicionales: (opcional)
6. **Hacer clic en "Guardar Dirección"**

### Verificar que funcionó:

- ✅ Deberías ver un mensaje de éxito
- ✅ La dirección debería aparecer en el selector de direcciones
- ✅ No deberías ver errores 422 en la consola del navegador

### Si hay errores:

- **Error 422**: Verifica que todos los campos requeridos estén llenos
- **Error 500**: Revisa los logs del servidor API para ver el error específico
- **Error de conexión**: Verifica que el servidor API esté corriendo en el puerto 5000

## ✅ Paso 4: Acceder a la vista de Clientes en el panel de administración

1. **Abrir el frontend**: http://localhost:3000
2. **Hacer clic en "Ir a Vista Admin"** (botón flotante naranja)
3. **Iniciar sesión como administrador**:
   - Email: `Admin@sofka.com`
   - Contraseña: `Admin 123`
4. **En el panel de control** (sidebar izquierdo), hacer clic en **"Clientes"**
5. **Verificar que se muestren**:
   - Lista de todos los clientes registrados
   - Información de cada cliente (nombre, email, teléfono, fecha de registro)
   - Botón para expandir y ver las direcciones de cada cliente
   - Direcciones con información completa (calle, ciudad, departamento, código postal, instrucciones)

### Funcionalidades de la vista de Clientes:

- ✅ Lista todos los clientes con rol CUSTOMER
- ✅ Muestra información básica: nombre, email, teléfono, fecha de registro
- ✅ Permite expandir cada cliente para ver sus direcciones
- ✅ Muestra todas las direcciones de cada cliente
- ✅ Indica cuál es la dirección principal (isDefault)
- ✅ Muestra instrucciones adicionales si existen

## 🔍 Verificación de Logs

### Logs del Servidor API:

Al iniciar el servidor, deberías ver:
```
🚀 Inicializando base de datos...
✅ Las tablas ya existen en la base de datos
✅ Usuario admin ya existe
```

O si es la primera vez:
```
🚀 Inicializando base de datos...
📊 Creando tablas en la base de datos...
✅ Base de datos inicializada correctamente
✅ Usuario admin creado exitosamente
```

### Logs al guardar una dirección:

Deberías ver en los logs del servidor:
```
✅ Mensaje publicado a order_queue: [order_id]
```

## 🐛 Solución de Problemas

### La tabla no se crea automáticamente:

1. Verifica que `DATABASE_URL` esté configurada correctamente en `api/.env`
2. Verifica que PostgreSQL esté corriendo: `docker ps`
3. Revisa los logs del servidor API para ver errores específicos

### Error 422 al guardar dirección:

- Verifica que todos los campos requeridos estén llenos
- Verifica que el campo "Calle" no esté vacío
- Revisa la consola del navegador para ver el error específico

### No se muestran clientes en el panel admin:

1. Verifica que hayas iniciado sesión como administrador
2. Verifica que existan clientes registrados (rol CUSTOMER)
3. Revisa la consola del navegador para ver errores de la API
4. Verifica que el endpoint `/api/admin/customers` esté funcionando

## 📝 Notas Importantes

- La tabla `addresses` se crea automáticamente al iniciar el servidor API
- Los cambios en el código del servidor requieren reiniciar el servidor
- El frontend se recarga automáticamente con hot reload (no requiere reinicio)
- RabbitMQ Worker debe estar corriendo para procesar los pedidos correctamente

