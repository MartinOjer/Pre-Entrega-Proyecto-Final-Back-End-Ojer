import * as service from "../service/proveedores.service.js";
import * as model from "../models/proveedores.model.js";

/////////////////////////////////////////////////////////////

export const getAllProveedores = async (req, res) => { 
    const proveedores = await model.getAllProveedores();
    res.json(service.formatProveedorOutput(proveedores));
};

/////////////////////////////////////////////////////////////

export const searchProveedor = async (req, res) => {
    const { query } = req.query;

    if (!query || typeof query !== 'string' || query.trim() === '') {
        return res.status(400).json({ error: 'Se requiere el query param << query >>' });
    }

    try {
        const proveedores = await model.getAllProveedores();

        if (!Array.isArray(proveedores)) {
            return res.status(500).json({ error: 'Error interno al obtener proveedores' });
        }

        const filteredProveedores = proveedores.filter((proveedor) =>
            (typeof proveedor.nombre === 'string' && 
             proveedor.nombre.toLowerCase().includes(query.toLowerCase())) ||
            (typeof proveedor.cuit === 'string' && 
             proveedor.cuit.toLowerCase().includes(query.toLowerCase())) ||
            (typeof proveedor.email === 'string' && 
             proveedor.email.toLowerCase().includes(query.toLowerCase()))
        );

        if (filteredProveedores.length === 0) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }

        return res.json(service.formatProveedorOutput(filteredProveedores));

    } catch (error) {
        console.error('searchProveedor error:', error);
        return res.status(500).json({ error: 'Error interno al buscar proveedores' });
    }
};

/////////////////////////////////////////////////////////////

export const getProveedorById = async (req, res) => {
    const { id } = req.params;

    try {
        const proveedor = await model.getProveedorById(id);

        if (!proveedor) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }

        return res.json(service.formatProveedorOutput(proveedor));

    } catch (error) {
        console.error('getProveedorById error:', error);
        return res.status(500).json({ error: 'Error interno al obtener proveedor' });
    }
};

/////////////////////////////////////////////////////////////

export const createProveedor = async (req, res) => {
    const {valid, errors} = service.validateProveedorData(req.body);

    if (!valid) {
        return res.status(400).json({ errors });
    }

    const { nombre, cuit, telefono, email, direccion, condicion_iva } = req.body;

    try {
        const newProveedor = await model.createProveedor({ 
            nombre, 
            cuit, 
            telefono, 
            email, 
            direccion, 
            condicion_iva 
        });

        return res.status(201).json(newProveedor);

    } catch (error) {
        console.error('createProveedor error:', error);
        return res.status(500).json({ error: 'Error interno al crear proveedor' });
    }
};

///////////////////////////////////////////////////////////////

export const updateProveedor = async (req, res) => {
    const { id } = req.params;
    const proveedorData = req.body;

    if (!id) {
        return res.status(400).json({ error: 'Se requiere el id del proveedor en la ruta' });
    }
    
    if (!proveedorData || typeof proveedorData !== 'object' || Array.isArray(proveedorData)) {
        return res.status(400).json({ error: 'Se requiere un body con los datos a actualizar' });
    }

    try {
        const updated = await model.updateProveedor(id, proveedorData);

        if (!updated) {
            return res.status(404).json({ error: 'Proveedor NO encontrado' });
        }

        return res.status(200).json(updated);

    } catch (error) {
        console.error('updateProveedor error:', error);
        return res.status(500).json({ error: 'Error interno al actualizar proveedor' });
    }
};

///////////////////////////////////////////////////////////////

export const deleteProveedor = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await model.deleteProveedor(id);

        if (!deleted || !deleted.deleted) {
            return res.status(404).json({ error: 'Proveedor NO encontrado' });
        }

        return res.status(200).json(deleted);

    } catch (error) {
        console.error('deleteProveedor error:', error);
        return res.status(500).json({ error: 'Error interno al eliminar proveedor' });
    }
};

/////////////////////////////////////////////////////////////