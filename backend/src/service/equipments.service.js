// FORMATEO DE EQUIPO DE SALIDA
// Esto asegura consistencia en el formato de respuesta
export const formatEquipmentOutput = (equipment) => {
    if (!equipment) return equipment;
    
    // Si es un array, aplicar formato a cada elemento
    if (Array.isArray(equipment)) {
        return equipment.map(item => formatEquipmentOutput(item));
    }
    
    const out = { ...equipment };
    
    // Convertir id_cliente a número si existe
    if (out.id_cliente != null) out.id_cliente = Number(out.id_cliente);
    
    return out;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

// VALIDACIÓN DE EQUIPO
export const validateEquipmentData = (data) => {
    const errors = [];

    if (!data) {
        errors.push('No se proporcionó data del equipo');
        return { valid: false, errors };
    }

    // Validación del campo "id_cliente" (FK - obligatorio)
    if (data.id_cliente == null || isNaN(Number(data.id_cliente))) {
        errors.push('El campo "id_cliente" es obligatorio y debe ser numérico');
    }

    // Validación del campo "tipo_equipo" (obligatorio)
    if (typeof data.tipo_equipo !== 'string' || data.tipo_equipo.trim().length < 1) {
        errors.push('El campo "tipo_equipo" es obligatorio y debe ser un string no vacío (ej: notebook, PC, impresora, celular)');
    }

    // Validación del campo "marca" (obligatorio)
    if (typeof data.marca !== 'string' || data.marca.trim().length < 1) {
        errors.push('El campo "marca" es obligatorio y debe ser un string no vacío');
    }

    // Validación del campo "modelo" (obligatorio)
    if (typeof data.modelo !== 'string' || data.modelo.trim().length < 1) {
        errors.push('El campo "modelo" es obligatorio y debe ser un string no vacío');
    }

    // Validación del campo "nro_serie" (opcional pero si viene debe ser string)
    if (data.nro_serie !== undefined && data.nro_serie !== null && data.nro_serie !== '') {
        if (typeof data.nro_serie !== 'string') {
            errors.push('El campo "nro_serie" debe ser un string');
        }
    }

    // Validación del campo "observaciones" (opcional)
    if (data.observaciones !== undefined && data.observaciones !== null && data.observaciones !== '') {
        if (typeof data.observaciones !== 'string') {
            errors.push('El campo "observaciones" debe ser un string');
        }
    }

    return { valid: errors.length === 0, errors };
};