# Manual de Usuario - Volcana

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
