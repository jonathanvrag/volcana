# Documentación Proyecto Volcana

**Repositorio del Código Fuente:**  
[https://github.com/jonathanvrag/volcana.git](https://github.com/jonathanvrag/volcana.git)

---

## Tabla de Contenidos

1. [Documentación Técnica](#1-documentación-técnica)
2. [Manual de Instalación y Operación](#2-manual-de-instalación-y-operación)
3. [Manual de Usuario](#3-manual-de-usuario)
4. [Guía de Diseño UI](#4-guía-de-diseño-ui)

---

# 1. Documentación Técnica

Este documento proporciona una visión general de la arquitectura, componentes y tecnologías utilizadas en el proyecto Volcana.

## 1. Arquitectura del Sistema

Volcana sigue una arquitectura de microservicios contenerizados, orquestados mediante Docker Compose.

### Diagrama de Componentes

```mermaid
graph TD
    Client[Cliente Web (Browser)] -->|HTTP/HTTPS| Nginx[Nginx Reverse Proxy]
    Nginx -->|/api/*| Backend[Backend (FastAPI)]
    Nginx -->|/*| Frontend[Frontend (React + Vite)]
    Backend -->|SQL| DB[(PostgreSQL)]
    Backend -->|Volumes| Media[Almacenamiento de Medios]
```

### Tecnologías Principales

- **Backend**: Python 3.12, FastAPI, SQLAlchemy (ORM), Alembic (Migraciones), Pydantic.
- **Frontend**: React 19, Vite, TailwindCSS (v4), Leaflet (Mapas).
- **Base de Datos**: PostgreSQL 16.
- **Infraestructura**: Docker, Docker Compose, Nginx.

## 2. Backend (`/backend`)

El backend expone una API RESTful para la gestión de usuarios, medios y auditoría.

### 2.1. Referencia de API

Base URL: `/api`

#### Usuarios (`/users`)

- `GET /users/me`: Obtiene información del usuario actual.
- `GET /users/`: Lista todos los usuarios (Requiere rol Admin).
- `POST /users/`: Crea un nuevo usuario (Requiere rol Admin).
- `PATCH /users/{id}`: Actualiza un usuario (rol/estado) (Requiere rol Admin).
- `POST /users/change-password`: Cambia la contraseña del usuario actual.

#### Medios y Playlists (`/media`)

- **Playlists**:
  - `GET /playlists`: Listar playlists.
  - `POST /playlists`: Crear playlist.
  - `PUT /playlists/{id}`: Actualizar playlist.
  - `DELETE /playlists/{id}`: Eliminar playlist (Admin).
  - `GET /playlists/{id}/media`: Obtener items multimedia de una playlist (para el reproductor).

- **Media Items**:
  - `GET /media`: Listar todos los items multimedia.
  - `POST /media`: Subir/Crear nuevo item multimedia.
  - `PUT /media/{id}`: Actualizar metadatos de un item.
  - `DELETE /media/{id}`: Eliminar item (Admin).

### 2.2. Esquema de Base de Datos

El sistema utiliza PostgreSQL. A continuación se detallan las tablas principales (Modelos SQLAlchemy):

**Tabla `users`**

- `id`: Integer (PK)
- `email`: String (Unique)
- `full_name`: String
- `password_hash`: String
- `role`: String (default: 'editor')
- `is_active`: Boolean

**Tabla `playlist`**

- `id`: Integer (PK)
- `name`: Text
- `description`: Text
- `is_active`: Boolean

**Tabla `media_item`**

- `id`: Integer (PK)
- `playlist_id`: Integer (FK -> playlist.id)
- `type`: Text (image, video)
- `title`: Text
- `file_url`: Text
- `duration_seconds`: Integer
- `order_index`: Integer
- `active`: Boolean

**Tabla `audit_logs`**

- `id`: Integer (PK)
- `user_id`: Integer (FK -> users.id)
- `action`: String (e.g., 'user_created', 'media_deleted')
- `entity_type`: String
- `entity_id`: Integer
- `details`: JSON (metadata del cambio)

## 3. Frontend (`/frontend`)

El frontend es una Single Page Application (SPA) construida con React y Vite.

### Estructura de Directorios

- `src/router/`: Configuración de rutas (React Router).
- `src/pages/`: Vistas principales.
  - `PantallaPublica`: Vista del reproductor (Player).
  - `CmsLayout`: Estructura base del panel de administración.
  - `CmsPlaylists`, `CmsMedia`, `CmsUsers`: Vistas de gestión.

### Routing

- `/`: Pantalla Pública (Playlist por defecto).
- `/video`: Modo Solo Video (Playlist de videos).
- `/login`: Inicio de sesión.
- `/cms/*`: Panel de administración (Protegido por `PrivateRoute`).

## 4. Flujo de Trabajo y Desarrollo

### Migraciones de Base de Datos

Las migraciones se gestionan con Alembic.

- Crear nueva migración: `alembic revision --autogenerate -m "descripcion"`
- Aplicar migraciones: `alembic upgrade head`

### Despliegue

El despliegue se realiza mediante `docker-compose up -d --build`. Nginx actúa como punto de entrada único, sirviendo los archivos estáticos del frontend y redirigiendo las peticiones `/api` al servicio de backend.

# 2. Manual de Instalación y Operación

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

# 3. Manual de Usuario

Bienvenido al Manual de Usuario de Volcana. Este documento le guiará a través de las funcionalidades principales del sistema y cómo utilizarlas eficientemente.

## 1. Introducción

Volcana es una plataforma diseñada para la gestión y visualización de datos geoespaciales y multimedia. Permite a los usuarios autorizados acceder a mapas interactivos, cargar archivos y gestionar la información del sistema.

## 2. Acceso al Sistema

### 2.1. Iniciar Sesión

1. Abra su navegador web y navegue a la URL de la aplicación (por defecto `http://localhost:8080`).
2. Se le presentará una pantalla de inicio de sesión.
3. Ingrese su **Correo Electrónico** y **Contraseña**.
4. Haga clic en el botón "Ingresar".

> **Nota:** Si es su primera vez ingresando, solicite sus credenciales al administrador del sistema.

### 2.2. Cerrar Sesión

Para cerrar su sesión de forma segura:

1. Localice el icono de usuario o su nombre en la esquina superior derecha de la pantalla.
2. Haga clic para desplegar el menú de opciones.
3. Seleccione la opción "Cerrar Sesión" o "Salir".

## 3. Navegación y Vistas

El sistema cuenta con dos vistas principales:

### 3.1. Pantalla Pública (Player)

Es la vista por defecto al ingresar a la raíz del sitio (`/`). Diseñada para mostrarse en pantallas de señalización digital.

- **Modo Estándar**: Muestra un ciclo de contenidos multimedia (imágenes/videos) junto con paneles de información meteorológica y mapas.
- **Modo Solo Video** (`/video`): Una vista simplificada que solo reproduce videos en bucle continuo, ideal para pantallas de entretenimiento o informativas sin datos en tiempo real.

### 3.2. Sistema de Gestión (CMS)

Accesible tras iniciar sesión (`/cms`). Aquí los administradores y editores gestionan el contenido que aparece en las pantallas públicas.

## 4. Gestión de Contenidos (CMS)

### 4.1. Gestión de Playlists

Las playlists agrupan y ordenan los contenidos multimedia.

- **Crear Playlist**: En la sección "Playlists", haga clic en "Nueva Playlist". Asigne un nombre y descripción.
- **Editar Playlist**: Haga clic en el nombre de una playlist para ver sus contenidos.
- **Ordenar Contenidos**: Dentro de una playlist, puede reordenar los items. El orden descendente determina la secuencia de reproducción en la Pantalla Pública.

### 4.2. Gestión de Archivos Multimedia

- **Subir Archivo**: Dentro de una playlist, use el botón "Agregar Medio". Puede subir imágenes o videos.
- **Tipos soportados**: JPG, PNG, MP4.
- **Duración**: Para imágenes, puede definir cuánto tiempo (segundos) permanecerán en pantalla. Los videos se reproducen completos.

### 4.3. Gestión de Usuarios (Solo Administradores)

Si usted tiene rol de Administrador, tendrá acceso al módulo de Usuarios.

- **Crear Usuario**: Ingrese nombre, correo y asigne un rol (Admin/Usuario). Se generará una contraseña temporal.
- **Editar Usuario**: Puede modificar los datos o cambiar el rol de un usuario existente.
- **Desactivar Usuario**: Puede restringir el acceso a un usuario sin eliminar sus datos históricos.

## 4. Preguntas Frecuentes (FAQ)

**Q: ¿Qué hago si olvidé mi contraseña?**
A: Contacte al administrador del sistema para que restablezca su contraseña.

**Q: ¿El mapa no carga correctamente?**
A: Verifique su conexión a internet. Si el problema persiste, intente recargar la página (F5) o limpiar la caché de su navegador.

**Q: ¿Puedo acceder desde mi móvil?**
A: Sí, Volcana es compatible con dispositivos móviles y tablets.

# 4. Guía de Diseño UI

Esta guía documenta los estándares de diseño y componentes de usuario para el proyecto Volcana.

## 1. Filosofía de Diseño

Volcana utiliza una interfaz moderna y minimalista, optimizada para la visualización de datos geoespaciales.

- **Framework CSS**: TailwindCSS v4.
- **Tema**: Dark Mode por defecto (fondo `#242424`, texto `rgba(255, 255, 255, 0.87)`).
- **Tipografía**: Fuente del sistema (`system-ui`, `Avenir`, `Helvetica`, `Arial`).

## 2. Paleta de Colores

Aunque se utiliza la paleta por defecto de TailwindCSS, los colores primarios semánticos son:

| Semántica      | Color (Tailwind)             | Uso                                   |
| -------------- | ---------------------------- | ------------------------------------- |
| **Fondo**      | `bg-neutral-900` / `#242424` | Fondo principal de la aplicación.     |
| **Superficie** | `bg-neutral-800`             | Tarjetas, paneles laterales, modales. |
| **Texto**      | `text-white` / `white/87`    | Texto principal de lectura.           |
| **Acento**     | `text-blue-500`              | Enlaces, estados activos.             |
| **Alerta**     | `text-red-500`               | Errores, zonas de peligro en mapas.   |
| **Éxito**      | `text-green-500`             | Confirmaciones de operación.          |

## 3. Tipografía

Se privilegia la legibilidad en pantallas de alta densidad.

- **Encabezados (H1, H2)**: `font-bold`, `tracking-tight`.
- **Cuerpo**: `text-base` (16px), `leading-relaxed`.
- **Etiquetas**: `text-sm`, `font-medium`, `text-gray-400`.

## 4. Componentes Principales

### 4.1. Mapas (`CampusMap`)

El componente central es el mapa interactivo.

- **Librería**: React Leaflet.
- **Estilo**: Pantalla completa (`h-screen`, `w-full`).
- **Interactividad**: Popups (`StationPopup`) al hacer clic en marcadores.

### 4.2. Paneles de Información (`PanelMonitor`)

Utilizados para mostrar detalles de una estación o datos en tiempo real.

- **Ubicación**: Flotantes o laterales.
- **Estilo**: Fondo semitransparente o sólido oscuro com borde redondeado (`rounded-lg`, `shadow-xl`).
- **Contenido**: Tablas de datos, gráficos (si aplica), estado de conexión.

### 4.3. Modales y Popups (`StationPopup`)

Ventanas emergentes para información rápida.

- **Header**: Título de la estación/elemento.
- **Body**: Lista de propiedades (Temperatura, Humedad, etc.).
- **Footer**: Acciones (Ver más, Cerrar).

### 4.4. Layouts

**Layout Público (`PantallaPublica`)**

- Diseño a pantalla completa (100vh/100vw).
- Sin barras de desplazamiento.
- Elementos flotantes sobre el mapa/video (Paneles informativos).

**Layout CMS (`CmsLayout`)**

- **Sidebar**: Navegación vertical izquierda (`w-64`, `min-h-screen`, `bg-neutral-800`).
- **Content Area**: Área principal de trabajo con padding (`p-6`).
- **Top Bar**: Información de usuario y breadcrumbs.

### 4.5. Componentes CMS

**Tablas de Datos**

- Encabezados: Texto `uppercase`, `text-xs`, `font-bold`, `text-gray-400`.
- Filas: `hover:bg-neutral-700/50`.
- Acciones: Botones de iconos al final de la fila.

**Formularios**

- Inputs: `bg-neutral-700`, `border-transparent`, `focus:ring-2`, `focus:ring-blue-500`.
- Labels: `block`, `mb-2`, `text-sm`, `font-medium`.
- Botones Primarios: `bg-blue-600`, `hover:bg-blue-700`, `text-white`, `rounded`.

## 5. Iconografía

Se recomienda el uso de `react-icons` o SVGs optimizados para representar elementos del mapa y controles de interfaz.

- **Estaciones**: Marcadores de mapa personalizados.
- **Controles**: Iconos estándar para zoom, capas, usuario.
