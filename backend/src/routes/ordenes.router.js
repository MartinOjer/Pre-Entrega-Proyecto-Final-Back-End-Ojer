import { Router } from 'express';
import * as controller from '../controllers/ordenes.controller.js';
import { auth, requireTecnico, requireRecepcionista, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// ========================================================
// LECTURA DE ÓRDENES - Todos los autenticados
// ========================================================

// Obtener todas las órdenes
// GET /api/ordenes
router.get('/', auth, controller.getAllOrdenes);

// Buscar órdenes
// GET /api/ordenes/search?query=pantalla
router.get('/search', auth, controller.searchOrden);

// Obtener órdenes por cliente
// GET /api/ordenes/cliente/1
router.get('/cliente/:id_cliente', auth, controller.getOrdenesByCliente);

// Obtener órdenes por equipo
// GET /api/ordenes/equipo/1
router.get('/equipo/:id_equipo', auth, controller.getOrdenesByEquipo);

// Obtener órdenes asignadas a un técnico
// GET /api/ordenes/tecnico/1
router.get('/tecnico/:id_usuario', auth, controller.getOrdenesByTecnico);

// Obtener una orden específica
// GET /api/ordenes/1
router.get('/:id', auth, controller.getOrdenById);

// ========================================================
// CREAR ÓRDENES - Recepcionista o Admin
// ========================================================

// Crear nueva orden
// POST /api/ordenes
// Solo recepcionistas y admins pueden crear órdenes
router.post('/', auth, requireRecepcionista, controller.createOrden);

// ========================================================
// ACTUALIZAR ÓRDENES - Técnico o Admin
// ========================================================

// Actualizar una orden (cambiar estado, diagnostico, trabajo realizado)
// PUT /api/ordenes/1
// Solo técnicos y admins pueden actualizar órdenes
// (los técnicos son quienes realizan el trabajo)
router.put('/:id', auth, requireTecnico, controller.updateOrden);

// ========================================================
// ELIMINAR ÓRDENES - Solo Admin
// ========================================================

// Eliminar una orden
// DELETE /api/ordenes/1
// Solo admins pueden eliminar órdenes
router.delete('/:id', auth, requireAdmin, controller.deleteOrden);

export default router;