# 📦 Compartir Datos de Base de Datos entre Desarrolladores

Este documento explica cómo compartir los datos de la base de datos con tu equipo de trabajo.

## 🎯 Problema

Cuando cada desarrollador clona el proyecto y ejecuta `docker-compose up`, obtiene una base de datos vacía. Los volúmenes de Docker son específicos de cada máquina y no se comparten automáticamente en el repositorio.

## ✅ Solución

Hemos implementado un sistema de **backups y restores** que permite compartir los datos de la base de datos entre desarrolladores a través del repositorio Git.

## 📋 Guía Rápida

### Para el Líder del Proyecto (Generar y Compartir Datos)

1. **Inicializar la base de datos con datos de ejemplo:**
   ```powershell
   .\scripts\initialize-database.ps1
   ```
   Esto creará productos, usuarios de prueba y pedidos de ejemplo.

2. **Crear un backup inicial para compartir:**
   ```powershell
   .\scripts\create-initial-backup.ps1
   ```
   Esto generará `database/backups/initial_data.sql` con todos los datos.

3. **Crear backups adicionales cuando sea necesario:**
   ```powershell
   .\scripts\backup-database.ps1
   ```
   Esto creará un backup con timestamp: `database/backups/backup_YYYYMMDD_HHMMSS.sql`

4. **Compartir el backup en Git:**
   ```powershell
   git add database/backups/initial_data.sql
   git commit -m "Backup inicial de base de datos con datos de ejemplo"
   git push
   ```

### Para los Colaboradores (Recibir y Restaurar Datos)

1. **Obtener el último código del repositorio:**
   ```powershell
   git pull
   ```

2. **Iniciar los servicios:**
   ```powershell
   docker-compose up -d
   ```

3. **Esperar a que la base de datos se inicialice** (unos segundos)

4. **Restaurar los datos compartidos:**
   ```powershell
   .\scripts\restore-database.ps1 -BackupFile "database/backups/initial_data.sql"
   ```

   O si hay un backup más reciente:
   ```powershell
   .\scripts\restore-database.ps1 -BackupFile "database/backups/backup_YYYYMMDD_HHMMSS.sql"
   ```

## 🔧 Scripts Disponibles

### 1. `backup-database.ps1`
Crea un backup de la base de datos actual.

**Uso:**
```powershell
.\scripts\backup-database.ps1
```

**Qué hace:**
- Verifica que el contenedor de PostgreSQL esté corriendo
- Crea un dump SQL completo de la base de datos
- Guarda el archivo en `database/backups/backup_YYYYMMDD_HHMMSS.sql`

### 2. `restore-database.ps1`
Restaura un backup de la base de datos.

**Uso:**
```powershell
.\scripts\restore-database.ps1 -BackupFile "database/backups/initial_data.sql"
```

**Parámetros:**
- `-BackupFile` (obligatorio): Ruta al archivo SQL de backup

**Qué hace:**
- Verifica que el archivo de backup exista
- Muestra una advertencia antes de proceder
- Restaura todos los datos del backup

**⚠️ Advertencia:** Este script **reemplazará todos los datos existentes** en la base de datos.

### 3. `initialize-database.ps1`
Inicializa la base de datos con datos de ejemplo.

**Uso:**
```powershell
.\scripts\initialize-database.ps1
```

**Parámetros opcionales:**
- `-SkipSeed`: Omite la creación de datos de ejemplo
- `-CreateBackup`: Crea un backup después de inicializar (por defecto: true)

**Qué hace:**
- Ejecuta el seed de datos de ejemplo (productos, usuarios, pedidos)
- Crea un backup automático de los datos inicializados

### 4. `create-initial-backup.ps1`
Crea un backup inicial listo para compartir.

**Uso:**
```powershell
.\scripts\create-initial-backup.ps1
```

**Qué hace:**
- Crea un backup de la base de datos actual
- Lo guarda como `database/backups/initial_data.sql`
- Si ya existe un backup inicial, crea una copia de seguridad del anterior

## 📊 Estructura de Datos Iniciales

Cuando ejecutas `initialize-database.ps1`, se crean:

### Productos (10 productos)
- **SALCHIPAPAS:** Salchipapa Clásica, Salchipapa Especial, SalchiGod
- **BEBIDAS:** Gaseosa, Jugo Natural, Agua con Gas
- **ADICIONALES:** Queso Extra, Chorizo Extra
- **COMBOS:** Combo Familiar, Combo Personal

### Usuarios
- **Administrador:**
  - Email: `Admin@sofka.com`
  - Password: `Admin 123`
  - Rol: ADMIN

- **Usuarios de Prueba:**
  - Email: `cliente1@example.com` / Password: `cliente123`
  - Email: `cliente2@example.com` / Password: `cliente123`

### Pedidos de Ejemplo
- 2 pedidos de ejemplo asociados a los usuarios de prueba

## 🔄 Flujo de Trabajo Recomendado

### Al Iniciar el Proyecto (Primera Vez)

1. Líder: Ejecutar `initialize-database.ps1`
2. Líder: Ejecutar `create-initial-backup.ps1`
3. Líder: Commit y push del `initial_data.sql`
4. Colaboradores: `git pull` y luego `restore-database.ps1`

### Cuando se Agregan Nuevos Datos Importantes

1. Líder: Ejecutar `backup-database.ps1`
2. Líder: Commit y push del nuevo backup
3. Colaboradores: `git pull` y luego `restore-database.ps1` con el nuevo archivo

### Desarrollo Diario

- Cada desarrollador puede trabajar con sus propios datos locales
- No es necesario compartir backups constantemente
- Solo compartir cuando hay cambios importantes o datos de prueba nuevos

## ⚠️ Consideraciones Importantes

1. **Tamaño de Archivos:** Los backups SQL pueden ser grandes. Considera usar Git LFS si son muy grandes.

2. **Datos Sensibles:** Si hay datos reales de usuarios o información sensible, NO los subas al repositorio.

3. **Conflictos:** Si múltiples personas crean backups al mismo tiempo, coordina quién genera el backup compartido.

4. **Volúmenes Docker:** Los datos se guardan en volúmenes de Docker. Si eliminas los volúmenes con `docker-compose down -v`, perderás los datos locales pero podrás restaurarlos desde los backups.

## 🐛 Solución de Problemas

### Error: "Contenedor no está corriendo"
```powershell
# Iniciar los servicios primero
docker-compose up -d
```

### Error: "No se puede restaurar el backup"
- Verifica que el archivo de backup existe
- Verifica que el contenedor de PostgreSQL está corriendo
- Intenta ejecutar el restore de nuevo

### Los datos no aparecen después de restaurar
```powershell
# Reiniciar los servicios
docker-compose restart api worker
```

### Quiero empezar de cero
```powershell
# Detener y eliminar volúmenes
docker-compose down -v

# Iniciar de nuevo
docker-compose up -d

# Esperar unos segundos y restaurar
.\scripts\restore-database.ps1 -BackupFile "database/backups/initial_data.sql"
```

## 📚 Archivos Relacionados

- `database/backups/` - Carpeta con todos los backups
- `scripts/` - Scripts de backup y restore
- `api/seed_data.py` - Script que genera datos de ejemplo
- `api/init_db.py` - Script que inicializa la estructura de la base de datos

---

¿Tienes preguntas o problemas? Revisa los logs de los contenedores:
```powershell
docker-compose logs api
docker-compose logs postgres
```

