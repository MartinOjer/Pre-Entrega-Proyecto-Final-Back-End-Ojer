import { Router } from 'express';
import * as controller from '../controllers/usuarios.controller.js';
import { auth, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// ========================================================
// CRUD DE USUARIOS - Solo ADMIN puede acceder
// ========================================================

// Obtener todos los usuarios - Solo admin
// GET /api/usuarios
router.get('/', auth, requireAdmin, controller.getAllUsuarios);

// Buscar usuarios - Solo admin
// GET /api/usuarios/search?query=juan
router.get('/search', auth, requireAdmin, controller.searchUsuario);

// Obtener usuario por ID - Solo admin (no puede ver su propia info con otro endpoint)
// GET /api/usuarios/1
router.get('/:id', auth, requireAdmin, controller.getUsuarioById);

// Crear nuevo usuario - Solo admin
// POST /api/usuarios
router.post('/', auth, requireAdmin, controller.createUsuario);

// Actualizar usuario - Solo admin
// PUT /api/usuarios/1
router.put('/:id', auth, requireAdmin, controller.updateUsuario);

// Eliminar usuario - Solo admin
// DELETE /api/usuarios/1
router.delete('/:id', auth, requireAdmin, controller.deleteUsuario);

export default router;