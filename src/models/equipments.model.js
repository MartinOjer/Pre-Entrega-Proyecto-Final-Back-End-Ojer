// Importo la conexión a Firestore
import { db } from './data.js';

// Importo funciones necesarias de Firebase Firestore
import { collection, getDocs, doc, getDoc, addDoc, deleteDoc, updateDoc, setDoc } from "firebase/firestore";

// Referencia a la colección "equipments" en Firestore
const equipmentsCollection = collection(db, "equipments");

// Referencia a un documento para contar los IDs
const counterDoc = doc(db, "counters", "equipments");

/////////////////////////////////////////////////////////////////

// Función para obtener el siguiente ID de equipo (numérico)
const getNextEquipmentId = async () => {
    try {
        const snapshot = await getDoc(counterDoc);
        
        if (!snapshot.exists()) {
            // Si no existe el contador, lo creo con valor 1
            await setDoc(counterDoc, { lastId: 1 });
            return 1;
        }
        
        const currentId = snapshot.data().lastId;
        const nextId = currentId + 1;
        
        // Actualizo el contador
        await updateDoc(counterDoc, { lastId: nextId });
        
        return nextId;
    } catch (error) {
        console.error('getNextEquipmentId error:', error);
        throw new Error('Error al obtener el siguiente ID de equipo');
    }
};

/////////////////////////////////////////////////////////////////

// Obtiene todos los equipos desde Firestore
export const getAllEquipments = async () => {
    try {
        const snapshot = await getDocs(equipmentsCollection);
        return snapshot.docs.map((doc) => doc.data()); // Solo retorno los datos
    } catch (error) {
        console.error('getAllEquipments error:', error);
        return [];
    }
};

/////////////////////////////////////////////////////////////////

// Obtiene un equipo por su id_equipo numérico
export const getEquipmentById = async (id) => {
    try {
        const numericId = Number(id);
        const equipmentRef = doc(equipmentsCollection, String(numericId));
        const snapshot = await getDoc(equipmentRef);
        
        return snapshot.exists() ? snapshot.data() : null;
    } catch (error) {
        console.error('getEquipmentById error:', error);
        return null;
    }
};

/////////////////////////////////////////////////////////////////

// Obtiene todos los equipos de un cliente específico
export const getEquipmentsByClient = async (id_cliente) => {
    try {
        const numericClientId = Number(id_cliente);
        const allSnapshot = await getDocs(equipmentsCollection);
        
        const equipments = allSnapshot.docs
            .map((doc) => doc.data())
            .filter((equipment) => equipment.id_cliente === numericClientId);
        
        return equipments;
    } catch (error) {
        console.error('getEquipmentsByClient error:', error);
        return [];
    }
};

/////////////////////////////////////////////////////////////////

// Función asincrónica que crea un nuevo equipo en Firestore
export const createEquipment = async (data) => {
    try {
        // Validación básica del objeto recibido
        if (!data || typeof data !== 'object') {
            throw new Error('Los datos del equipo no son válidos');
        }

        // Obtener el siguiente ID de equipo numérico
        const id_equipo = await getNextEquipmentId();

        // Convertir id_cliente a número
        const id_cliente = Number(data.id_cliente);

        // Agregar fecha_ingreso automáticamente y el id_equipo
        const equipmentData = {
            id_equipo,  // ID numérico auto-incremental (1, 2, 3...)
            id_cliente, // FK numérico
            tipo_equipo: data.tipo_equipo,
            marca: data.marca,
            modelo: data.modelo,
            nro_serie: data.nro_serie || '',
            observaciones: data.observaciones || '',
            fecha_ingreso: new Date().toISOString().split('T')[0]
        };

        // Guardar en Firestore usando el ID numérico como nombre del documento
        const equipmentRef = doc(equipmentsCollection, String(id_equipo));
        await setDoc(equipmentRef, equipmentData);
        
        return equipmentData;

    } catch (error) {
        console.error('createEquipment error:', error);
        throw new Error('Error al crear el equipo en la base de datos');
    }
};

/////////////////////////////////////////////////////////////////

// Actualiza un equipo existente
export const updateEquipment = async (id, equipmentData) => {
    try {
        const numericId = Number(id);
        
        // Busco el documento por id_equipo
        const equipmentRef = doc(equipmentsCollection, String(numericId));
        const snapshot = await getDoc(equipmentRef);

        if (!snapshot.exists()) {
            console.warn(`Model -> updateEquipment: no se encontró equipo con id_equipo == ${numericId}`);
            return false;
        }

        // Actualizo el documento
        await updateDoc(equipmentRef, equipmentData);

        // Obtengo el documento actualizado
        const updatedSnapshot = await getDoc(equipmentRef);
        const updatedData = updatedSnapshot.data();

        console.log("Model -> updateEquipment: equipo actualizado correctamente:", updatedData);
        return updatedData;

    } catch (error) {
        console.error("Model -> updateEquipment error:", error);
        return null;
    }
};

/////////////////////////////////////////////////////////////////

// Elimina un equipo por id_equipo numérico
export const deleteEquipment = async (id) => {
    try {
        const numericId = Number(id);
        
        // Referencia al documento usando el ID numérico
        const equipmentRef = doc(equipmentsCollection, String(numericId));
        
        // Verifico si existe
        const snapshot = await getDoc(equipmentRef);
        
        console.log('deleteEquipment - id_equipo:', numericId);
        console.log('deleteEquipment - exists:', snapshot.exists());

        if (!snapshot.exists()) {
            return { deleted: false, message: 'Equipo no encontrado' };
        }

        const equipmentData = snapshot.data();

        // Elimino el documento
        await deleteDoc(equipmentRef);
        
        return { deleted: true, data: equipmentData };
        
    } catch (error) {
        console.error('deleteEquipment error:', error);
        return false;
    }
};

/////////////////////////////////////////////////////////////////