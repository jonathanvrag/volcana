# Guía de Diseño UI - Volcana

Esta guía documenta los estándares de diseño y componentes de usuario para el proyecto Volcana.

## 1. Filosofía de Diseño

Volcana utiliza una interfaz moderna y minimalista, optimizada para la visualización de datos geoespaciales.

- **Framework CSS**: TailwindCSS v4.
- **Tema**: Dark Mode por defecto (fondo `#242424`, texto `rgba(255, 255, 255, 0.87)`).
- **Tipografía**: Fuente del sistema (`system-ui`, `Avenir`, `Helvetica`, `Arial`).

## 2. Paleta de Colores

Aunque se utiliza la paleta por defecto de TailwindCSS, los colores primarios semánticos son:

| Semántica | Color (Tailwind) | Uso |
|-----------|------------------|-----|
| **Fondo** | `bg-neutral-900` / `#242424` | Fondo principal de la aplicación. |
| **Superficie** | `bg-neutral-800` | Tarjetas, paneles laterales, modales. |
| **Texto** | `text-white` / `white/87` | Texto principal de lectura. |
| **Acento** | `text-blue-500` | Enlaces, estados activos. |
| **Alerta** | `text-red-500` | Errores, zonas de peligro en mapas. |
| **Éxito** | `text-green-500` | Confirmaciones de operación. |

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

