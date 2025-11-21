import { Router } from 'express';
import * as controller from '../controllers/clients.controller.js';
import { auth, requireRecepcionista } from "../middleware/auth.middleware.js";

const router = Router();

// ========================================================
// LECTURA DE CLIENTES - Solo autenticados
// ========================================================

// Obtener todos los clientes
// GET /api/clients
router.get('/', auth, controller.getAllClients);

// Buscar clientes
// GET /api/clients/search?query=juan
router.get('/search', auth, controller.searchClient);

// Obtener cliente por ID
// GET /api/clients/1
router.get('/:id', auth, controller.getClientById);

// ========================================================
// CREAR/ACTUALIZAR/ELIMINAR CLIENTES - Recepcionista o Admin
// ========================================================

// Crear nuevo cliente
// POST /api/clients
// Recepcionista (y admin) son quienes atienden a los clientes
router.post('/', auth, requireRecepcionista, controller.createClient);

// Actualizar cliente
// PUT /api/clients/1
router.put('/:id', auth, requireRecepcionista, controller.updateClient);

// Eliminar cliente
// DELETE /api/clients/1
router.delete('/:id', auth, requireRecepcionista, controller.deleteClient);

export default router;