const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Colonia = require('../models/Colonia');
const Municipio = require('../models/Municipio');
const Estado = require('../models/Estado');

dotenv.config();

/**
 * Script extendido con más colonias de las principales ciudades de México
 * Incluye las colonias más importantes y populares
 */

const coloniasExtendidas = {
  'Ciudad de México': {
    'Álvaro Obregón': [
      { nombre: 'San Ángel', cp: '01000' }, { nombre: 'Tizapán', cp: '01090' },
      { nombre: 'Guadalupe Inn', cp: '01020' }, { nombre: 'Florida', cp: '01030' },
      { nombre: 'Axotla', cp: '01030' }, { nombre: 'Chimalistac', cp: '01070' },
      { nombre: 'San Ángel Inn', cp: '01060' }, { nombre: 'Altavista', cp: '01060' },
      { nombre: 'Tlacopac', cp: '01040' }, { nombre: 'Campestre', cp: '01040' },
      { nombre: 'Las Águilas', cp: '01710' }, { nombre: 'Olivar del Conde', cp: '01400' },
      { nombre: 'Santa Fe', cp: '01210' }, { nombre: 'Lomas de Santa Fe', cp: '01219' },
    ],
    'Benito Juárez': [
      { nombre: 'Del Valle Centro', cp: '03100' }, { nombre: 'Del Valle Norte', cp: '03103' },
      { nombre: 'Del Valle Sur', cp: '03104' }, { nombre: 'Narvarte Poniente', cp: '03020' },
      { nombre: 'Narvarte Oriente', cp: '03023' }, { nombre: 'Portales Norte', cp: '03300' },
      { nombre: 'Portales Sur', cp: '03303' }, { nombre: 'Nápoles', cp: '03810' },
      { nombre: 'Insurgentes San Borja', cp: '03100' }, { nombre: 'Acacias', cp: '03240' },
      { nombre: 'Álamos', cp: '03400' }, { nombre: 'Postal', cp: '03410' },
      { nombre: 'Piedad Narvarte', cp: '03000' }, { nombre: 'Xoco', cp: '03330' },
      { nombre: 'General Anaya', cp: '03340' }, { nombre: 'Ermita', cp: '03600' },
    ],
    'Cuauhtémoc': [
      { nombre: 'Centro', cp: '06000' }, { nombre: 'Juárez', cp: '06600' },
      { nombre: 'Roma Norte', cp: '06700' }, { nombre: 'Roma Sur', cp: '06760' },
      { nombre: 'Condesa', cp: '06140' }, { nombre: 'Hipódromo', cp: '06100' },
      { nombre: 'Doctores', cp: '06720' }, { nombre: 'Obrera', cp: '06800' },
      { nombre: 'Guerrero', cp: '06300' }, { nombre: 'Santa María la Ribera', cp: '06400' },
      { nombre: 'San Rafael', cp: '06470' }, { nombre: 'Tabacalera', cp: '06030' },
      { nombre: 'Buenavista', cp: '06350' }, { nombre: 'Cuauhtémoc', cp: '06500' },
      { nombre: 'Morelos', cp: '06200' }, { nombre: 'Peralvillo', cp: '06220' },
      { nombre: 'Tepito', cp: '06200' }, { nombre: 'Atlampa', cp: '06450' },
    ],
    'Coyoacán': [
      { nombre: 'Del Carmen', cp: '04100' }, { nombre: 'Villa Coyoacán', cp: '04000' },
      { nombre: 'Copilco Universidad', cp: '04360' }, { nombre: 'Pedregal de Santo Domingo', cp: '04369' },
      { nombre: 'Ajusco', cp: '04300' }, { nombre: 'Culhuacán', cp: '04480' },
      { nombre: 'Churubusco', cp: '04120' }, { nombre: 'Campestre Churubusco', cp: '04200' },
    ],
    'Miguel Hidalgo': [
      { nombre: 'Polanco', cp: '11550' }, { nombre: 'Anzures', cp: '11590' },
      { nombre: 'Lomas de Chapultepec', cp: '11000' }, { nombre: 'Tacuba', cp: '11410' },
      { nombre: 'Granada', cp: '11520' }, { nombre: 'Ampliación Granada', cp: '11529' },
      { nombre: 'Irrigación', cp: '11500' }, { nombre: 'Verónica Anzures', cp: '11300' },
    ],
  },
  'Jalisco': {
    'Guadalajara': [
      { nombre: 'Centro', cp: '44100' }, { nombre: 'Americana', cp: '44160' },
      { nombre: 'Providencia', cp: '44630' }, { nombre: 'Chapalita', cp: '45040' },
      { nombre: 'Jardines del Bosque', cp: '44520' }, { nombre: 'Colinas de San Javier', cp: '44657' },
      { nombre: 'Ladrón de Guevara', cp: '44600' }, { nombre: 'Lafayette', cp: '44160' },
      { nombre: 'Arcos Vallarta', cp: '44130' }, { nombre: 'Vallarta Poniente', cp: '44110' },
      { nombre: 'Vallarta Norte', cp: '44690' }, { nombre: 'Vallarta San Jorge', cp: '44690' },
    ],
    'Zapopan': [
      { nombre: 'Zapopan Centro', cp: '45100' }, { nombre: 'Ciudad Granja', cp: '45010' },
      { nombre: 'Lomas del Valle', cp: '45129' }, { nombre: 'Tesistán', cp: '45200' },
      { nombre: 'Santa Margarita', cp: '45140' }, { nombre: 'Tabachines', cp: '45180' },
    ],
    'San Pedro Tlaquepaque': [
      { nombre: 'Tlaquepaque Centro', cp: '45500' }, { nombre: 'La Gigantera', cp: '45601' },
      { nombre: 'San Martín de las Flores', cp: '45550' },
    ],
    'Tonalá': [
      { nombre: 'Tonalá Centro', cp: '45400' }, { nombre: 'Loma Dorada', cp: '45425' },
    ],
  },
  'Nuevo León': {
    'Monterrey': [
      { nombre: 'Centro', cp: '64000' }, { nombre: 'Del Valle', cp: '66220' },
      { nombre: 'Contry', cp: '66050' }, { nombre: 'Obispado', cp: '64060' },
      { nombre: 'Cumbres', cp: '64610' }, { nombre: 'San Jerónimo', cp: '64640' },
      { nombre: 'Mitras Centro', cp: '64460' }, { nombre: 'Mitras Norte', cp: '64320' },
      { nombre: 'Mitras Sur', cp: '64020' }, { nombre: 'Residencial San Agustín', cp: '66260' },
    ],
    'San Pedro Garza García': [
      { nombre: 'Del Valle', cp: '66220' }, { nombre: 'Fuentes del Valle', cp: '66220' },
      { nombre: 'Valle Oriente', cp: '66269' }, { nombre: 'Calzadas', cp: '66230' },
    ],
    'Guadalupe': [
      { nombre: 'Guadalupe Centro', cp: '67100' }, { nombre: 'Contry Sol', cp: '67174' },
      { nombre: 'Las Puentes', cp: '67130' },
    ],
    'Apodaca': [
      { nombre: 'Apodaca Centro', cp: '66600' }, { nombre: 'Pueblo Nuevo', cp: '66640' },
    ],
  },
  'Puebla': {
    'Puebla': [
      { nombre: 'Centro Histórico', cp: '72000' }, { nombre: 'La Paz', cp: '72160' },
      { nombre: 'Amor', cp: '72140' }, { nombre: 'Analco', cp: '72500' },
      { nombre: 'Angelópolis', cp: '72830' }, { nombre: 'Zavaleta', cp: '72170' },
    ],
  },
  'Querétaro': {
    'Querétaro': [
      { nombre: 'Centro Histórico', cp: '76000' }, { nombre: 'Carretas', cp: '76050' },
      { nombre: 'Juriquilla', cp: '76230' }, { nombre: 'El Refugio', cp: '76146' },
    ],
  },
  'Guanajuato': {
    'León': [
      { nombre: 'Centro', cp: '37000' }, { nombre: 'Jardines del Moral', cp: '37160' },
      { nombre: 'Valle del Campestre', cp: '37150' },
    ],
  },
  'Veracruz': {
    'Veracruz': [
      { nombre: 'Centro', cp: '91700' }, { nombre: 'Reforma', cp: '91919' },
      { nombre: 'Boca del Río', cp: '94290' },
    ],
  },
  'Yucatán': {
    'Mérida': [
      { nombre: 'Centro', cp: '97000' }, { nombre: 'García Ginerés', cp: '97070' },
      { nombre: 'Itzimná', cp: '97100' }, { nombre: 'Montejo', cp: '97127' },
    ],
  },
};

const seedColoniasExtendido = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/secondmarket');
    console.log('✓ Conectado a MongoDB');

    await Colonia.deleteMany({});
    console.log('✓ Colonias existentes eliminadas');

    let totalInsertadas = 0;
    let totalErrores = 0;

    for (const [nombreEstado, municipiosData] of Object.entries(coloniasExtendidas)) {
      console.log(`\nProcesando ${nombreEstado}...`);
      
      const estado = await Estado.findOne({ nombre: nombreEstado });
      if (!estado) {
        console.log(`✗ Estado no encontrado: ${nombreEstado}`);
        continue;
      }

      for (const [nombreMunicipio, colonias] of Object.entries(municipiosData)) {
        const municipio = await Municipio.findOne({
          nombre: nombreMunicipio,
          estado: estado._id
        });

        if (!municipio) {
          console.log(`✗ Municipio no encontrado: ${nombreMunicipio}, ${nombreEstado}`);
          continue;
        }

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
            console.log(`✗ Error: ${coloniaData.nombre} - ${error.message}`);
            totalErrores++;
          }
        }

        console.log(`  ✓ ${nombreMunicipio}: ${colonias.length} colonias`);
      }
    }

    console.log('\n✓ Seed completado!');
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

seedColoniasExtendido();
