import { db } from './data.js';
import { collection, getDocs, doc, getDoc, deleteDoc, updateDoc, setDoc } from "firebase/firestore";

const repuestosCollection = collection(db, "repuestos");
const counterDoc = doc(db, "counters", "repuestos");

/////////////////////////////////////////////////////////////////

const getNextRepuestoId = async () => {
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
        console.error('getNextRepuestoId error:', error);
        throw new Error('Error al obtener el siguiente ID de repuesto');
    }
};

/////////////////////////////////////////////////////////////////

export const getAllRepuestos = async () => {
    try {
        const snapshot = await getDocs(repuestosCollection);
        return snapshot.docs.map((doc) => doc.data());
    } catch (error) {
        console.error('getAllRepuestos error:', error);
        return [];
    }
};

/////////////////////////////////////////////////////////////////

export const getRepuestoById = async (id) => {
    try {
        const numericId = Number(id);
        const repuestoRef = doc(repuestosCollection, String(numericId));
        const snapshot = await getDoc(repuestoRef);
        
        return snapshot.exists() ? snapshot.data() : null;
    } catch (error) {
        console.error('getRepuestoById error:', error);
        return null;
    }
};

/////////////////////////////////////////////////////////////////

export const getRepuestosByProveedor = async (id_proveedor) => {
    try {
        const numericProveedorId = Number(id_proveedor);
        const allSnapshot = await getDocs(repuestosCollection);
        
        const repuestos = allSnapshot.docs
            .map((doc) => doc.data())
            .filter((repuesto) => repuesto.id_proveedor === numericProveedorId);
        
        return repuestos;
    } catch (error) {
        console.error('getRepuestosByProveedor error:', error);
        return [];
    }
};

/////////////////////////////////////////////////////////////////

export const createRepuesto = async (data) => {
    try {
        if (!data || typeof data !== 'object') {
            throw new Error('Los datos del repuesto no son válidos');
        }

        const id_repuesto = await getNextRepuestoId();

        const repuestoData = {
            id_repuesto,
            nombre: data.nombre,
            codigo: data.codigo,
            marca: data.marca || '',
            stock: Number(data.stock) || 0,
            precio_compra: Number(data.precio_compra) || 0,
            precio_venta: Number(data.precio_venta) || 0,
            id_proveedor: data.id_proveedor ? Number(data.id_proveedor) : null
        };

        const repuestoRef = doc(repuestosCollection, String(id_repuesto));
        await setDoc(repuestoRef, repuestoData);
        
        return repuestoData;

    } catch (error) {
        console.error('createRepuesto error:', error);
        throw new Error('Error al crear el repuesto en la base de datos');
    }
};

/////////////////////////////////////////////////////////////////

export const updateRepuesto = async (id, repuestoData) => {
    try {
        const numericId = Number(id);
        const repuestoRef = doc(repuestosCollection, String(numericId));
        const snapshot = await getDoc(repuestoRef);

        if (!snapshot.exists()) {
            console.warn(`Model -> updateRepuesto: no se encontró repuesto con id_repuesto == ${numericId}`);
            return false;
        }

        await updateDoc(repuestoRef, repuestoData);

        const updatedSnapshot = await getDoc(repuestoRef);
        const updatedData = updatedSnapshot.data();

        console.log("Model -> updateRepuesto: repuesto actualizado correctamente");
        return updatedData;

    } catch (error) {
        console.error("Model -> updateRepuesto error:", error);
        return null;
    }
};

/////////////////////////////////////////////////////////////////

export const deleteRepuesto = async (id) => {
    try {
        const numericId = Number(id);
        const repuestoRef = doc(repuestosCollection, String(numericId));
        const snapshot = await getDoc(repuestoRef);
        
        if (!snapshot.exists()) {
            return { deleted: false, message: 'Repuesto no encontrado' };
        }

        const repuestoData = snapshot.data();
        await deleteDoc(repuestoRef);
        
        return { deleted: true, data: repuestoData };
        
    } catch (error) {
        console.error('deleteRepuesto error:', error);
        return false;
    }
};

/////////////////////////////////////////////////////////////////