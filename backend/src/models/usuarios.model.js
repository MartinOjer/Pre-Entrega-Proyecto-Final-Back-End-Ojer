import { db } from './data.js';
import { collection, getDocs, doc, getDoc, deleteDoc, updateDoc, setDoc } from "firebase/firestore";
import bcrypt from 'bcrypt';

const usuariosCollection = collection(db, "usuarios");
const counterDoc = doc(db, "counters", "usuarios");
const SALT_ROUNDS = 10;

/////////////////////////////////////////////////////////////////

const getNextUsuarioId = async () => {
    try {
        const snapshot = await getDoc(counterDoc);
        
        if (!snapshot.exists()) {
            await setDoc(counterDoc, { lastId: 1 });
            return 1;
        }
        
        const currentId = snapshot.data().lastId;
        const nextId = currentId + 1;
        await updateDoc(counterDoc, { lastId: nextId });
        
        return nextId;
    } catch (error) {
        console.error('getNextUsuarioId error:', error);
        throw new Error('Error al obtener el siguiente ID de usuario');
    }
};

/////////////////////////////////////////////////////////////////

const hashPassword = async (password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        return hashedPassword;
    } catch (error) {
        console.error('hashPassword error:', error);
        throw new Error('Error al hashear la contraseña');
    }
};

/////////////////////////////////////////////////////////////////

export const comparePasswords = async (plainPassword, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error('comparePasswords error:', error);
        throw new Error('Error al comparar contraseñas');
    }
};

/////////////////////////////////////////////////////////////////

export const getAllUsuarios = async () => {
    try {
        const snapshot = await getDocs(usuariosCollection);
        return snapshot.docs.map((doc) => doc.data());
    } catch (error) {
        console.error('getAllUsuarios error:', error);
        return [];
    }
};

/////////////////////////////////////////////////////////////////

export const getUsuarioById = async (id) => {
    try {
        const numericId = Number(id);
        const usuarioRef = doc(usuariosCollection, String(numericId));
        const snapshot = await getDoc(usuarioRef);
        
        return snapshot.exists() ? snapshot.data() : null;
    } catch (error) {
        console.error('getUsuarioById error:', error);
        return null;
    }
};

/////////////////////////////////////////////////////////////////

export const getUsuarioByUsername = async (usuario) => {
    try {
        const allSnapshot = await getDocs(usuariosCollection);
        
        const found = allSnapshot.docs.find(d => {
            const data = d.data();
            return data?.usuario === usuario;
        });
        
        return found ? found.data() : null;
    } catch (error) {
        console.error('getUsuarioByUsername error:', error);
        return null;
    }
};

/////////////////////////////////////////////////////////////////

export const createUsuario = async (data) => {
    try {
        if (!data || typeof data !== 'object') {
            throw new Error('Los datos del usuario no son válidos');
        }

        // Hashear la contraseña
        const hashedPassword = await hashPassword(data.password);

        const id_usuario = await getNextUsuarioId();

        const usuarioData = {
            id_usuario,
            nombre: data.nombre,
            email: data.email,
            telefono: data.telefono || '',
            rol: data.rol,
            usuario: data.usuario,
            password: hashedPassword, // Contraseña hasheada
            estado: data.estado !== undefined ? data.estado : true,
            fecha_alta: new Date().toISOString().split('T')[0]
        };

        const usuarioRef = doc(usuariosCollection, String(id_usuario));
        await setDoc(usuarioRef, usuarioData);
        
        // No devolver la password en la respuesta
        const { password, ...usuarioSinPassword } = usuarioData;
        return usuarioSinPassword;

    } catch (error) {
        console.error('createUsuario error:', error);
        throw new Error('Error al crear el usuario en la base de datos');
    }
};

/////////////////////////////////////////////////////////////////

export const updateUsuario = async (id, usuarioData) => {
    try {
        const numericId = Number(id);
        const usuarioRef = doc(usuariosCollection, String(numericId));
        const snapshot = await getDoc(usuarioRef);

        if (!snapshot.exists()) {
            console.warn(`Model -> updateUsuario: no se encontró usuario con id_usuario == ${numericId}`);
            return false;
        }

        // Si la contraseña se está actualizando, hashearla
        const dataToUpdate = { ...usuarioData };
        if (dataToUpdate.password) {
            dataToUpdate.password = await hashPassword(dataToUpdate.password);
        }

        await updateDoc(usuarioRef, dataToUpdate);

        const updatedSnapshot = await getDoc(usuarioRef);
        const updatedData = updatedSnapshot.data();

        // No devolver la password
        const { password, ...usuarioSinPassword } = updatedData;
        
        console.log("Model -> updateUsuario: usuario actualizado correctamente");
        return usuarioSinPassword;

    } catch (error) {
        console.error("Model -> updateUsuario error:", error);
        return null;
    }
};

/////////////////////////////////////////////////////////////////

export const deleteUsuario = async (id) => {
    try {
        const numericId = Number(id);
        const usuarioRef = doc(usuariosCollection, String(numericId));
        const snapshot = await getDoc(usuarioRef);
        
        if (!snapshot.exists()) {
            return { deleted: false, message: 'Usuario no encontrado' };
        }

        const usuarioData = snapshot.data();
        await deleteDoc(usuarioRef);
        
        // No devolver la password
        const { password, ...usuarioSinPassword } = usuarioData;
        return { deleted: true, data: usuarioSinPassword };
        
    } catch (error) {
        console.error('deleteUsuario error:', error);
        return false;
    }
};