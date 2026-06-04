//=======================================================
// index.js – Punto de entrada principal del servidor
//=======================================================

// Importa el módulo Express para crear el servidor HTTP
import express from 'express';

// Importa CORS para permitir solicitudes desde diferentes orígenes
// (ej: frontend en React desde otro dominio)
import cors from 'cors';

// Importa y carga las variables de entorno del archivo .env
// Permite acceder a PORT, JWT_secret, credenciales de Firebase, etc.
import 'dotenv/config';

//=======================================================
// CREAR LA APLICACIÓN EXPRESS
//=======================================================

// Crea una instancia del servidor Express
// Este objeto "app" es el servidor principal que escuchará peticiones
const app = express();

//=======================================================
// MOSTRAR CONFIGURACIÓN EN CONSOLA
//=======================================================

// Imprime el puerto que se está usando (de .env o valor por defecto)
console.log("=> PORT:", process.env.PORT);

// Imprime el ambiente (development, production, etc.)
console.log("=> NODE_ENV:", process.env.NODE_ENV);

// Define el puerto donde corre el servidor
// Si existe PORT en .env lo usa, si no usa el puerto 3001 por defecto
const PORT = process.env.PORT || 3001;

//=======================================================
// MIDDLEWARES GLOBALES
//=======================================================

// Middleware CORS: Permite que aplicaciones de otros dominios 
// accedan a nuestra API (importante para frontends en React, Vue, etc.)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Middleware JSON: Permite que Express entienda y procese 
// datos en formato JSON que llegan en el body de las peticiones
// Sin esto, req.body sería undefined en POST y PUT
app.use(express.json());

//=======================================================
// MIDDLEWARE DE REGISTRO GENERAL (LOGGING)
//=======================================================

// Este middleware se ejecuta ANTES que cualquier ruta
// Registra (en consola) información de cada petición HTTP que llega
app.use((req, res, next) => {
  // Obtiene la fecha y hora actual en formato ISO
  const timestamp = new Date().toISOString();
  
  // Imprime un separador visual en la consola
  console.log("\n========= NUEVA PETICIÓN =========");
  
  // Muestra la fecha de la petición
  console.log("=> Fecha:", timestamp);
  
  // Muestra el método HTTP (GET, POST, PUT, DELETE, etc.)
  console.log("=> Método:", req.method);
  
  // Muestra la URL completa que se solicitó
  console.log("=> URL original:", req.originalUrl);
  
  // Muestra el tipo de contenido (application/json, text/html, etc.)
  console.log("=> content-type:", req.headers['content-type'] || 'No especificado');
  
  // Separador visual
  console.log("==================================\n");
  
  // Llama a next() para continuar con la siguiente ruta o middleware
  // Si no llamamos a next(), la petición se queda "colgada"
  next();
});

//=======================================================
// RUTA RAÍZ DE PRUEBA
//=======================================================

// Esta es una ruta GET simple para verificar que el servidor funciona
// Si accedes a http://localhost:3000/ recibirás este JSON
app.get('/', (req, res) => {
  res.json({ 
    mensaje: 'API REST - Sistema de Gestión de Taller - Node.js funcionando correctamente' 
  });
});

//=======================================================
// IMPORTACIÓN Y REGISTRO DE RUTAS
//=======================================================

// ===== AUTENTICACIÓN =====
// Importa el router de autenticación desde su archivo
// Este router contiene la ruta POST /login
// NOTA: Las rutas son relativas al directorio src/ (donde está este archivo)
import authRouter from './routes/auth.router.js';

// Registra el router de autenticación con el prefijo /api/auth
// Todas las rutas dentro de authRouter comenzarán con /api/auth
// Ejemplo: POST /api/auth/login
app.use('/api/auth', authRouter);

// ===== CLIENTES =====
// Importa el router de clientes
// Contiene rutas para CRUD de clientes
import clientsRouter from './routes/clients.router.js';

// Registra las rutas de clientes con prefijo /api/clients
// Ejemplo: GET /api/clients, POST /api/clients, etc.
app.use('/api/clients', clientsRouter);

// ===== EQUIPOS =====
// Importa el router de equipos
// Contiene rutas para CRUD de equipos del taller
import equipmentsRouter from './routes/equipments.router.js';

// Registra las rutas de equipos con prefijo /api/equipments
// Ejemplo: GET /api/equipments, POST /api/equipments, etc.
app.use('/api/equipments', equipmentsRouter);

// ===== USUARIOS =====
// Importa el router de usuarios
// Contiene rutas para CRUD de usuarios del sistema
import usuariosRouter from './routes/usuarios.router.js';

// Registra las rutas de usuarios con prefijo /api/usuarios
// Ejemplo: GET /api/usuarios, POST /api/usuarios, etc.
app.use('/api/usuarios', usuariosRouter);

// ===== ÓRDENES =====
// Importa el router de órdenes
// Contiene rutas para CRUD de órdenes de reparación
import ordenesRouter from './routes/ordenes.router.js';

// Registra las rutas de órdenes con prefijo /api/ordenes
// Ejemplo: GET /api/ordenes, POST /api/ordenes, etc.
app.use('/api/ordenes', ordenesRouter);

// ===== REPUESTOS =====
// Importa el router de repuestos
// Contiene rutas para CRUD de repuestos (inventario)
import repuestosRouter from './routes/repuestos.router.js';

// Registra las rutas de repuestos con prefijo /api/repuestos
// Ejemplo: GET /api/repuestos, POST /api/repuestos, etc.
app.use('/api/repuestos', repuestosRouter);

// ===== PROVEEDORES =====
// Importa el router de proveedores
// Contiene rutas para CRUD de proveedores
import proveedoresRouter from './routes/proveedores.router.js';

// Registra las rutas de proveedores con prefijo /api/proveedores
// Ejemplo: GET /api/proveedores, POST /api/proveedores, etc.
app.use('/api/proveedores', proveedoresRouter);

//=======================================================
// RUTAS DE EJEMPLO PARA PRUEBAS
//=======================================================

// Ruta GET simple de prueba
// Accede a http://localhost:3000/saludo para probar
app.get("/saludo", (req, res) => {
  res.json({ mensaje: "*** ¡Hola! Esta ruta funciona correctamente ***" });
});

// Ruta que genera un error intencional para probar el manejo de errores
// Accede a http://localhost:3000/error para probar
app.get("/error", (req, res) => {
  throw new Error("<<< SIM >>> Error simulado en /error <<< SIM >>>");
});

//=======================================================
// MIDDLEWARE - 404 (RUTA NO ENCONTRADA)
//=======================================================

// Este middleware se ejecuta SOLO si ninguna ruta anterior coincidió
// Se usa para manejar solicitudes a rutas que no existen
app.use((req, res, next) => {
  // Responde con estado 404 (Not Found)
  res.status(404).json({
    error: 'MIDDLE: Ruta NO encontrada',
    ruta: req.originalUrl  // Muestra cuál fue la ruta que no encontró
  });
});

//=======================================================
// MIDDLEWARE - MANEJADOR GLOBAL DE ERRORES
//=======================================================

// Este middleware especial captura TODOS los errores que ocurren
// en la aplicación (errores no manejados en rutas)
// Nota: DEBE tener 4 parámetros (err, req, res, next) para ser 
// reconocido por Express como manejador de errores
app.use((err, req, res, next) => {
  // Registra el error en la consola para depuración
  console.log("=> Se capturó un error en el middleware global:");
  console.log("=> Mensaje:", err.message);
  console.log("=> Stack:", err.stack);  // Stack trace (pila de llamadas)

  // Prepara la respuesta de error
  const response = {
    error: '<<< INT >>> Error interno del servidor <<< INT >>>',
    mensaje: err.message,
  };

  // En desarrollo, incluye el stack trace completo para ayudar a debuggear
  // En producción, no se envía para no exponer detalles técnicos
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  // Responde con estado 500 (Internal Server Error)
  res.status(500).json(response);
});

//=======================================================
// INICIO DEL SERVIDOR
//=======================================================

// Inicia el servidor en el puerto definido
// La función callback se ejecuta cuando el servidor está listo
app.listen(PORT, () => {
  // Imprime un mensaje de bienvenida con información del servidor
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║     🔧 SISTEMA DE GESTIÓN DE TALLER - API REST 🔧         ║
║                                                            ║
║  ✅ Servidor iniciado correctamente                        ║
║  🌐 URL: http://localhost:${PORT}                          ║
║                                                            ║
║  🔌 Endpoints disponibles:                                 ║
║                                                            ║
║  🔐 AUTENTICACIÓN:                                         ║
║     • POST   /api/auth/login                              ║
║                                                            ║
║  👥 CLIENTES:                                              ║
║     • GET    /api/clients                                 ║
║     • GET    /api/clients/search?query=...                ║
║     • GET    /api/clients/:id                             ║
║     • POST   /api/clients                                 ║
║     • PUT    /api/clients/:id                             ║
║     • DELETE /api/clients/:id                             ║
║                                                            ║
║  🖥️  EQUIPOS:                                              ║
║     • GET    /api/equipments                              ║
║     • GET    /api/equipments/search?query=...             ║
║     • GET    /api/equipments/client/:id_cliente           ║
║     • GET    /api/equipments/:id                          ║
║     • POST   /api/equipments          [🔒 Auth]            ║
║     • PUT    /api/equipments/:id      [🔒 Auth]            ║
║     • DELETE /api/equipments/:id      [🔒 Auth]            ║
║                                                            ║
║  👤 USUARIOS:                                              ║
║     • GET    /api/usuarios            [🔒 Auth]            ║
║     • GET    /api/usuarios/search     [🔒 Auth]            ║
║     • GET    /api/usuarios/:id        [🔒 Auth]            ║
║     • POST   /api/usuarios            [🔒 Auth]            ║
║     • PUT    /api/usuarios/:id        [🔒 Auth]            ║
║     • DELETE /api/usuarios/:id        [🔒 Auth]            ║
║                                                            ║
║  📋 ÓRDENES:                                               ║
║     • GET    /api/ordenes             [🔒 Auth]            ║
║     • GET    /api/ordenes/search      [🔒 Auth]            ║
║     • GET    /api/ordenes/cliente/:id [🔒 Auth]            ║
║     • GET    /api/ordenes/equipo/:id  [🔒 Auth]            ║
║     • GET    /api/ordenes/tecnico/:id [🔒 Auth]            ║
║     • GET    /api/ordenes/:id         [🔒 Auth]            ║
║     • POST   /api/ordenes             [🔒 Auth]            ║
║     • PUT    /api/ordenes/:id         [🔒 Auth]            ║
║     • DELETE /api/ordenes/:id         [🔒 Auth]            ║
║                                                            ║
║  🔧 REPUESTOS:                                             ║
║     • GET    /api/repuestos           [🔒 Auth]            ║
║     • GET    /api/repuestos/search    [🔒 Auth]            ║
║     • GET    /api/repuestos/proveedor/:id [🔒 Auth]        ║
║     • GET    /api/repuestos/:id       [🔒 Auth]            ║
║     • POST   /api/repuestos           [🔒 Auth]            ║
║     • PUT    /api/repuestos/:id       [🔒 Auth]            ║
║     • DELETE /api/repuestos/:id       [🔒 Auth]            ║
║                                                            ║
║  🏢 PROVEEDORES:                                           ║
║     • GET    /api/proveedores         [🔒 Auth]            ║
║     • GET    /api/proveedores/search  [🔒 Auth]            ║
║     • GET    /api/proveedores/:id     [🔒 Auth]            ║
║     • POST   /api/proveedores         [🔒 Auth]            ║
║     • PUT    /api/proveedores/:id     [🔒 Auth]            ║
║     • DELETE /api/proveedores/:id     [🔒 Auth]            ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
  
  // Este mensaje te indica que el servidor está listo para recibir peticiones
  // Puedes acceder a él en http://localhost:3000 (o el puerto configurado)
});