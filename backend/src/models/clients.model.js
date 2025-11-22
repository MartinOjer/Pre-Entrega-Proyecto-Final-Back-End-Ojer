// Importo la conexión a Firestore
import { db } from './data.js';

// Importo funciones necesarias de Firebase Firestore
import { collection, getDocs, doc, getDoc, addDoc, deleteDoc, updateDoc, setDoc, query, where } from "firebase/firestore";

// Referencia a la colección "clients" en Firestore
const clientsCollection = collection(db, "clients");

// Referencia a un documento para contar los IDs
const counterDoc = doc(db, "counters", "clients");

/////////////////////////////////////////////////////////////////

// Función para obtener el siguiente ID de cliente (numérico)
const getNextClientId = async () => {
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
        console.error('getNextClientId error:', error);
        throw new Error('Error al obtener el siguiente ID de cliente');
    }
};

/////////////////////////////////////////////////////////////////

// Obtiene todos los clientes desde Firestore
export const getAllClients = async () => {
    try {
        const snapshot = await getDocs(clientsCollection);
        return snapshot.docs.map((doc) => doc.data()); // Solo retorno los datos, sin el doc.id
    } catch (error) {
        console.error('getAllClients error:', error);
        return [];
    }
};

/////////////////////////////////////////////////////////////////

// Obtiene un cliente por su id_cliente numérico
export const getClientById = async (id) => {
    try {
        const numericId = Number(id);
        const allSnapshot = await getDocs(clientsCollection);
        
        const found = allSnapshot.docs.find(d => {
            const data = d.data();
            return data?.id_cliente === numericId;
        });
        
        return found ? found.data() : null;
    } catch (error) {
        console.error('getClientById error:', error);
        return null;
    }
};

/////////////////////////////////////////////////////////////////

// Función asincrónica que crea un nuevo cliente en Firestore
export const createClient = async (data) => {
    try {
        // Validación básica del objeto recibido
        if (!data || typeof data !== 'object') {
            throw new Error('Los datos del cliente no son válidos');
        }

        // Obtener el siguiente ID de cliente numérico
        const id_cliente = await getNextClientId();

        // Agregar fecha_registro automáticamente y el id_cliente
        const clientData = {
            id_cliente,  // ID numérico auto-incremental (1, 2, 3...)
            ...data,
            fecha_registro: new Date().toISOString().split('T')[0]
        };

        // Guardar en Firestore usando el ID numérico como nombre del documento
        const clientRef = doc(clientsCollection, String(id_cliente));
        await setDoc(clientRef, clientData);
        
        return clientData;

    } catch (error) {
        console.error('createClient error:', error);
        throw new Error('Error al crear el cliente en la base de datos');
    }
};

/////////////////////////////////////////////////////////////////

// Actualiza un cliente existente
export const updateClient = async (id, clientData) => {
    try {
        const numericId = Number(id);
        
        // Busco el documento por id_cliente
        const clientRef = doc(clientsCollection, String(numericId));
        const snapshot = await getDoc(clientRef);

        if (!snapshot.exists()) {
            console.warn(`Model -> updateClient: no se encontró cliente con id_cliente == ${numericId}`);
            return false;
        }

        // Actualizo el documento
        await updateDoc(clientRef, clientData);

        // Obtengo el documento actualizado
        const updatedSnapshot = await getDoc(clientRef);
        const updatedData = updatedSnapshot.data();

        console.log("Model -> updateClient: cliente actualizado correctamente:", updatedData);
        return updatedData;

    } catch (error) {
        console.error("Model -> updateClient error:", error);
        return null;
    }
};

/////////////////////////////////////////////////////////////////

// Elimina un cliente por id_cliente numérico
export const deleteClient = async (id) => {
    try {
        const numericId = Number(id);
        
        // Referencia al documento usando el ID numérico
        const clientRef = doc(clientsCollection, String(numericId));
        
        // Verifico si existe
        const snapshot = await getDoc(clientRef);
        
        console.log('deleteClient - id_cliente:', numericId);
        console.log('deleteClient - exists:', snapshot.exists());

        if (!snapshot.exists()) {
            return { deleted: false, message: 'Cliente no encontrado' };
        }

        const clientData = snapshot.data();

        // Elimino el documento
        await deleteDoc(clientRef);
        
        return { deleted: true, data: clientData };
        
    } catch (error) {
        console.error('deleteClient error:', error);
        return false;
    }
};

/////////////////////////////////////////////////////////////////