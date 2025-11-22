import * as service from "../service/repuestos.service.js";
import * as model from "../models/repuestos.model.js";

/////////////////////////////////////////////////////////////

export const getAllRepuestos = async (req, res) => { 
    const repuestos = await model.getAllRepuestos();
    res.json(service.formatRepuestoOutput(repuestos));
};

/////////////////////////////////////////////////////////////

export const searchRepuesto = async (req, res) => {
    const { query } = req.query;

    if (!query || typeof query !== 'string' || query.trim() === '') {
        return res.status(400).json({ error: 'Se requiere el query param << query >>' });
    }

    try {
        const repuestos = await model.getAllRepuestos();

        if (!Array.isArray(repuestos)) {
            return res.status(500).json({ error: 'Error interno al obtener repuestos' });
        }

        const filteredRepuestos = repuestos.filter((repuesto) =>
            (typeof repuesto.nombre === 'string' && 
             repuesto.nombre.toLowerCase().includes(query.toLowerCase())) ||
            (typeof repuesto.codigo === 'string' && 
             repuesto.codigo.toLowerCase().includes(query.toLowerCase())) ||
            (typeof repuesto.marca === 'string' && 
             repuesto.marca.toLowerCase().includes(query.toLowerCase()))
        );

        if (filteredRepuestos.length === 0) {
            return res.status(404).json({ error: 'Repuesto no encontrado' });
        }

        return res.json(service.formatRepuestoOutput(filteredRepuestos));

    } catch (error) {
        console.error('searchRepuesto error:', error);
        return res.status(500).json({ error: 'Error interno al buscar repuestos' });
    }
};

/////////////////////////////////////////////////////////////

export const getRepuestoById = async (req, res) => {
    const { id } = req.params;

    try {
        const repuesto = await model.getRepuestoById(id);

        if (!repuesto) {
            return res.status(404).json({ error: 'Repuesto no encontrado' });
        }

        return res.json(service.formatRepuestoOutput(repuesto));

    } catch (error) {
        console.error('getRepuestoById error:', error);
        return res.status(500).json({ error: 'Error interno al obtener repuesto' });
    }
};

/////////////////////////////////////////////////////////////

export const getRepuestosByProveedor = async (req, res) => {
    const { id_proveedor } = req.params;

    try {
        const repuestos = await model.getRepuestosByProveedor(id_proveedor);

        if (!repuestos || repuestos.length === 0) {
            return res.status(404).json({ error: 'No se encontraron repuestos para este proveedor' });
        }

        return res.json(service.formatRepuestoOutput(repuestos));

    } catch (error) {
        console.error('getRepuestosByProveedor error:', error);
        return res.status(500).json({ error: 'Error interno al obtener repuestos del proveedor' });
    }
};

/////////////////////////////////////////////////////////////

export const createRepuesto = async (req, res) => {
    const {valid, errors} = service.validateRepuestoData(req.body);

    if (!valid) {
        return res.status(400).json({ errors });
    }

    try {
        const newRepuesto = await model.createRepuesto(req.body);
        return res.status(201).json(newRepuesto);

    } catch (error) {
        console.error('createRepuesto error:', error);
        return res.status(500).json({ error: 'Error interno al crear repuesto' });
    }
};

///////////////////////////////////////////////////////////////

export const updateRepuesto = async (req, res) => {
    const { id } = req.params;
    const repuestoData = req.body;

    if (!id) {
        return res.status(400).json({ error: 'Se requiere el id del repuesto en la ruta' });
    }
    
    if (!repuestoData || typeof repuestoData !== 'object' || Array.isArray(repuestoData)) {
        return res.status(400).json({ error: 'Se requiere un body con los datos a actualizar' });
    }

    try {
        const updated = await model.updateRepuesto(id, repuestoData);

        if (!updated) {
            return res.status(404).json({ error: 'Repuesto NO encontrado' });
        }

        return res.status(200).json(updated);

    } catch (error) {
        console.error('updateRepuesto error:', error);
        return res.status(500).json({ error: 'Error interno al actualizar repuesto' });
    }
};

///////////////////////////////////////////////////////////////

export const deleteRepuesto = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await model.deleteRepuesto(id);

        if (!deleted || !deleted.deleted) {
            return res.status(404).json({ error: 'Repuesto NO encontrado' });
        }

        return res.status(200).json(deleted);

    } catch (error) {
        console.error('deleteRepuesto error:', error);
        return res.status(500).json({ error: 'Error interno al eliminar repuesto' });
    }
};

/////////////////////////////////////////////////////////////