const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Colonia = require('../models/Colonia');
const Municipio = require('../models/Municipio');
const Estado = require('../models/Estado');

dotenv.config();

/**
 * Script para generar datos de colonias de las principales ciudades de México
 * Basado en datos públicos de códigos postales
 */

// Datos de colonias principales de México (muestra representativa)
const coloniasData = {
  'Ciudad de México': {
    'Álvaro Obregón': [
      { nombre: 'San Ángel', cp: '01000' },
      { nombre: 'Tizapán', cp: '01090' },
      { nombre: 'Guadalupe Inn', cp: '01020' },
      { nombre: 'Florida', cp: '01030' },
      { nombre: 'Axotla', cp: '01030' },
    ],
    'Azcapotzalco': [
      { nombre: 'Centro de Azcapotzalco', cp: '02000' },
      { nombre: 'San Marcos', cp: '02020' },
      { nombre: 'Clavería', cp: '02080' },
      { nombre: 'Pro Hogar', cp: '02600' },
    ],
    'Benito Juárez': [
      { nombre: 'Del Valle Centro', cp: '03100' },
      { nombre: 'Del Valle Norte', cp: '03103' },
      { nombre: 'Del Valle Sur', cp: '03104' },
      { nombre: 'Narvarte Poniente', cp: '03020' },
      { nombre: 'Narvarte Oriente', cp: '03023' },
      { nombre: 'Portales Norte', cp: '03300' },
      { nombre: 'Portales Sur', cp: '03303' },
      { nombre: 'Nápoles', cp: '03810' },
      { nombre: 'Insurgentes San Borja', cp: '03100' },
    ],
    'Coyoacán': [
      { nombre: 'Del Carmen', cp: '04100' },
      { nombre: 'Villa Coyoacán', cp: '04000' },
      { nombre: 'Copilco Universidad', cp: '04360' },
      { nombre: 'Pedregal de Santo Domingo', cp: '04369' },
    ],
    'Cuauhtémoc': [
      { nombre: 'Centro', cp: '06000' },
      { nombre: 'Juárez', cp: '06600' },
      { nombre: 'Roma Norte', cp: '06700' },
      { nombre: 'Roma Sur', cp: '06760' },
      { nombre: 'Condesa', cp: '06140' },
      { nombre: 'Hipódromo', cp: '06100' },
      { nombre: 'Doctores', cp: '06720' },
      { nombre: 'Obrera', cp: '06800' },
      { nombre: 'Guerrero', cp: '06300' },
      { nombre: 'Santa María la Ribera', cp: '06400' },
      { nombre: 'San Rafael', cp: '06470' },
      { nombre: 'Tabacalera', cp: '06030' },
    ],
    'Gustavo A. Madero': [
      { nombre: 'Lindavista', cp: '07300' },
      { nombre: 'Aragón La Villa', cp: '07050' },
      { nombre: 'Tepeyac Insurgentes', cp: '07020' },
    ],
    'Iztacalco': [
      { nombre: 'Agrícola Oriental', cp: '08500' },
      { nombre: 'Granjas México', cp: '08400' },
    ],
    'Iztapalapa': [
      { nombre: 'Escuadrón 201', cp: '09060' },
      { nombre: 'Unidad Habitacional Vicente Guerrero', cp: '09200' },
    ],
    'Miguel Hidalgo': [
      { nombre: 'Polanco', cp: '11550' },
      { nombre: 'Anzures', cp: '11590' },
      { nombre: 'Lomas de Chapultepec', cp: '11000' },
      { nombre: 'Tacuba', cp: '11410' },
    ],
    'Tlalpan': [
      { nombre: 'Tlalpan Centro', cp: '14000' },
      { nombre: 'Pedregal de San Nicolás', cp: '14100' },
    ],
  },
  'Jalisco': {
    'Guadalajara': [
      { nombre: 'Centro', cp: '44100' },
      { nombre: 'Americana', cp: '44160' },
      { nombre: 'Providencia', cp: '44630' },
      { nombre: 'Chapalita', cp: '45040' },
      { nombre: 'Jardines del Bosque', cp: '44520' },
      { nombre: 'Colinas de San Javier', cp: '44657' },
    ],
    'Zapopan': [
      { nombre: 'Zapopan Centro', cp: '45100' },
      { nombre: 'Ciudad Granja', cp: '45010' },
      { nombre: 'Lomas del Valle', cp: '45129' },
    ],
    'Tlaquepaque': [
      { nombre: 'Tlaquepaque Centro', cp: '45500' },
      { nombre: 'La Gigantera', cp: '45601' },
    ],
  },
  'Nuevo León': {
    'Monterrey': [
      { nombre: 'Centro', cp: '64000' },
      { nombre: 'Del Valle', cp: '66220' },
      { nombre: 'Contry', cp: '66050' },
      { nombre: 'Obispado', cp: '64060' },
      { nombre: 'Cumbres', cp: '64610' },
      { nombre: 'San Jerónimo', cp: '64640' },
    ],
    'San Pedro Garza García': [
      { nombre: 'Del Valle', cp: '66220' },
      { nombre: 'Fuentes del Valle', cp: '66220' },
    ],
    'Guadalupe': [
      { nombre: 'Guadalupe Centro', cp: '67100' },
      { nombre: 'Contry Sol', cp: '67174' },
    ],
  },
};

const generateColonias = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/secondmarket');
    console.log('✓ Conectado a MongoDB');

    // Limpiar colonias existentes
    await Colonia.deleteMany({});
    console.log('✓ Colonias existentes eliminadas');

    let totalInsertadas = 0;
    let totalErrores = 0;

    // Procesar cada estado
    for (const [nombreEstado, municipiosData] of Object.entries(coloniasData)) {
      console.log(`\nProcesando ${nombreEstado}...`);
      
      // Buscar estado
      const estado = await Estado.findOne({ nombre: nombreEstado });
      if (!estado) {
        console.log(`✗ Estado no encontrado: ${nombreEstado}`);
        continue;
      }

      // Procesar cada municipio
      for (const [nombreMunicipio, colonias] of Object.entries(municipiosData)) {
        const municipio = await Municipio.findOne({
          nombre: nombreMunicipio,
          estado: estado._id
        });

        if (!municipio) {
          console.log(`✗ Municipio no encontrado: ${nombreMunicipio}`);
          continue;
        }

        // Insertar colonias
        for (const coloniaData of colonias) {
          try {
            await Colonia.create({
              nombre: coloniaData.nombre,
              codigoPostal: coloniaData.cp,
              municipio: municipio._id,
              estado: estado._id
            });
            totalInsertadas++;
          } catch (error) {
            console.log(`✗ Error al crear ${coloniaData.nombre}: ${error.message}`);
            totalErrores++;
          }
        }

        console.log(`  ✓ ${nombreMunicipio}: ${colonias.length} colonias`);
      }
    }

    console.log('\n✓ Generación completada!');
    console.log(`Total colonias insertadas: ${totalInsertadas}`);
    console.log(`Total errores: ${totalErrores}`);

    const totalColonias = await Colonia.countDocuments();
    console.log(`Total colonias en BD: ${totalColonias}`);

    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error);
    process.exit(1);
  }
};

generateColonias();
