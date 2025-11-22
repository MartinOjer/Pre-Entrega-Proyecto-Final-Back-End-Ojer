export const formatUsuarioOutput = (usuario) => {
    if (!usuario) return usuario;
    
    if (Array.isArray(usuario)) {
        return usuario.map(item => formatUsuarioOutput(item));
    }
    
    const out = { ...usuario };
    
    // Eliminar password de la salida
    delete out.password;
    
    // Asegurar que el rol sea válido
    if (out.rol && !['admin', 'tecnico', 'recepcionista'].includes(out.rol)) {
        out.rol = 'tecnico';
    }
    
    return out;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

export const validateUsuarioData = (data) => {
    const errors = [];

    if (!data) {
        errors.push('No se proporcionó data del usuario');
        return { valid: false, errors };
    }

    // Validación del campo "nombre" (obligatorio)
    if (typeof data.nombre !== 'string' || data.nombre.trim().length < 1) {
        errors.push('El campo "nombre" es obligatorio y debe ser un string no vacío');
    }

    // Validación del campo "email" (obligatorio con formato)
    if (typeof data.email !== 'string' || !data.email.includes('@')) {
        errors.push('El campo "email" es obligatorio y debe tener formato válido');
    }

    // Validación del campo "rol" (obligatorio)
    if (!data.rol || !['admin', 'tecnico', 'recepcionista'].includes(data.rol)) {
        errors.push('El campo "rol" es obligatorio y debe ser "admin", "tecnico" o "recepcionista"');
    }

    // Validación del campo "usuario" (obligatorio)
    if (typeof data.usuario !== 'string' || data.usuario.trim().length < 3) {
        errors.push('El campo "usuario" es obligatorio y debe tener al menos 3 caracteres');
    }

    // Validación del campo "password" (obligatorio, solo al crear)
    if (data.password !== undefined) {
        if (typeof data.password !== 'string' || data.password.length < 6) {
            errors.push('El campo "password" debe tener al menos 6 caracteres');
        }
    }

    // Validación del campo "telefono" (opcional)
    if (data.telefono !== undefined && data.telefono !== null && data.telefono !== '') {
        if (typeof data.telefono !== 'string') {
            errors.push('El campo "telefono" debe ser un string');
        }
    }

    // Validación del campo "estado" (opcional, boolean)
    if (data.estado !== undefined && typeof data.estado !== 'boolean') {
        errors.push('El campo "estado" debe ser un booleano (true/false)');
    }

    return { valid: errors.length === 0, errors };
};