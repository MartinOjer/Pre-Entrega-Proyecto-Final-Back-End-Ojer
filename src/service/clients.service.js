// FORMATEO DE CLIENTE DE SALIDA
// Esto asegura consistencia en el formato de respuesta
export const formatClientOutput = (client) => {
    if (!client) return client;
    
    // Si es un array, aplicar formato a cada elemento
    if (Array.isArray(client)) {
        return client.map(item => formatClientOutput(item));
    }
    
    const out = { ...client };
    
    // Asegurar que el tipo_cliente sea válido
    if (out.tipo_cliente && !['particular', 'empresa'].includes(out.tipo_cliente)) {
        out.tipo_cliente = 'particular'; // valor por defecto
    }
    
    return out;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

// VALIDACIÓN DE CLIENTE
export const validateClientData = (data) => {
    const errors = [];

    if (!data) {
        errors.push('No se proporcionó data del cliente');
        return { valid: false, errors };
    }

    // Validación del campo "nombre" (obligatorio)
    if (typeof data.nombre !== 'string' || data.nombre.trim().length < 1) {
        errors.push('El campo "nombre" es obligatorio y debe ser un string no vacío');
    }

    // Validación del campo "dni_cuit" (obligatorio)
    if (typeof data.dni_cuit !== 'string' || data.dni_cuit.trim().length < 1) {
        errors.push('El campo "dni_cuit" es obligatorio y debe ser un string no vacío');
    }

    // Validación del campo "telefono" (obligatorio)
    if (typeof data.telefono !== 'string' || data.telefono.trim().length < 1) {
        errors.push('El campo "telefono" es obligatorio y debe ser un string no vacío');
    }

    // Validación del campo "email" (opcional pero si viene debe tener formato válido)
    if (data.email !== undefined && data.email !== null && data.email !== '') {
        if (typeof data.email !== 'string' || !data.email.includes('@')) {
            errors.push('El campo "email" debe ser un email válido');
        }
    }

    // Validación del campo "direccion" (opcional)
    if (data.direccion !== undefined && data.direccion !== null && data.direccion !== '') {
        if (typeof data.direccion !== 'string') {
            errors.push('El campo "direccion" debe ser un string');
        }
    }

    // Validación del campo "tipo_cliente" (obligatorio: 'particular' o 'empresa')
    if (!data.tipo_cliente || !['particular', 'empresa'].includes(data.tipo_cliente)) {
        errors.push('El campo "tipo_cliente" es obligatorio y debe ser "particular" o "empresa"');
    }

    return { valid: errors.length === 0, errors };
};