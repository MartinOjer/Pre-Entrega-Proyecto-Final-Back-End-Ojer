import { Router } from 'express';
import * as controller from '../controllers/repuestos.controller.js';
import { auth, requireTecnico, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

/////////////////////////////////////////////////////////////

// Obtener todos los repuestos
router.get('/', auth, controller.getAllRepuestos);

// Buscar repuestos
router.get('/search', auth, controller.searchRepuesto);

// Obtener repuestos por proveedor
router.get('/proveedor/:id_proveedor', auth, controller.getRepuestosByProveedor);

// Obtener repuesto por ID
router.get('/:id', auth, controller.getRepuestoById);

// Crear nuevo repuesto
router.post('/', auth, controller.createRepuesto);

// Actualizar repuesto
router.put('/:id', auth, requireTecnico, controller.updateRepuesto);

// Eliminar repuesto
router.delete('/:id', auth, requireAdmin, controller.deleteRepuesto);

export default router;