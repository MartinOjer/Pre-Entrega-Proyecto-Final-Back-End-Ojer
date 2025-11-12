# 🔧 Sistema de Gestión de Taller - API REST

API REST desarrollada con Node.js, Express y Firebase Firestore para la gestión de un taller de reparación de equipos electrónicos.

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

- ✅ Gestión completa de clientes (particulares y empresas)
- ✅ Gestión de equipos del taller con seguimiento
- ✅ Autenticación con JWT
- ✅ Base de datos NoSQL con Firebase Firestore
- ✅ Validación de datos
- ✅ Manejo de errores centralizado
- ✅ CORS habilitado
- ✅ Búsqueda y filtrado de datos

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
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── clients.controller.js
│   │   └── equipments.controller.js
│   ├── models/
│   │   ├── data.js
│   │   ├── clients.model.js
│   │   └── equipments.model.js
│   ├── routes/
│   │   ├── auth.router.js
│   │   ├── clients.router.js
│   │   └── equipments.router.js
│   ├── service/
│   │   ├── clients.service.js
│   │   └── equipments.service.js
│   └── middleware/
│       └── auth.middleware.js
├── .env
├── .gitignore
├── index.js
├── package.json
├── clients.json (datos de ejemplo)
└── equipments.json (datos de ejemplo)
```

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd proyecto-4
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

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

4. **Configurar Firebase Firestore**

- Crear un proyecto en [Firebase Console](https://console.firebase.google.com/)
- Habilitar Firestore Database
- Crear las colecciones: `clients` y `equipments`
- Copiar las credenciales al archivo `.env`

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

### Autenticación

Para acceder a los endpoints protegidos, primero debes autenticarte:

```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "jcl@gmail.com",
  "password": "jcl"
}
```

Respuesta:
```json
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Usar el Token

Para endpoints protegidos, incluye el token en el header:
```bash
Authorization: Bearer <tu-token-jwt>
```

## 🔌 Endpoints

### 🔐 Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Iniciar sesión | No |

### 👥 Clientes

| Método | Endpoint                        | Descripción                | Auth |
|--------|---------------------------------|----------------------------|------|
| GET    | `/api/clients`                  | Obtener todos los clientes | No   |
| GET    | `/api/clients/search?query=...` | Buscar clientes            | No   |
| GET    | `/api/clients/:id`              | Obtener cliente por ID     | No   |
| POST   | `/api/clients`                  | Crear nuevo cliente        | No   |
| PUT    | `/api/clients/:id`              | Actualizar cliente         | No   |
| DELETE | `/api/clients/:id`              | Eliminar cliente           | No   |

### 🖥️ Equipos

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/equipments` | Obtener todos los equipos | No |
| GET | `/api/equipments/search?query=...` | Buscar equipos | No |
| GET | `/api/equipments/client/:id_cliente` | Equipos por cliente | No |
| GET | `/api/equipments/:id` | Obtener equipo por ID | No |
| POST | `/api/equipments` | Crear nuevo equipo | Sí |
| PUT | `/api/equipments/:id` | Actualizar equipo | Sí |
| DELETE | `/api/equipments/:id` | Eliminar equipo | Sí |

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

**Campos:**
- `id_cliente` (INT): Identificador único (autogenerado)
- `nombre` (VARCHAR): Nombre o razón social
- `dni_cuit` (VARCHAR): DNI o CUIT
- `telefono` (VARCHAR): Número de contacto
- `email` (VARCHAR): Correo electrónico
- `direccion` (VARCHAR): Domicilio
- `tipo_cliente` (ENUM): "particular" o "empresa"
- `fecha_registro` (DATE): Fecha de alta (automática)

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

**Campos:**
- `id_equipo` (INT): Identificador único (autogenerado)
- `id_cliente` (INT): ID del cliente propietario
- `tipo_equipo` (VARCHAR): notebook, PC, impresora, celular, etc.
- `marca` (VARCHAR): Marca del equipo
- `modelo` (VARCHAR): Modelo o serie
- `nro_serie` (VARCHAR): Número de serie físico
- `observaciones` (TEXT): Detalles del estado
- `fecha_ingreso` (DATE): Fecha de ingreso (automática)

## 🧪 Ejemplos de Uso

### Crear un cliente

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

### Crear un equipo (requiere autenticación)

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

### Buscar equipos

```bash
GET http://localhost:3000/api/equipments/search?query=notebook
```

### Obtener equipos de un cliente

```bash
GET http://localhost:3000/api/equipments/client/1
```

## 🔒 Seguridad

- JWT para autenticación
- Variables de entorno para credenciales
- Validación de datos en controllers
- Middleware de autenticación para rutas protegidas
- `.gitignore` configurado para proteger información sensible

## 📝 Notas Importantes

1. **Fecha automática**: Los campos `fecha_registro` y `fecha_ingreso` se generan automáticamente
2. **Validaciones**: Todos los campos obligatorios son validados antes de guardar
3. **Búsqueda flexible**: La búsqueda no distingue mayúsculas/minúsculas
4. **IDs**: Firestore genera IDs únicos automáticamente

## 🐛 Solución de Problemas

### Error de conexión a Firebase
- Verificar credenciales en `.env`
- Verificar que Firestore esté habilitado en Firebase Console

### Error 401 Unauthorized
- Verificar que el token JWT sea válido
- Verificar que el header Authorization esté bien formado

### Error 404 Not Found
- Verificar que la URL sea correcta
- Verificar que el recurso exista en la base de datos

## 👥 Autor

JCL - Proyecto 4

## 📄 Licencia

MIT