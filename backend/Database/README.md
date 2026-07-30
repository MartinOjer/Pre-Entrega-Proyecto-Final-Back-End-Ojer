# Base de Datos de Ejemplo

Esta carpeta contiene datos de ejemplo en formato JSON 
para cada colección del sistema en Firebase Firestore.

## Colecciones

- `clients.json` - Clientes del taller
- `equipments.json` - Equipos registrados
- `ordenes.json` - Órdenes de reparación
- `usuarios.json` - Usuarios del sistema
- `repuestos.json` - Repuestos del inventario
- `proveedores.json` - Proveedores de repuestos

## Estructura de la base de datos

La base de datos utilizada es **Firebase Firestore** (NoSQL).
Los IDs son numéricos auto-incrementales gestionados 
mediante la colección `counters`.

## Cómo importar los datos

Los datos pueden cargarse manualmente en Firebase Console
o mediante el script `migrate-passwords.js` para hashear
las contraseñas de los usuarios antes de importarlos.