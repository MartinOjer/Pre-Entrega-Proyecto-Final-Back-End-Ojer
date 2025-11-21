export const formatProveedorOutput = (proveedor) => {
    if (!proveedor) return proveedor;
    
    if (Array.isArray(proveedor)) {
        return proveedor.map(item => formatProveedorOutput(item));
    }
    
    const out = { ...proveedor };
    
    // Asegurar que la condicion_iva sea válida
    const condicionesValidas = ['RI', 'Monotributo', 'Exento'];
    if (out.condicion_iva && !condicionesValidas.includes(out.condicion_iva)) {
        out.condicion_iva = 'Monotributo';
    }
    
    return out;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

export const validateProveedorData = (data) => {
    const errors = [];

    if (!data) {
        errors.push('No se proporcionó data del proveedor');
        return { valid: false, errors };
    }

    // Validación del campo "nombre" (obligatorio)
    if (typeof data.nombre !== 'string' || data.nombre.trim().length < 1) {
        errors.push('El campo "nombre" es obligatorio y debe ser un string no vacío');
    }

    // Validación del campo "cuit" (obligatorio)
    if (typeof data.cuit !== 'string' || data.cuit.trim().length < 1) {
        errors.push('El campo "cuit" es obligatorio y debe ser un string no vacío');
    }

    // Validación del campo "condicion_iva" (obligatorio)
    const condicionesValidas = ['RI', 'Monotributo', 'Exento'];
    if (!data.condicion_iva || !condicionesValidas.includes(data.condicion_iva)) {
        errors.push('El campo "condicion_iva" es obligatorio y debe ser: RI, Monotributo o Exento');
    }

    // Validación del campo "telefono" (opcional)
    if (data.telefono !== undefined && data.telefono !== null && data.telefono !== '') {
        if (typeof data.telefono !== 'string') {
            errors.push('El campo "telefono" debe ser un string');
        }
    }

    // Validación del campo "email" (opcional con formato)
    if (data.email !== undefined && data.email !== null && data.email !== '') {
        if (typeof data.email !== 'string' || !data.email.includes('@')) {
            errors.push('El campo "email" debe tener formato válido');
        }
    }

    // Validación del campo "direccion" (opcional)
    if (data.direccion !== undefined && data.direccion !== null && data.direccion !== '') {
        if (typeof data.direccion !== 'string') {
            errors.push('El campo "direccion" debe ser un string');
        }
    }

    return { valid: errors.length === 0, errors };
};