const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Colonia = require('../models/Colonia');
const Municipio = require('../models/Municipio');
const Estado = require('../models/Estado');

dotenv.config();

// Datos de ejemplo de colonias con códigos postales
// En producción, estos datos deberían cargarse desde un archivo CSV del Servicio Postal Mexicano
const coloniasEjemplo = [
  // Ciudad de México - Benito Juárez
  { nombre: 'Del Valle Centro', cp: '03100', municipio: 'Benito Juárez', estado: 'Ciudad de México' },
  { nombre: 'Del Valle Norte', cp: '03103', municipio: 'Benito Juárez', estado: 'Ciudad de México' },
  { nombre: 'Del Valle Sur', cp: '03104', municipio: 'Benito Juárez', estado: 'Ciudad de México' },
  { nombre: 'Narvarte Poniente', cp: '03020', municipio: 'Benito Juárez', estado: 'Ciudad de México' },
  { nombre: 'Narvarte Oriente', cp: '03023', municipio: 'Benito Juárez', estado: 'Ciudad de México' },
  
  // Ciudad de México - Cuauhtémoc
  { nombre: 'Centro', cp: '06000', municipio: 'Cuauhtémoc', estado: 'Ciudad de México' },
  { nombre: 'Roma Norte', cp: '06700', municipio: 'Cuauhtémoc', estado: 'Ciudad de México' },
  { nombre: 'Roma Sur', cp: '06760', municipio: 'Cuauhtémoc', estado: 'Ciudad de México' },
  { nombre: 'Condesa', cp: '06140', municipio: 'Cuauhtémoc', estado: 'Ciudad de México' },
  { nombre: 'Juárez', cp: '06600', municipio: 'Cuauhtémoc', estado: 'Ciudad de México' },
  
  // Guadalajara, Jalisco
  { nombre: 'Centro', cp: '44100', municipio: 'Guadalajara', estado: 'Jalisco' },
  { nombre: 'Americana', cp: '44160', municipio: 'Guadalajara', estado: 'Jalisco' },
  { nombre: 'Providencia', cp: '44630', municipio: 'Guadalajara', estado: 'Jalisco' },
  { nombre: 'Chapalita', cp: '45040', municipio: 'Guadalajara', estado: 'Jalisco' },
  
  // Monterrey, Nuevo León
  { nombre: 'Centro', cp: '64000', municipio: 'Monterrey', estado: 'Nuevo León' },
  { nombre: 'Del Valle', cp: '66220', municipio: 'Monterrey', estado: 'Nuevo León' },
  { nombre: 'Contry', cp: '66050', municipio: 'Monterrey', estado: 'Nuevo León' },
  { nombre: 'Obispado', cp: '64060', municipio: 'Monterrey', estado: 'Nuevo León' },
];

const seedColonias = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/secondmarket');
    console.log('✓ Conectado a MongoDB');

    // Limpiar colonias existentes
    await Colonia.deleteMany({});
    console.log('✓ Colonias existentes eliminadas');

    let insertadas = 0;
    let errores = 0;

    // Insertar colonias de ejemplo
    for (const coloniaData of coloniasEjemplo) {
      try {
        // Buscar el estado
        const estado = await Estado.findOne({ nombre: coloniaData.estado });
        if (!estado) {
          console.log(`✗ Estado no encontrado: ${coloniaData.estado}`);
          errores++;
          continue;
        }

        // Buscar el municipio
        const municipio = await Municipio.findOne({ 
          nombre: coloniaData.municipio,
          estado: estado._id 
        });
        
        if (!municipio) {
          console.log(`✗ Municipio no encontrado: ${coloniaData.municipio}, ${coloniaData.estado}`);
          errores++;
          continue;
        }

        // Crear la colonia
        await Colonia.create({
          nombre: coloniaData.nombre,
          codigoPostal: coloniaData.cp,
          municipio: municipio._id,
          estado: estado._id
        });

        insertadas++;
        console.log(`✓ Colonia creada: ${coloniaData.nombre} (CP: ${coloniaData.cp})`);
      } catch (error) {
        console.log(`✗ Error al crear colonia ${coloniaData.nombre}:`, error.message);
        errores++;
      }
    }

    console.log('\n✓ Seed de colonias completado!');
    console.log(`Total colonias insertadas: ${insertadas}`);
    console.log(`Total errores: ${errores}`);

    process.exit(0);
  } catch (error) {
    console.error('✗ Error en seed de colonias:', error);
    process.exit(1);
  }
};

seedColonias();
