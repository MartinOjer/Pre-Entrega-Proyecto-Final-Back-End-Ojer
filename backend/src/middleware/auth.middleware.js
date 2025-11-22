import jwt from "jsonwebtoken";

// ========================================================
// MIDDLEWARE DE AUTENTICACIÓN
// Verifica que el usuario tenga un token JWT válido
// ========================================================

export const auth = (req, res, next) => {
    try {
        console.log("Verificando autenticación...");
        console.log("Headers:", req.headers);

        // Obtener el token del header Authorization
        // Formato esperado: "Bearer <token>"
        const token = req.headers["authorization"]?.split(" ")[1];

        // Si no hay token, retornar 401 (Unauthorized)
        if (!token) {
            return res.status(401).json({ 
                error: 'Token no proporcionado' 
            });
        }

        // Verificar que el token sea válido
        jwt.verify(token, process.env.JWT_secret, (err, decoded) => {
            if (err) {
                console.error("Error al verificar token:", err.message);
                return res.status(403).json({ 
                    error: 'Token inválido o expirado' 
                });
            }

            // Si el token es válido, guardar la información del usuario en req.user
            // Esto incluye: id_usuario, nombre, email, rol
            req.user = decoded.user;

            console.log("✅ Autenticación exitosa para usuario:", req.user.nombre);
            console.log("   Rol:", req.user.rol);

            // Continuar con la siguiente ruta/middleware
            next();
        });

    } catch (error) {
        console.error('auth error:', error);
        return res.status(500).json({ 
            error: 'Error en autenticación' 
        });
    }
};

// ========================================================
// MIDDLEWARE DE AUTORIZACIÓN POR ROL - ADMIN
// Solo usuarios con rol 'admin' pueden acceder
// ========================================================

export const requireAdmin = (req, res, next) => {
    // req.user viene del middleware de autenticación anterior
    if (!req.user || req.user.rol !== 'admin') {
        return res.status(403).json({ 
            error: 'Solo administradores pueden acceder a este recurso',
            rolActual: req.user?.rol
        });
    }

    // Si es admin, continuar
    next();
};

// ========================================================
// MIDDLEWARE DE AUTORIZACIÓN POR ROL - TÉCNICO
// Solo usuarios con rol 'tecnico' o 'admin' pueden acceder
// ========================================================

export const requireTecnico = (req, res, next) => {
    if (!req.user || !['tecnico', 'admin'].includes(req.user.rol)) {
        return res.status(403).json({ 
            error: 'Se requiere rol técnico o administrador',
            rolActual: req.user?.rol
        });
    }

    // Si es técnico o admin, continuar
    next();
};

// ========================================================
// MIDDLEWARE DE AUTORIZACIÓN POR ROL - RECEPCIONISTA
// Solo usuarios con rol 'recepcionista' o 'admin' pueden acceder
// ========================================================

export const requireRecepcionista = (req, res, next) => {
    if (!req.user || !['recepcionista', 'admin'].includes(req.user.rol)) {
        return res.status(403).json({ 
            error: 'Se requiere rol recepcionista o administrador',
            rolActual: req.user?.rol
        });
    }

    // Si es recepcionista o admin, continuar
    next();
};