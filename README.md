# 🔧 Sistema de Gestión de Taller - API REST

API REST completa desarrollada con Node.js, Express y Firebase Firestore para la gestión integral de un taller de reparación de equipos electrónicos.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Endpoints](#endpoints)
- [Modelos de Datos](#modelos-de-datos)

## ✨ Características

- ✅ **Gestión de Clientes**: Particulares y empresas con datos completos
- ✅ **Gestión de Equipos**: Registro de equipos con seguimiento
- ✅ **Gestión de Usuarios**: Sistema de roles (admin, técnico, recepcionista)
- ✅ **Órdenes de Reparación**: Control completo del ciclo de reparación
- ✅ **Gestión de Repuestos**: Inventario con proveedores
- ✅ **Gestión de Proveedores**: Información completa de proveedores
- ✅ **Autenticación JWT**: Token-based con roles
- ✅ **Base de datos NoSQL**: Firebase Firestore con IDs numéricos auto-incrementales
- ✅ **Validación de datos**: Completa en todas las entidades
- ✅ **Manejo de errores**: Centralizado y controlado
- ✅ **CORS habilitado**: Acceso desde distintos orígenes
- ✅ **Búsqueda avanzada**: En todas las entidades

## 🛠 Tecnologías

- **Node.js** v18+
- **Express** v5.1.0
- **Firebase** v12.4.0 (Firestore)
- **JWT** (jsonwebtoken) v9.0.2
- **dotenv** v17.2.3
- **cors** v2.8.5

## 📁 Estructura del Proyecto

```
proyecto-4/
├── src/
│   ├── controllers/          # Lógica de solicitudes HTTP
│   │   ├── auth.controller.js
│   │   ├── clients.controller.js
│   │   ├── equipments.controller.js
│   │   ├── usuarios.controller.js
│   │   ├── ordenes.controller.js
│   │   ├── repuestos.controller.js
│   │   └── proveedores.controller.js
│   ├── models/               # Operaciones con Firestore
│   │   ├── data.js
│   │   ├── clients.model.js
│   │   ├── equipments.model.js
│   │   ├── usuarios.model.js
│   │   ├── ordenes.model.js
│   │   ├── repuestos.model.js
│   │   └── proveedores.model.js
│   ├── routes/               # Definición de rutas
│   │   ├── auth.router.js
│   │   ├── clients.router.js
│   │   ├── equipments.router.js
│   │   ├── usuarios.router.js
│   │   ├── ordenes.router.js
│   │   ├── repuestos.router.js
│   │   └── proveedores.router.js
│   ├── service/              # Validación y formateo
│   │   ├── clients.service.js
│   │   ├── equipments.service.js
│   │   ├── usuarios.service.js
│   │   ├── ordenes.service.js
│   │   ├── repuestos.service.js
│   │   └── proveedores.service.js
│   └── middleware/           # Middlewares
│       └── auth.middleware.js
├── .env                      # Variables de entorno
├── .gitignore
├── index.js                  # Punto de entrada
├── package.json
├── README.md
├── API_EXAMPLES.md
├── clients.json              # Datos de ejemplo
├── equipments.json           # Datos de ejemplo
└── GUÍA DE MIGRACIÓN.md
```

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd proyecto-4
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear archivo `.env` en la raíz del proyecto:

```env
PORT=3000
NODE_ENV=development

FIREBASE_apiKey=tu-api-key
FIREBASE_authDomain=tu-proyecto.firebaseapp.com
FIREBASE_projectId=tu-proyecto-id
FIREBASE_storageBucket=tu-proyecto.appspot.com
FIREBASE_messagingSenderId=tu-messaging-sender-id
FIREBASE_appId=tu-app-id

JWT_secret=tu-secreto-jwt-seguro
```

### 4. Configurar Firebase Firestore

1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilitar Firestore Database
3. Crear las colecciones:
   - `clients`
   - `equipments`
   - `usuarios`
   - `ordenes`
   - `repuestos`
   - `proveedores`
   - `counters` (para IDs auto-incrementales)
4. Copiar las credenciales al archivo `.env`

## ⚙️ Configuración

### Iniciar el servidor

**Modo desarrollo (con nodemon):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📖 Uso

### 1. Autenticación

Para acceder a los endpoints protegidos, primero debes autenticarte:

```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "jcl@gmail.com",
  "password": "jcl"
}
```

**Respuesta:**
```json
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 2. Usar el Token

Para endpoints protegidos, incluye el token en el header:

```bash
Authorization: Bearer <tu-token-jwt>
```

---

## 🔌 Endpoints

### 🔐 Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Iniciar sesión | No |

---

### 👥 Clientes

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/clients` | Obtener todos | No |
| GET | `/api/clients/search?query=...` | Buscar por nombre/email/dni | No |
| GET | `/api/clients/:id` | Obtener por ID | No |
| POST | `/api/clients` | Crear nuevo | No |
| PUT | `/api/clients/:id` | Actualizar | No |
| DELETE | `/api/clients/:id` | Eliminar | No |

---

### 🖥️ Equipos

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/equipments` | Obtener todos | No |
| GET | `/api/equipments/search?query=...` | Buscar por tipo/marca/modelo | No |
| GET | `/api/equipments/client/:id_cliente` | Equipos por cliente | No |
| GET | `/api/equipments/:id` | Obtener por ID | No |
| POST | `/api/equipments` | Crear nuevo | Sí |
| PUT | `/api/equipments/:id` | Actualizar | Sí |
| DELETE | `/api/equipments/:id` | Eliminar | Sí |

---

### 👤 Usuarios

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/usuarios` | Obtener todos | Sí |
| GET | `/api/usuarios/search?query=...` | Buscar por nombre/email/rol | Sí |
| GET | `/api/usuarios/:id` | Obtener por ID | Sí |
| POST | `/api/usuarios` | Crear nuevo | Sí |
| PUT | `/api/usuarios/:id` | Actualizar | Sí |
| DELETE | `/api/usuarios/:id` | Eliminar | Sí |

---

### 📋 Órdenes

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/ordenes` | Obtener todas | Sí |
| GET | `/api/ordenes/search?query=...` | Buscar por descripción/estado | Sí |
| GET | `/api/ordenes/cliente/:id_cliente` | Órdenes por cliente | Sí |
| GET | `/api/ordenes/equipo/:id_equipo` | Órdenes por equipo | Sí |
| GET | `/api/ordenes/tecnico/:id_usuario` | Órdenes por técnico | Sí |
| GET | `/api/ordenes/:id` | Obtener por ID | Sí |
| POST | `/api/ordenes` | Crear nueva | Sí |
| PUT | `/api/ordenes/:id` | Actualizar | Sí |
| DELETE | `/api/ordenes/:id` | Eliminar | Sí |

---

### 🔧 Repuestos

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/repuestos` | Obtener todos | Sí |
| GET | `/api/repuestos/search?query=...` | Buscar por nombre/código | Sí |
| GET | `/api/repuestos/proveedor/:id_proveedor` | Repuestos por proveedor | Sí |
| GET | `/api/repuestos/:id` | Obtener por ID | Sí |
| POST | `/api/repuestos` | Crear nuevo | Sí |
| PUT | `/api/repuestos/:id` | Actualizar | Sí |
| DELETE | `/api/repuestos/:id` | Eliminar | Sí |

---

### 🏢 Proveedores

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/proveedores` | Obtener todos | Sí |
| GET | `/api/proveedores/search?query=...` | Buscar por nombre/cuit | Sí |
| GET | `/api/proveedores/:id` | Obtener por ID | Sí |
| POST | `/api/proveedores` | Crear nuevo | Sí |
| PUT | `/api/proveedores/:id` | Actualizar | Sí |
| DELETE | `/api/proveedores/:id` | Eliminar | Sí |

---

## 📊 Modelos de Datos

### Cliente

```json
{
  "id_cliente": 1,
  "nombre": "María González",
  "dni_cuit": "27-35678912-4",
  "telefono": "11-4567-8901",
  "email": "maria.gonzalez@email.com",
  "direccion": "Av. Corrientes 1234, CABA",
  "tipo_cliente": "particular",
  "fecha_registro": "2025-01-15"
}
```

### Equipo

```json
{
  "id_equipo": 1,
  "id_cliente": 1,
  "tipo_equipo": "notebook",
  "marca": "Lenovo",
  "modelo": "ThinkPad X1 Carbon",
  "nro_serie": "PF2X5ABC123",
  "observaciones": "Pantalla rota",
  "fecha_ingreso": "2025-11-01"
}
```

### Usuario

```json
{
  "id_usuario": 1,
  "nombre": "Juan Técnico",
  "email": "juan@taller.com",
  "telefono": "11-5555-5555",
  "rol": "tecnico",
  "usuario": "juan_tech",
  "estado": true,
  "fecha_alta": "2025-01-10"
}
```

### Orden de Reparación

```json
{
  "id_orden": 1,
  "id_cliente": 1,
  "id_equipo": 1,
  "id_usuario": 1,
  "fecha_recepcion": "2025-11-01",
  "descripcion_falla": "No enciende",
  "diagnostico": "Problema en placa madre",
  "trabajo_realizado": "Reemplazo de capacitores",
  "costo_mano_obra": 500.00,
  "estado": "finalizado",
  "fecha_entrega": "2025-11-05"
}
```

### Repuesto

```json
{
  "id_repuesto": 1,
  "nombre": "Memoria RAM 8GB DDR4",
  "codigo": "RAM-DDR4-8GB",
  "marca": "Kingston",
  "stock": 25,
  "precio_compra": 1500.00,
  "precio_venta": 2000.00,
  "id_proveedor": 1
}
```

### Proveedor

```json
{
  "id_proveedor": 1,
  "nombre": "Distribuidora Electrónica SA",
  "cuit": "30-71234567-8",
  "telefono": "11-3333-3333",
  "email": "contacto@distribuidora.com.ar",
  "direccion": "Av. Acoyte 1234, CABA",
  "condicion_iva": "RI"
}
```

---

## 🧪 Ejemplos de Uso

### Crear un Cliente

```bash
POST http://localhost:3000/api/clients
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "dni_cuit": "20-12345678-9",
  "telefono": "11-1234-5678",
  "email": "juan.perez@email.com",
  "direccion": "Calle Principal 123",
  "tipo_cliente": "particular"
}
```

### Crear un Equipo

```bash
POST http://localhost:3000/api/equipments
Authorization: Bearer <tu-token>
Content-Type: application/json

{
  "id_cliente": 1,
  "tipo_equipo": "notebook",
  "marca": "HP",
  "modelo": "Pavilion 15",
  "nro_serie": "ABC123XYZ",
  "observaciones": "Pantalla parpadeante"
}
```

### Crear un Usuario

```bash
POST http://localhost:3000/api/usuarios
Authorization: Bearer <tu-token>
Content-Type: application/json

{
  "nombre": "Carlos Técnico",
  "email": "carlos@taller.com",
  "telefono": "11-9999-8888",
  "rol": "tecnico",
  "usuario": "carlos_tech",
  "password": "password123"
}
```

### Crear una Orden

```bash
POST http://localhost:3000/api/ordenes
Authorization: Bearer <tu-token>
Content-Type: application/json

{
  "id_cliente": 1,
  "id_equipo": 1,
  "id_usuario": 1,
  "descripcion_falla": "No enciende la pantalla",
  "diagnostico": "Problema en conexión HDMI"
}
```

### Crear un Repuesto

```bash
POST http://localhost:3000/api/repuestos
Authorization: Bearer <tu-token>
Content-Type: application/json

{
  "nombre": "Monitor LED 24 pulgadas",
  "codigo": "MON-LED-24",
  "marca": "LG",
  "stock": 10,
  "precio_compra": 3000.00,
  "precio_venta": 4500.00,
  "id_proveedor": 1
}
```

### Crear un Proveedor

```bash
POST http://localhost:3000/api/proveedores
Authorization: Bearer <tu-token>
Content-Type: application/json

{
  "nombre": "Supplier Electrónico",
  "cuit": "30-12345678-9",
  "telefono": "11-2222-2222",
  "email": "supplier@email.com",
  "direccion": "Av. Gral. Paz 5000",
  "condicion_iva": "RI"
}
```

---

## 🔒 Seguridad

- ✅ JWT para autenticación
- ✅ Variables de entorno para credenciales
- ✅ Validación de datos en controllers
- ✅ Middleware de autenticación para rutas protegidas
- ✅ Las contraseñas nunca se devuelven en respuestas
- ✅ `.gitignore` configurado para proteger información sensible

---

## 📝 Notas Importantes

### IDs Numéricos Auto-incrementales
- Todos los IDs (id_cliente, id_equipo, id_usuario, etc.) son numéricos y auto-incrementales
- Se generan automáticamente desde una colección `counters` en Firestore
- Comienzan en 1 y se incrementan secuencialmente

### Fechas Automáticas
- `fecha_registro`: Se genera automáticamente al crear un cliente
- `fecha_ingreso`: Se genera automáticamente al crear un equipo
- `fecha_alta`: Se genera automáticamente al crear un usuario
- `fecha_recepcion`: Se genera automáticamente al crear una orden

### Validaciones
- Todos los campos obligatorios son validados antes de guardar
- Los campos numéricos se convierten automáticamente
- Los ENUMs se validan contra valores permitidos

### Relaciones (Foreign Keys)
- `equipments.id_cliente` → `clients.id_cliente`
- `ordenes.id_cliente` → `clients.id_cliente`
- `ordenes.id_equipo` → `equipments.id_equipo`
- `ordenes.id_usuario` → `usuarios.id_usuario`
- `repuestos.id_proveedor` → `proveedores.id_proveedor`

---

## 🐛 Solución de Problemas

### Error de conexión a Firebase
- Verificar credenciales en `.env`
- Verificar que Firestore esté habilitado en Firebase Console
- Verificar que las colecciones estén creadas

### Error 401 Unauthorized
- Verificar que el token JWT sea válido
- Verificar que el header Authorization esté bien formado
- Verificar que el token no haya expirado (1 hora de validez)

### Error 403 Forbidden
- El endpoint requiere autenticación y no se proporcionó token
- El token es inválido o está expirado

### Error 404 Not Found
- Verificar que la URL sea correcta
- Verificar que el recurso exista en la base de datos
- Verificar que el ID sea correcto

### Error 400 Bad Request
- Verificar que los campos obligatorios se hayan proporcionado
- Verificar que los datos tengan el formato correcto
- Revisar los mensajes de error de validación

---

## 👥 Roles de Usuario

- **admin**: Acceso completo a todos los endpoints
- **tecnico**: Acceso para gestionar órdenes y equipos
- **recepcionista**: Acceso para gestionar clientes y órdenes

---

## 📚 Documentación Adicional

- [API_EXAMPLES.md](./API_EXAMPLES.md) - Ejemplos completos de todas las peticiones
- [GUÍA DE MIGRACIÓN.md](./GUÍA DE MIGRACIÓN.md) - Guía de migración de Products a Equipments

---

## 👤 Autor

**JCL** - Proyecto 4 - Sistema de Gestión de Taller

## 📄 Licencia

MIT