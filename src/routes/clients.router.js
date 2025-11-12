// ================================
//  MÓDULO DE RUTAS DE CLIENTES
// ================================

import { Router } from 'express';
import * as controller from '../controllers/clients.controller.js';

// Creamos una instancia del enrutador de Express
const router = Router();

/////////////////////////////////////////////////////////////

// ================================
//  DEFINICIÓN DE RUTAS DE CLIENTES
// ================================

/// Rutas GET ///

// Obtener todos los clientes
// GET /api/clients
router.get('/', controller.getAllClients);

// Buscar clientes por nombre, dni_cuit, email o telefono
// Ejemplo: GET /api/clients/search?query=maria
router.get('/search', controller.searchClient);

// Obtener un cliente por su ID
// Ejemplo: GET /api/clients/abc123
router.get('/:id', controller.getClientById);

/// Rutas POST ///

// Crear un nuevo cliente
// POST /api/clients
router.post('/', controller.createClient);

/// Rutas PUT ///

// Actualizar un cliente existente según su ID
// PUT /api/clients/abc123
router.put('/:id', controller.updateClient);

/// Rutas DELETE ///

// Eliminar un cliente por su ID
// DELETE /api/clients/abc123
router.delete('/:id', controller.deleteClient);

// ================================

// Exportamos el enrutador como default
export default router;