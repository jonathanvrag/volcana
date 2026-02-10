# Documentación Técnica - Volcana

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
