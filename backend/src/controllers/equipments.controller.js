import * as service from "../service/equipments.service.js";
import * as model from "../models/equipments.model.js";

/////////////////////////////////////////////////////////////

export const getAllEquipments = async (req, res) => { 
    res.json(await model.getAllEquipments());
};

/////////////////////////////////////////////////////////////

export const searchEquipment = async (req, res) => {
    // Obtengo el parámetro 'query' desde los query params
    const { query } = req.query;

    // Si no viene el query param 'query' devolvemos un 400 Bad Request
    if (!query || typeof query !== 'string' || query.trim() === '') {
        return res.status(400).json({ error: 'Se requiere el query param << query >>' });
    }

    try {
        // getAllEquipments es async – debemos esperar la promesa
        const equipments = await model.getAllEquipments();

        // Si por alguna razón no recibimos un array, defensivamente respondemos con 500
        if (!Array.isArray(equipments)) {
            return res.status(500).json({ error: 'Error interno al obtener equipos' });
        }

        // Filtramos los equipos por tipo_equipo, marca, modelo o nro_serie (case-insensitive)
        const filteredEquipments = equipments.filter((equipment) =>
            (typeof equipment.tipo_equipo === 'string' && 
             equipment.tipo_equipo.toLowerCase().includes(query.toLowerCase())) ||
            (typeof equipment.marca === 'string' && 
             equipment.marca.toLowerCase().includes(query.toLowerCase())) ||
            (typeof equipment.modelo === 'string' && 
             equipment.modelo.toLowerCase().includes(query.toLowerCase())) ||
            (typeof equipment.nro_serie === 'string' && 
             equipment.nro_serie.toLowerCase().includes(query.toLowerCase()))
        );

        console.log('searchEquipment - query:', req.query);

        // Respondo con los equipos filtrados
        if (!equipments || filteredEquipments.length === 0) {
            return res.status(404).json({ error: 'Equipo no encontrado' });
        } else {
            return res.json(service.formatEquipmentOutput(filteredEquipments));
        }

    } catch (error) {
        console.error('searchEquipment error:', error);
        return res.status(500).json({ error: 'Error interno al buscar equipos' });
    }
};

/////////////////////////////////////////////////////////////

export const getEquipmentById = async (req, res) => {
    const { id } = req.params;

    try {
        const equipment = await model.getEquipmentById(id);

        console.log('getEquipmentById - result:', equipment);
        if (!equipment) {
            return res.status(404).json({ error: 'Equipo no encontrado' });
        }

        return res.json(equipment);

    } catch (error) {
        console.error('getEquipmentById error:', error);
        return res.status(500).json({ error: 'Error interno al obtener equipo' });
    }
};

/////////////////////////////////////////////////////////////

// Nuevo controlador: Obtiene todos los equipos de un cliente específico
export const getEquipmentsByClient = async (req, res) => {
    const { id_cliente } = req.params;

    try {
        const equipments = await model.getEquipmentsByClient(id_cliente);

        if (!equipments || equipments.length === 0) {
            return res.status(404).json({ error: 'No se encontraron equipos para este cliente' });
        }

        return res.json(equipments);

    } catch (error) {
        console.error('getEquipmentsByClient error:', error);
        return res.status(500).json({ error: 'Error interno al obtener equipos del cliente' });
    }
};

/////////////////////////////////////////////////////////////

// Controlador que maneja la creación de un nuevo equipo
export const createEquipment = async (req, res) => {
    // Llamo a la función de validación del servicio
    const {valid, errors} = service.validateEquipmentData(req.body);

    // Si la validación no es correcta (valid = false)
    if (!valid) {
        return res.status(400).json({ errors });
    }

    // Extraigo los campos esperados del body del request
    const { id_cliente, tipo_equipo, marca, modelo, nro_serie, observaciones } = req.body;

    try {
        // Llamo al modelo para crear el equipo en Firestore
        const newEquipment = await model.createEquipment({ 
            id_cliente, 
            tipo_equipo, 
            marca, 
            modelo, 
            nro_serie, 
            observaciones 
        });

        // Si todo sale bien, devuelvo una respuesta 201 (Created) con el nuevo equipo
        return res.status(201).json(newEquipment);

    } catch (error) {
        console.error('createEquipment error:', error);
        return res.status(500).json({ error: 'Error interno al crear equipo' });
    }
};

///////////////////////////////////////////////////////////////

export const updateEquipment = async (req, res) => {
    const { id } = req.params;
    const equipmentData = req.body;

    console.log('Controller -> updateEquipment - id:', id, 'data:', equipmentData);

    // Validaciones básicas
    if (!id) {
        return res.status(400).json({ error: 'Controller -> Se requiere el id del equipo en la ruta' });
    }
    if (!equipmentData || typeof equipmentData !== 'object' || Array.isArray(equipmentData)) {
        return res.status(400).json({ error: 'Controller -> Se requiere un body con los datos a actualizar' });
    }

    try {
        // Llamo al modelo para actualizar (retorna false si no existe)
        const updated = await model.updateEquipment(id, equipmentData);

        // Si no existe el equipo, devuelvo 404
        if (!updated) {
            return res.status(404).json({ error: 'Controller -> Equipo NO encontrado !!!!' });
        }

        // Si se actualizó correctamente, devuelvo el equipo actualizado
        return res.status(200).json(updated);

    } catch (error) {
        console.error('Controller -> updateEquipment error:', error);
        return res.status(500).json({ error: 'Controller -> Error interno al actualizar equipo' });
    }
};

///////////////////////////////////////////////////////////////

export const deleteEquipment = async (req, res) => {
    const { id } = req.params;
    console.log('Controller - deleteEquipment - id:', id);

    try {
        // Llamo al modelo para eliminar el equipo
        const deleted = await model.deleteEquipment(id);

        // Si deleteEquipment devolvió false, el equipo no existía
        if (!deleted) {
            return res.status(404).json({ error: 'Equipo NO encontrado' });
        } else {
            return res.status(200).json(deleted);
        }

    } catch (error) {
        console.error('deleteEquipment error:', error);
        return res.status(500).json({ error: 'Error interno al eliminar equipo' });
    }
};

/////////////////////////////////////////////////////////////