// ================================
//  MÓDULO DE RUTAS DE EQUIPOS
// ================================

import { Router } from 'express';
import * as controller from '../controllers/equipments.controller.js';
import { auth, requireTecnico, requireAdmin } from "../middleware/auth.middleware.js";

// Creamos una instancia del enrutador de Express
const router = Router();

/////////////////////////////////////////////////////////////

// ================================
//  DEFINICIÓN DE RUTAS DE EQUIPOS
// ================================

/// Rutas GET ///

// Obtener todos los equipos
// GET /api/equipments
router.get('/', auth, controller.getAllEquipments);

// Buscar equipos por query (tipo_equipo, marca, modelo, nro_serie)
// Ejemplo: GET /api/equipments/search?query=notebook
router.get('/search', auth, controller.searchEquipment);

// Obtener equipos de un cliente específico
// Ejemplo: GET /api/equipments/client/5
router.get('/client/:id_cliente', auth, controller.getEquipmentsByClient);

// Obtener un equipo por su ID
// Ejemplo: GET /api/equipments/abc123
router.get('/:id', auth, controller.getEquipmentById);

/// Rutas POST ///

// Crear un nuevo equipo (requiere autenticación)
// POST /api/equipments
router.post('/', auth, requireTecnico, controller.createEquipment);

/// Rutas PUT ///

// Actualizar un equipo existente (requiere autenticación)
// PUT /api/equipments/abc123
router.put('/:id', auth, requireTecnico, controller.updateEquipment);

/// Rutas DELETE ///

// Eliminar un equipo (requiere autenticación)
// DELETE /api/equipments/abc123
router.delete('/:id', auth, requireAdmin, controller.deleteEquipment);

// ================================

// Exportamos el enrutador como default
export default router;