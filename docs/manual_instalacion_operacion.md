# Manual de Instalación y Operación - Volcana

Este documento detalla los pasos necesarios para instalar, configurar y operar el sistema Volcana.

## 1. Requisitos del Sistema

Antes de comenzar, asegúrese de tener instalado el siguiente software en el servidor o máquina de desarrollo:

- **Git**: Para clonar el repositorio.
- **Docker Engine** (v20.10+): Para la ejecución de contenedores.
- **Docker Compose** (v2.0+): Para la orquestación de servicios.

Recursos recomendados:
- **CPU**: 2 vCPU mínimo.
- **RAM**: 4GB mínimo (recomendado 8GB).
- **Disco**: 20GB de espacio libre.

## 2. Instalación y Despliegue

### 2.1. Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd volcana
```

### 2.2. Configuración de Variables de Entorno

El sistema requiere archivos `.env` para configurar los servicios.

**Backend (.env):**
Cree un archivo `backend/.env` con la siguiente estructura (ajuste según necesidad):
```env
POSTGRES_USER=volcana
POSTGRES_PASSWORD=volcana
POSTGRES_DB=volcana
POSTGRES_HOST=db
POSTGRES_PORT=5432
SECRET_KEY=tu_clave_secreta_super_segura
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Frontend (si aplica):**
El frontend puede requerir variables en `frontend/.env` para apuntar a la API si se construye para producción fuera de Docker, pero dentro de Docker, Nginx maneja el proxy.

### 2.3. Construcción y Ejecución

Para iniciar todos los servicios (Base de datos, Backend, Frontend, Nginx):

1. Navegue al directorio `core` donde se encuentra el `docker-compose.yaml`:
   ```bash
   cd core
   ```

2. Construya e inicie los contenedores en segundo plano:
   ```bash
   docker-compose up -d --build
   ```

3. Verifique que los servicios estén corriendo:
   ```bash
   docker-compose ps
   ```
   Debería ver los servicios: `volcana-db`, `volcana-backend`, `volcana-frontend`, `volcana-core-nginx`.

## 3. Operación del Sistema

### 3.1. Acceso a la Aplicación

Una vez desplegado, el sistema es accesible a través del puerto 8080 (o el configurado en el `docker-compose.yaml`):

- **Web UI**: [http://localhost:8080](http://localhost:8080)
- **API Docs**: [http://localhost:8080/api/docs](http://localhost:8080/api/docs)

### 3.2. Comandos Comunes de Operación

**Ver logs del sistema:**
```bash
# Ver todos los logs
docker-compose logs -f

# Ver logs de un servicio específico (ej. backend)
docker-compose logs -f backend
```

**Detener el sistema:**
```bash
docker-compose down
```

**Reiniciar un servicio:**
```bash
docker-compose restart <nombre_servicio>
# Ejemplo: docker-compose restart backend
```

**Ejecutar migraciones de base de datos manualmente:**
El contenedor de backend ejecuta migraciones al inicio, pero si necesita hacerlo manual:
```bash
docker-compose exec backend alembic upgrade head
```

### 3.3. Copias de Seguridad (Backups)

Para realizar un backup de la base de datos PostgreSQL:

```bash
docker-compose exec db pg_dump -U volcana volcana > backup_$(date +%F).sql
```

Para restaurar:
```bash
cat backup_file.sql | docker-compose exec -T db psql -U volcana volcana
```

## 4. Solución de Problemas (Troubleshooting)

- **Error de conexión a BD**: Verifique que el contenedor `db` esté saludable (`docker-compose ps`). Revise los logs del backend.
- **Problemas de CORS en Frontend**: Asegúrese de acceder a través de Nginx (puerto 8080) y no directamente al frontend o backend, para evitar problemas de dominios cruzados.
- **Espacio en disco**: Ejecute `docker system prune` ocasionalmente para limpiar imágenes y contenedores no utilizados.

## 5. Despliegue en Producción

Para entornos productivos, se recomienda realizar las siguientes configuraciones adicionales:

### 5.1. Seguridad y SSL

1. **Certificados SSL**: Utilice Certbot para generar certificados Let's Encrypt.
   ```bash
   certbot certonly --webroot -w /var/www/certbot -d su-dominio.com
   ```
2. **Configuración Nginx**: Modifique `core/nginx.conf` para escuchar en el puerto 443 y apuntar a los certificados generados.

### 5.2. Optimización

- **Variables de Entorno**: Asegúrese de que `DEBUG=False` en el backend.
- **Base de Datos**: Configure backups automáticos mediante un cron job en el host.
  ```bash
  0 3 * * * docker-compose exec -T db pg_dump -U volcana volcana > /path/to/backups/volcana_$(date +\%F).sql
  ```

## 6. Mantenimiento

Comandos útiles para el mantenimiento regular:

- **Reconstruir contenedores tras cambios en código**:
  ```bash
  docker-compose up -d --build
  ```

- **Limpieza profunda (Cuidado: elimina volúmenes no usados)**:
  ```bash
  docker system prune --volumes
  ```

- **Verificar estado de salud de la BD**:
  ```bash
  docker-compose exec db pg_isready -U volcana
  ```

