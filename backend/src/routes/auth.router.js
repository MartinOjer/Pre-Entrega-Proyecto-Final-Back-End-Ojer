import { Router } from "express";
import { login, getCurrentUser } from "../controllers/auth.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const router = Router();

// ========================================================
// POST /api/auth/login
// Login del usuario con email y contraseña
// ========================================================
router.post("/login", login);

// ========================================================
// GET /api/auth/me
// Obtener datos del usuario autenticado actualmente
// Requiere token válido
// ========================================================
router.get("/me", auth, getCurrentUser);

export default router;