import * as service from "../service/usuarios.service.js";
import * as model from "../models/usuarios.model.js";

/////////////////////////////////////////////////////////////

export const getAllUsuarios = async (req, res) => { 
    const usuarios = await model.getAllUsuarios();
    res.json(service.formatUsuarioOutput(usuarios));
};

/////////////////////////////////////////////////////////////

export const searchUsuario = async (req, res) => {
    const { query } = req.query;

    if (!query || typeof query !== 'string' || query.trim() === '') {
        return res.status(400).json({ error: 'Se requiere el query param << query >>' });
    }

    try {
        const usuarios = await model.getAllUsuarios();

        if (!Array.isArray(usuarios)) {
            return res.status(500).json({ error: 'Error interno al obtener usuarios' });
        }

        const filteredUsuarios = usuarios.filter((usuario) =>
            (typeof usuario.nombre === 'string' && 
             usuario.nombre.toLowerCase().includes(query.toLowerCase())) ||
            (typeof usuario.email === 'string' && 
             usuario.email.toLowerCase().includes(query.toLowerCase())) ||
            (typeof usuario.usuario === 'string' && 
             usuario.usuario.toLowerCase().includes(query.toLowerCase())) ||
            (typeof usuario.rol === 'string' && 
             usuario.rol.toLowerCase().includes(query.toLowerCase()))
        );

        if (filteredUsuarios.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        return res.json(service.formatUsuarioOutput(filteredUsuarios));

    } catch (error) {
        console.error('searchUsuario error:', error);
        return res.status(500).json({ error: 'Error interno al buscar usuarios' });
    }
};

/////////////////////////////////////////////////////////////

export const getUsuarioById = async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await model.getUsuarioById(id);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        return res.json(service.formatUsuarioOutput(usuario));

    } catch (error) {
        console.error('getUsuarioById error:', error);
        return res.status(500).json({ error: 'Error interno al obtener usuario' });
    }
};

/////////////////////////////////////////////////////////////

export const createUsuario = async (req, res) => {
    const {valid, errors} = service.validateUsuarioData(req.body);

    if (!valid) {
        return res.status(400).json({ errors });
    }

    const { nombre, email, telefono, rol, usuario, password, estado } = req.body;

    try {
        const newUsuario = await model.createUsuario({ 
            nombre, 
            email, 
            telefono, 
            rol, 
            usuario, 
            password,
            estado
        });

        return res.status(201).json(newUsuario);

    } catch (error) {
        console.error('createUsuario error:', error);
        return res.status(500).json({ error: error.message || 'Error interno al crear usuario' });
    }
};

///////////////////////////////////////////////////////////////

export const updateUsuario = async (req, res) => {
    const { id } = req.params;
    const usuarioData = req.body;

    if (!id) {
        return res.status(400).json({ error: 'Se requiere el id del usuario en la ruta' });
    }
    
    if (!usuarioData || typeof usuarioData !== 'object' || Array.isArray(usuarioData)) {
        return res.status(400).json({ error: 'Se requiere un body con los datos a actualizar' });
    }

    try {
        const updated = await model.updateUsuario(id, usuarioData);

        if (!updated) {
            return res.status(404).json({ error: 'Usuario NO encontrado' });
        }

        return res.status(200).json(updated);

    } catch (error) {
        console.error('updateUsuario error:', error);
        return res.status(500).json({ error: error.message || 'Error interno al actualizar usuario' });
    }
};

///////////////////////////////////////////////////////////////

export const deleteUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await model.deleteUsuario(id);

        if (!deleted || !deleted.deleted) {
            return res.status(404).json({ error: 'Usuario NO encontrado' });
        }

        return res.status(200).json(deleted);

    } catch (error) {
        console.error('deleteUsuario error:', error);
        return res.status(500).json({ error: 'Error interno al eliminar usuario' });
    }
};
