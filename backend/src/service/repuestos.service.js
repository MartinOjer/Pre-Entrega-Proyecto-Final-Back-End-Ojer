export const formatRepuestoOutput = (repuesto) => {
    if (!repuesto) return repuesto;
    
    if (Array.isArray(repuesto)) {
        return repuesto.map(item => formatRepuestoOutput(item));
    }
    
    const out = { ...repuesto };
    
    // Convertir valores numéricos
    if (out.stock != null) out.stock = Number(out.stock);
    if (out.precio_compra != null) out.precio_compra = Number(out.precio_compra);
    if (out.precio_venta != null) out.precio_venta = Number(out.precio_venta);
    if (out.id_proveedor != null) out.id_proveedor = Number(out.id_proveedor);
    
    return out;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

export const validateRepuestoData = (data) => {
    const errors = [];

    if (!data) {
        errors.push('No se proporcionó data del repuesto');
        return { valid: false, errors };
    }

    // Validación del campo "nombre" (obligatorio)
    if (typeof data.nombre !== 'string' || data.nombre.trim().length < 1) {
        errors.push('El campo "nombre" es obligatorio y debe ser un string no vacío');
    }

    // Validación del campo "codigo" (obligatorio)
    if (typeof data.codigo !== 'string' || data.codigo.trim().length < 1) {
        errors.push('El campo "codigo" es obligatorio y debe ser un string no vacío');
    }

    // Validación del campo "stock" (opcional, numérico)
    if (data.stock !== undefined && data.stock !== null && data.stock !== '') {
        if (isNaN(Number(data.stock))) {
            errors.push('El campo "stock" debe ser numérico');
        }
    }

    // Validación del campo "precio_compra" (opcional, numérico)
    if (data.precio_compra !== undefined && data.precio_compra !== null && data.precio_compra !== '') {
        if (isNaN(Number(data.precio_compra))) {
            errors.push('El campo "precio_compra" debe ser numérico');
        }
    }

    // Validación del campo "precio_venta" (opcional, numérico)
    if (data.precio_venta !== undefined && data.precio_venta !== null && data.precio_venta !== '') {
        if (isNaN(Number(data.precio_venta))) {
            errors.push('El campo "precio_venta" debe ser numérico');
        }
    }

    // Validación del campo "id_proveedor" (opcional, FK)
    if (data.id_proveedor !== undefined && data.id_proveedor !== null && data.id_proveedor !== '') {
        if (isNaN(Number(data.id_proveedor))) {
            errors.push('El campo "id_proveedor" debe ser numérico');
        }
    }

    // Validación del campo "marca" (opcional)
    if (data.marca !== undefined && data.marca !== null && data.marca !== '') {
        if (typeof data.marca !== 'string') {
            errors.push('El campo "marca" debe ser un string');
        }
    }

    return { valid: errors.length === 0, errors };
};