import * as service from "../service/clients.service.js";
import * as model from "../models/clients.model.js";

/////////////////////////////////////////////////////////////

export const getAllClients = async (req, res) => { 
    res.json(await model.getAllClients());
};

/////////////////////////////////////////////////////////////

export const searchClient = async (req, res) => {
    // Obtengo el parámetro 'query' desde los query params
    const { query } = req.query;

    // Si no viene el query param 'query' devolvemos un 400 Bad Request
    if (!query || typeof query !== 'string' || query.trim() === '') {
        return res.status(400).json({ error: 'Se requiere el query param << query >>' });
    }

    try {
        // getAllClients es async – debemos esperar la promesa
        const clients = await model.getAllClients();

        // Si por alguna razón no recibimos un array, defensivamente respondemos con 500
        if (!Array.isArray(clients)) {
            return res.status(500).json({ error: 'Error interno al obtener clientes' });
        }

        // Filtramos los clientes por nombre, dni_cuit, email o telefono (case-insensitive)
        const filteredClients = clients.filter((client) =>
            (typeof client.nombre === 'string' &&
             client.nombre.toLowerCase().includes(query.toLowerCase())) ||
            (typeof client.dni_cuit === 'string' &&
             client.dni_cuit.toLowerCase().includes(query.toLowerCase())) ||
            (typeof client.email === 'string' &&
             client.email.toLowerCase().includes(query.toLowerCase())) ||
            (typeof client.telefono === 'string' &&
             client.telefono.toLowerCase().includes(query.toLowerCase()))
        );

        console.log('searchClient - query:', req.query);

        // Respondo con los clientes filtrados
        if (!clients || filteredClients.length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        } else {
            return res.json(service.formatClientOutput(filteredClients));
        }

    } catch (error) {
        console.error('searchClient error:', error);
        return res.status(500).json({ error: 'Error interno al buscar clientes' });
    }
};

/////////////////////////////////////////////////////////////

export const getClientById = async (req, res) => {
    const { id } = req.params;

    try {
        const client = await model.getClientById(id);

        console.log('getClientById - result:', client);
        if (!client) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        return res.json(client);

    } catch (error) {
        console.error('getClientById error:', error);
        return res.status(500).json({ error: 'Error interno al obtener cliente' });
    }
};

/////////////////////////////////////////////////////////////

// Controlador que maneja la creación de un nuevo cliente
export const createClient = async (req, res) => {
    // Llamo a la función de validación del servicio
    const {valid, errors} = service.validateClientData(req.body);

    // Si la validación no es correcta (valid = false)
    if (!valid) {
        return res.status(400).json({ errors });
    }

    // Extraigo los campos esperados del body del request
    const { nombre, dni_cuit, telefono, email, direccion, tipo_cliente } = req.body;

    try {
        // Llamo al modelo para crear el cliente en Firestore
        const newClient = await model.createClient({ 
            nombre, 
            dni_cuit, 
            telefono, 
            email, 
            direccion, 
            tipo_cliente 
        });

        // Si todo sale bien, devuelvo una respuesta 201 (Created) con el nuevo cliente
        return res.status(201).json(newClient);

    } catch (error) {
        console.error('createClient error:', error);
        return res.status(500).json({ error: 'Error interno al crear cliente' });
    }
};

///////////////////////////////////////////////////////////////

export const updateClient = async (req, res) => {
    const { id } = req.params;
    const clientData = req.body;

    console.log('Controller -> updateClient - id:', id, 'data:', clientData);

    // Validaciones básicas
    if (!id) {
        return res.status(400).json({ error: 'Controller -> Se requiere el id del cliente en la ruta' });
    }
    if (!clientData || typeof clientData !== 'object' || Array.isArray(clientData)) {
        return res.status(400).json({ error: 'Controller -> Se requiere un body con los datos a actualizar' });
    }

    try {
        // Llamo al modelo para actualizar (retorna false si no existe)
        const updated = await model.updateClient(id, clientData);

        // Si no existe el cliente, devuelvo 404
        if (!updated) {
            return res.status(404).json({ error: 'Controller -> Cliente NO encontrado !!!!' });
        }

        // Si se actualizó correctamente, devuelvo el cliente actualizado
        return res.status(200).json(updated);

    } catch (error) {
        console.error('Controller -> updateClient error:', error);
        return res.status(500).json({ error: 'Controller -> Error interno al actualizar cliente' });
    }
};

///////////////////////////////////////////////////////////////

export const deleteClient = async (req, res) => {
    const { id } = req.params;
    console.log('Controller - deleteClient - id:', id);

    try {
        // Llamo al modelo para eliminar el cliente
        const deleted = await model.deleteClient(id);

        // Si deleteClient devolvió false, el cliente no existía
        if (!deleted) {
            return res.status(404).json({ error: 'Cliente NO encontrado' });
        } else {
            return res.status(200).json(deleted);
        }

    } catch (error) {
        console.error('deleteClient error:', error);
        return res.status(500).json({ error: 'Error interno al eliminar cliente' });
    }
};

/////////////////////////////////////////////////////////////