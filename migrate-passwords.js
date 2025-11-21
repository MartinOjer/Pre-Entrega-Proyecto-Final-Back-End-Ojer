// ================================
//  migrate-passwords.js
// ================================
// Ejecutar con: node migrate-passwords.js

import { db } from './src/models/data.js';
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

const migratePasswords = async () => {
    try {
        console.log('🔄 Iniciando migración de contraseñas...\n');

        const usuariosCollection = collection(db, "usuarios");
        const snapshot = await getDocs(usuariosCollection);

        if (snapshot.empty) {
            console.log('❌ No se encontraron usuarios');
            return;
        }

        let migratedCount = 0;
        let skippedCount = 0;

        for (const docSnap of snapshot.docs) {
            const usuario = docSnap.data();
            
            // Verificar si la contraseña ya está hasheada (empieza con $2a, $2b o $2x)
            const isAlreadyHashed = usuario.password.startsWith('$2a$') || 
                                    usuario.password.startsWith('$2b$') || 
                                    usuario.password.startsWith('$2x$');

            if (isAlreadyHashed) {
                console.log(`⏭️  Usuario "${usuario.usuario}" - Ya está hasheada`);
                skippedCount++;
                continue;
            }

            // Hashear la contraseña
            const hashedPassword = await bcrypt.hash(usuario.password, SALT_ROUNDS);

            // Actualizar en Firestore
            const usuarioRef = doc(usuariosCollection, docSnap.id);
            await updateDoc(usuarioRef, { password: hashedPassword });

            console.log(`✅ Usuario "${usuario.usuario}" - Contraseña migrada`);
            migratedCount++;
        }

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✨ Migración completada:`);
        console.log(`   • Migraciones: ${migratedCount}`);
        console.log(`   • Omitidas: ${skippedCount}`);
        console.log(`   • Total: ${migratedCount + skippedCount}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    } catch (error) {
        console.error('❌ Error durante la migración:', error);
    }
};

migratePasswords();