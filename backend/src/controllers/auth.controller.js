import jwt from "jsonwebtoken";
import * as usuariosModel from "../models/usuarios.model.js";

// ========================================================
// LOGIN - Autentica usuario por email/usuario y password
// ========================================================

export const login = async (req, res) => {
    try {
        const { email, usuario, password } = req.body;

        // Validar que se proporcionó al menos email O usuario, y password
        if ((!email && !usuario) || !password) {
            return res.status(400).json({ 
                error: 'Email o usuario y password son requeridos' 
            });
        }

        let usuarioData = null;

        // Si se proporciona email, buscar por email
        if (email) {
            const usuarios = await usuariosModel.getAllUsuarios();
            usuarioData = usuarios.find(u => u.email === email);
        }

        // Si se proporciona usuario, buscar por usuario
        // (Si ya se encontró por email, no se ejecuta)
        if (!usuarioData && usuario) {
            usuarioData = await usuariosModel.getUsuarioByUsername(usuario);
        }

        // Si no existe el usuario, retornar error
        if (!usuarioData) {
            return res.status(401).json({ 
                error: 'Email o usuario incorrectos' 
            });
        }

        // Verificar que la contraseña sea correcta usando bcrypt
        const isPasswordValid = await usuariosModel.comparePasswords(
            password, 
            usuarioData.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({ 
                error: 'contraseña incorrecta' 
            });
        }

        // Verificar que el usuario esté activo
        if (!usuarioData.estado) {
            return res.status(403).json({ 
                error: 'Usuario inactivo' 
            });
        }

        // Crear el payload del JWT con la información del usuario
        const payload = {
            user: {
                id_usuario: usuarioData.id_usuario,
                nombre: usuarioData.nombre,
                email: usuarioData.email,
                usuario: usuarioData.usuario,
                rol: usuarioData.rol
            }
        };

        // Configurar expiración del token (24 horas)
        const expiration = { expiresIn: "24h" };

        // Firmar el JWT con la clave secreta de .env
        const token = jwt.sign(payload, process.env.JWT_secret, expiration);

        // Retornar el token al cliente
        res.json({ 
            message: 'Login exitoso',
            token,
            usuario: {
                id_usuario: usuarioData.id_usuario,
                nombre: usuarioData.nombre,
                email: usuarioData.email,
                usuario: usuarioData.usuario,
                rol: usuarioData.rol
            }
        });

    } catch (error) {
        console.error('login error:', error);
        return res.status(500).json({ 
            error: 'Error interno al iniciar sesión' 
        });
    }
};

// ========================================================
// GET CURRENT USER - Obtiene datos del usuario actual
// ========================================================

export const getCurrentUser = (req, res) => {
    try {
        // El middleware de autenticación ya verificó el token
        // y agregó la información del usuario en req.user
        res.json({ 
            usuario: req.user.user || req.user 
        });
    } catch (error) {
        console.error('getCurrentUser error:', error);
        return res.status(500).json({ 
            error: 'Error al obtener usuario actual' 
        });
    }
};