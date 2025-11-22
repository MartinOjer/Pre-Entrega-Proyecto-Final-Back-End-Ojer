import { Router } from 'express';
import * as controller from '../controllers/proveedores.controller.js';
import { auth, requireTecnico, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

/////////////////////////////////////////////////////////////

// Obtener todos los proveedores
router.get('/', auth, controller.getAllProveedores);

// Buscar proveedores
router.get('/search', auth, controller.searchProveedor);

// Obtener proveedor por ID
router.get('/:id', auth, controller.getProveedorById);

// Crear nuevo proveedor
router.post('/', auth, requireTecnico, controller.createProveedor);

// Actualizar proveedor
router.put('/:id', auth, requireTecnico, controller.updateProveedor);

// Eliminar proveedor
router.delete('/:id', auth, requireAdmin, controller.deleteProveedor);

export default router;