export const formatOrdenOutput = (orden) => {
    if (!orden) return orden;
    
    if (Array.isArray(orden)) {
        return orden.map(item => formatOrdenOutput(item));
    }
    
    const out = { ...orden };
    
    // Convertir valores numéricos
    if (out.id_cliente != null) out.id_cliente = Number(out.id_cliente);
    if (out.id_equipo != null) out.id_equipo = Number(out.id_equipo);
    if (out.id_usuario != null) out.id_usuario = Number(out.id_usuario);
    if (out.costo_mano_obra != null) out.costo_mano_obra = Number(out.costo_mano_obra);
    
    // Asegurar que el estado sea válido
    const estadosValidos = ['pendiente', 'en_proceso', 'finalizado', 'entregado'];
    if (out.estado && !estadosValidos.includes(out.estado)) {
        out.estado = 'pendiente';
    }
    
    return out;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

export const validateOrdenData = (data) => {
    const errors = [];

    if (!data) {
        errors.push('No se proporcionó data de la orden');
        return { valid: false, errors };
    }

    // Validación del campo "id_cliente" (obligatorio, FK)
    if (data.id_cliente == null || isNaN(Number(data.id_cliente))) {
        errors.push('El campo "id_cliente" es obligatorio y debe ser numérico');
    }

    // Validación del campo "id_equipo" (obligatorio, FK)
    if (data.id_equipo == null || isNaN(Number(data.id_equipo))) {
        errors.push('El campo "id_equipo" es obligatorio y debe ser numérico');
    }

    // Validación del campo "descripcion_falla" (obligatorio)
    if (typeof data.descripcion_falla !== 'string' || data.descripcion_falla.trim().length < 1) {
        errors.push('El campo "descripcion_falla" es obligatorio y debe ser un string no vacío');
    }

    // Validación del campo "id_usuario" (opcional, FK)
    if (data.id_usuario !== undefined && data.id_usuario !== null && data.id_usuario !== '') {
        if (isNaN(Number(data.id_usuario))) {
            errors.push('El campo "id_usuario" debe ser numérico');
        }
    }

    // Validación del campo "costo_mano_obra" (opcional, numérico)
    if (data.costo_mano_obra !== undefined && data.costo_mano_obra !== null && data.costo_mano_obra !== '') {
        if (isNaN(Number(data.costo_mano_obra))) {
            errors.push('El campo "costo_mano_obra" debe ser numérico');
        }
    }

    // Validación del campo "estado" (opcional)
    if (data.estado !== undefined && data.estado !== null && data.estado !== '') {
        const estadosValidos = ['pendiente', 'en_proceso', 'finalizado', 'entregado'];
        if (!estadosValidos.includes(data.estado)) {
            errors.push('El campo "estado" debe ser: pendiente, en_proceso, finalizado o entregado');
        }
    }

    return { valid: errors.length === 0, errors };
};