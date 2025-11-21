import { db } from './data.js';
import { collection, getDocs, doc, getDoc, deleteDoc, updateDoc, setDoc } from "firebase/firestore";

const proveedoresCollection = collection(db, "proveedores");
const counterDoc = doc(db, "counters", "proveedores");

/////////////////////////////////////////////////////////////////

const getNextProveedorId = async () => {
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
        console.error('getNextProveedorId error:', error);
        throw new Error('Error al obtener el siguiente ID de proveedor');
    }
};

/////////////////////////////////////////////////////////////////

export const getAllProveedores = async () => {
    try {
        const snapshot = await getDocs(proveedoresCollection);
        return snapshot.docs.map((doc) => doc.data());
    } catch (error) {
        console.error('getAllProveedores error:', error);
        return [];
    }
};

/////////////////////////////////////////////////////////////////

export const getProveedorById = async (id) => {
    try {
        const numericId = Number(id);
        const proveedorRef = doc(proveedoresCollection, String(numericId));
        const snapshot = await getDoc(proveedorRef);
        
        return snapshot.exists() ? snapshot.data() : null;
    } catch (error) {
        console.error('getProveedorById error:', error);
        return null;
    }
};

/////////////////////////////////////////////////////////////////

export const createProveedor = async (data) => {
    try {
        if (!data || typeof data !== 'object') {
            throw new Error('Los datos del proveedor no son válidos');
        }

        const id_proveedor = await getNextProveedorId();

        const proveedorData = {
            id_proveedor,
            nombre: data.nombre,
            cuit: data.cuit,
            telefono: data.telefono || '',
            email: data.email || '',
            direccion: data.direccion || '',
            condicion_iva: data.condicion_iva
        };

        const proveedorRef = doc(proveedoresCollection, String(id_proveedor));
        await setDoc(proveedorRef, proveedorData);
        
        return proveedorData;

    } catch (error) {
        console.error('createProveedor error:', error);
        throw new Error('Error al crear el proveedor en la base de datos');
    }
};

/////////////////////////////////////////////////////////////////

export const updateProveedor = async (id, proveedorData) => {
    try {
        const numericId = Number(id);
        const proveedorRef = doc(proveedoresCollection, String(numericId));
        const snapshot = await getDoc(proveedorRef);

        if (!snapshot.exists()) {
            console.warn(`Model -> updateProveedor: no se encontró proveedor con id_proveedor == ${numericId}`);
            return false;
        }

        await updateDoc(proveedorRef, proveedorData);

        const updatedSnapshot = await getDoc(proveedorRef);
        const updatedData = updatedSnapshot.data();

        console.log("Model -> updateProveedor: proveedor actualizado correctamente");
        return updatedData;

    } catch (error) {
        console.error("Model -> updateProveedor error:", error);
        return null;
    }
};

/////////////////////////////////////////////////////////////////

export const deleteProveedor = async (id) => {
    try {
        const numericId = Number(id);
        const proveedorRef = doc(proveedoresCollection, String(numericId));
        const snapshot = await getDoc(proveedorRef);
        
        if (!snapshot.exists()) {
            return { deleted: false, message: 'Proveedor no encontrado' };
        }

        const proveedorData = snapshot.data();
        await deleteDoc(proveedorRef);
        
        return { deleted: true, data: proveedorData };
        
    } catch (error) {
        console.error('deleteProveedor error:', error);
        return false;
    }
};

/////////////////////////////////////////////////////////////////