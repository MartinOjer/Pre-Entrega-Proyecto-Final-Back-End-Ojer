import * as service from "../service/ordenes.service.js";
import * as model from "../models/ordenes.model.js";

/////////////////////////////////////////////////////////////

export const getAllOrdenes = async (req, res) => { 
    const ordenes = await model.getAllOrdenes();
    res.json(service.formatOrdenOutput(ordenes));
};

/////////////////////////////////////////////////////////////

export const searchOrden = async (req, res) => {
    const { query } = req.query;

    if (!query || typeof query !== 'string' || query.trim() === '') {
        return res.status(400).json({ error: 'Se requiere el query param << query >>' });
    }

    try {
        const ordenes = await model.getAllOrdenes();

        if (!Array.isArray(ordenes)) {
            return res.status(500).json({ error: 'Error interno al obtener órdenes' });
        }

        const filteredOrdenes = ordenes.filter((orden) =>
            (typeof orden.descripcion_falla === 'string' && 
             orden.descripcion_falla.toLowerCase().includes(query.toLowerCase())) ||
            (typeof orden.diagnostico === 'string' && 
             orden.diagnostico.toLowerCase().includes(query.toLowerCase())) ||
            (typeof orden.estado === 'string' && 
             orden.estado.toLowerCase().includes(query.toLowerCase()))
        );

        if (filteredOrdenes.length === 0) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }

        return res.json(service.formatOrdenOutput(filteredOrdenes));

    } catch (error) {
        console.error('searchOrden error:', error);
        return res.status(500).json({ error: 'Error interno al buscar órdenes' });
    }
};

/////////////////////////////////////////////////////////////

export const getOrdenById = async (req, res) => {
    const { id } = req.params;

    try {
        const orden = await model.getOrdenById(id);

        if (!orden) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }

        return res.json(service.formatOrdenOutput(orden));

    } catch (error) {
        console.error('getOrdenById error:', error);
        return res.status(500).json({ error: 'Error interno al obtener orden' });
    }
};

/////////////////////////////////////////////////////////////

export const getOrdenesByCliente = async (req, res) => {
    const { id_cliente } = req.params;

    try {
        const ordenes = await model.getOrdenesByCliente(id_cliente);

        if (!ordenes || ordenes.length === 0) {
            return res.status(404).json({ error: 'No se encontraron órdenes para este cliente' });
        }

        return res.json(service.formatOrdenOutput(ordenes));

    } catch (error) {
        console.error('getOrdenesByCliente error:', error);
        return res.status(500).json({ error: 'Error interno al obtener órdenes del cliente' });
    }
};

/////////////////////////////////////////////////////////////

export const getOrdenesByEquipo = async (req, res) => {
    const { id_equipo } = req.params;

    try {
        const ordenes = await model.getOrdenesByEquipo(id_equipo);

        if (!ordenes || ordenes.length === 0) {
            return res.status(404).json({ error: 'No se encontraron órdenes para este equipo' });
        }

        return res.json(service.formatOrdenOutput(ordenes));

    } catch (error) {
        console.error('getOrdenesByEquipo error:', error);
        return res.status(500).json({ error: 'Error interno al obtener órdenes del equipo' });
    }
};

/////////////////////////////////////////////////////////////

export const getOrdenesByTecnico = async (req, res) => {
    const { id_usuario } = req.params;

    try {
        const ordenes = await model.getOrdenesByTecnico(id_usuario);

        if (!ordenes || ordenes.length === 0) {
            return res.status(404).json({ error: 'No se encontraron órdenes para este técnico' });
        }

        return res.json(service.formatOrdenOutput(ordenes));

    } catch (error) {
        console.error('getOrdenesByTecnico error:', error);
        return res.status(500).json({ error: 'Error interno al obtener órdenes del técnico' });
    }
};

/////////////////////////////////////////////////////////////

export const createOrden = async (req, res) => {
    const {valid, errors} = service.validateOrdenData(req.body);

    if (!valid) {
        return res.status(400).json({ errors });
    }

    try {
        const newOrden = await model.createOrden(req.body);
        return res.status(201).json(newOrden);

    } catch (error) {
        console.error('createOrden error:', error);
        return res.status(500).json({ error: 'Error interno al crear orden' });
    }
};

///////////////////////////////////////////////////////////////

export const updateOrden = async (req, res) => {
    const { id } = req.params;
    const ordenData = req.body;

    if (!id) {
        return res.status(400).json({ error: 'Se requiere el id de la orden en la ruta' });
    }
    
    if (!ordenData || typeof ordenData !== 'object' || Array.isArray(ordenData)) {
        return res.status(400).json({ error: 'Se requiere un body con los datos a actualizar' });
    }

    try {
        const updated = await model.updateOrden(id, ordenData);

        if (!updated) {
            return res.status(404).json({ error: 'Orden NO encontrada' });
        }

        return res.status(200).json(updated);

    } catch (error) {
        console.error('updateOrden error:', error);
        return res.status(500).json({ error: 'Error interno al actualizar orden' });
    }
};

///////////////////////////////////////////////////////////////

export const deleteOrden = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await model.deleteOrden(id);

        if (!deleted || !deleted.deleted) {
            return res.status(404).json({ error: 'Orden NO encontrada' });
        }

        return res.status(200).json(deleted);

    } catch (error) {
        console.error('deleteOrden error:', error);
        return res.status(500).json({ error: 'Error interno al eliminar orden' });
    }
};

/////////////////////////////////////////////////////////////