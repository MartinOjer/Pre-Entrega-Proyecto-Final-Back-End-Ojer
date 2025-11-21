import { db } from './data.js';
import { collection, getDocs, doc, getDoc, deleteDoc, updateDoc, setDoc } from "firebase/firestore";

const ordenesCollection = collection(db, "ordenes");
const counterDoc = doc(db, "counters", "ordenes");

/////////////////////////////////////////////////////////////////

const getNextOrdenId = async () => {
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
        console.error('getNextOrdenId error:', error);
        throw new Error('Error al obtener el siguiente ID de orden');
    }
};

/////////////////////////////////////////////////////////////////

export const getAllOrdenes = async () => {
    try {
        const snapshot = await getDocs(ordenesCollection);
        return snapshot.docs.map((doc) => doc.data());
    } catch (error) {
        console.error('getAllOrdenes error:', error);
        return [];
    }
};

/////////////////////////////////////////////////////////////////

export const getOrdenById = async (id) => {
    try {
        const numericId = Number(id);
        const ordenRef = doc(ordenesCollection, String(numericId));
        const snapshot = await getDoc(ordenRef);
        
        return snapshot.exists() ? snapshot.data() : null;
    } catch (error) {
        console.error('getOrdenById error:', error);
        return null;
    }
};

/////////////////////////////////////////////////////////////////

export const getOrdenesByCliente = async (id_cliente) => {
    try {
        const numericClientId = Number(id_cliente);
        const allSnapshot = await getDocs(ordenesCollection);
        
        const ordenes = allSnapshot.docs
            .map((doc) => doc.data())
            .filter((orden) => orden.id_cliente === numericClientId);
        
        return ordenes;
    } catch (error) {
        console.error('getOrdenesByCliente error:', error);
        return [];
    }
};

/////////////////////////////////////////////////////////////////

export const getOrdenesByEquipo = async (id_equipo) => {
    try {
        const numericEquipoId = Number(id_equipo);
        const allSnapshot = await getDocs(ordenesCollection);
        
        const ordenes = allSnapshot.docs
            .map((doc) => doc.data())
            .filter((orden) => orden.id_equipo === numericEquipoId);
        
        return ordenes;
    } catch (error) {
        console.error('getOrdenesByEquipo error:', error);
        return [];
    }
};

/////////////////////////////////////////////////////////////////

export const getOrdenesByTecnico = async (id_usuario) => {
    try {
        const numericUsuarioId = Number(id_usuario);
        const allSnapshot = await getDocs(ordenesCollection);
        
        const ordenes = allSnapshot.docs
            .map((doc) => doc.data())
            .filter((orden) => orden.id_usuario === numericUsuarioId);
        
        return ordenes;
    } catch (error) {
        console.error('getOrdenesByTecnico error:', error);
        return [];
    }
};

/////////////////////////////////////////////////////////////////

export const createOrden = async (data) => {
    try {
        if (!data || typeof data !== 'object') {
            throw new Error('Los datos de la orden no son válidos');
        }

        const id_orden = await getNextOrdenId();

        const ordenData = {
            id_orden,
            id_cliente: Number(data.id_cliente),
            id_equipo: Number(data.id_equipo),
            id_usuario: data.id_usuario ? Number(data.id_usuario) : null,
            descripcion_falla: data.descripcion_falla,
            diagnostico: data.diagnostico || '',
            trabajo_realizado: data.trabajo_realizado || '',
            costo_mano_obra: data.costo_mano_obra ? Number(data.costo_mano_obra) : 0,
            estado: data.estado || 'pendiente',
            fecha_recepcion: new Date().toISOString().split('T')[0],
            fecha_entrega: data.fecha_entrega || null
        };

        const ordenRef = doc(ordenesCollection, String(id_orden));
        await setDoc(ordenRef, ordenData);
        
        return ordenData;

    } catch (error) {
        console.error('createOrden error:', error);
        throw new Error('Error al crear la orden en la base de datos');
    }
};

/////////////////////////////////////////////////////////////////

export const updateOrden = async (id, ordenData) => {
    try {
        const numericId = Number(id);
        const ordenRef = doc(ordenesCollection, String(numericId));
        const snapshot = await getDoc(ordenRef);

        if (!snapshot.exists()) {
            console.warn(`Model -> updateOrden: no se encontró orden con id_orden == ${numericId}`);
            return false;
        }

        await updateDoc(ordenRef, ordenData);

        const updatedSnapshot = await getDoc(ordenRef);
        const updatedData = updatedSnapshot.data();

        console.log("Model -> updateOrden: orden actualizada correctamente");
        return updatedData;

    } catch (error) {
        console.error("Model -> updateOrden error:", error);
        return null;
    }
};

/////////////////////////////////////////////////////////////////

export const deleteOrden = async (id) => {
    try {
        const numericId = Number(id);
        const ordenRef = doc(ordenesCollection, String(numericId));
        const snapshot = await getDoc(ordenRef);
        
        if (!snapshot.exists()) {
            return { deleted: false, message: 'Orden no encontrada' };
        }

        const ordenData = snapshot.data();
        await deleteDoc(ordenRef);
        
        return { deleted: true, data: ordenData };
        
    } catch (error) {
        console.error('deleteOrden error:', error);
        return false;
    }
};

/////////////////////////////////////////////////////////////////