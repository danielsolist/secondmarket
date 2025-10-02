const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const dotenv = require('dotenv');
const Colonia = require('../models/Colonia');
const Municipio = require('../models/Municipio');
const Estado = require('../models/Estado');

dotenv.config();

/**
 * Script para importar colonias desde un archivo CSV
 * 
 * Formato esperado del CSV:
 * d_codigo,d_asenta,D_mnpio,d_estado,d_ciudad,d_CP,c_estado,c_mnpio,id_asenta_cpcons,d_zona,c_cve_ciudad
 * 
 * Donde:
 * - d_codigo: Código postal
 * - d_asenta: Nombre de la colonia/asentamiento
 * - D_mnpio: Nombre del municipio
 * - d_estado: Nombre del estado
 * 
 * Fuente de datos: https://www.correosdemexico.gob.mx/SSLServicios/ConsultaCP/CodigoPostal_Exportar.aspx
 */

const importColonias = async (csvFilePath) => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/secondmarket');
    console.log('✓ Conectado a MongoDB');

    // Verificar que el archivo existe
    if (!fs.existsSync(csvFilePath)) {
      console.error(`✗ Archivo no encontrado: ${csvFilePath}`);
      console.log('\nPara obtener el archivo de colonias:');
      console.log('1. Visita: https://www.correosdemexico.gob.mx/SSLServicios/ConsultaCP/CodigoPostal_Exportar.aspx');
      console.log('2. Descarga el archivo de códigos postales');
      console.log('3. Guárdalo como: backend/data/colonias.csv');
      process.exit(1);
    }

    // Limpiar colonias existentes
    console.log('Limpiando colonias existentes...');
    await Colonia.deleteMany({});
    console.log('✓ Colonias eliminadas');

    // Crear cache de estados y municipios
    const estados = await Estado.find();
    const estadosMap = new Map();
    estados.forEach(e => {
      estadosMap.set(e.nombre.toLowerCase().trim(), e);
    });

    const municipios = await Municipio.find().populate('estado');
    const municipiosMap = new Map();
    municipios.forEach(m => {
      const key = `${m.nombre.toLowerCase().trim()}_${m.estado.nombre.toLowerCase().trim()}`;
      municipiosMap.set(key, m);
    });

    console.log(`✓ Cache creado: ${estados.length} estados, ${municipios.length} municipios`);

    const colonias = [];
    const errores = [];
    let procesadas = 0;
    let duplicadas = 0;
    const coloniasSet = new Set();

    // Leer y procesar CSV
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
          procesadas++;

          try {
            const codigoPostal = row.d_codigo || row.d_CP || '';
            const nombreColonia = row.d_asenta || '';
            const nombreMunicipio = row.D_mnpio || '';
            const nombreEstado = row.d_estado || '';

            // Validar datos básicos
            if (!codigoPostal || !nombreColonia || !nombreMunicipio || !nombreEstado) {
              return;
            }

            // Evitar duplicados
            const key = `${codigoPostal}_${nombreColonia.toLowerCase().trim()}`;
            if (coloniasSet.has(key)) {
              duplicadas++;
              return;
            }
            coloniasSet.add(key);

            // Buscar estado
            const estado = estadosMap.get(nombreEstado.toLowerCase().trim());
            if (!estado) {
              errores.push(`Estado no encontrado: ${nombreEstado}`);
              return;
            }

            // Buscar municipio
            const municipioKey = `${nombreMunicipio.toLowerCase().trim()}_${nombreEstado.toLowerCase().trim()}`;
            const municipio = municipiosMap.get(municipioKey);
            if (!municipio) {
              errores.push(`Municipio no encontrado: ${nombreMunicipio}, ${nombreEstado}`);
              return;
            }

            // Agregar colonia
            colonias.push({
              nombre: nombreColonia.trim(),
              codigoPostal: codigoPostal.trim(),
              municipio: municipio._id,
              estado: estado._id
            });

            // Insertar en lotes de 1000
            if (colonias.length >= 1000) {
              Colonia.insertMany(colonias.splice(0, 1000))
                .catch(err => console.error('Error al insertar lote:', err.message));
            }

          } catch (error) {
            errores.push(`Error procesando fila ${procesadas}: ${error.message}`);
          }

          // Mostrar progreso cada 10000 registros
          if (procesadas % 10000 === 0) {
            console.log(`Procesadas: ${procesadas} | En cola: ${colonias.length} | Duplicadas: ${duplicadas}`);
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    // Insertar colonias restantes
    if (colonias.length > 0) {
      await Colonia.insertMany(colonias);
    }

    console.log('\n✓ Importación completada!');
    console.log(`Total filas procesadas: ${procesadas}`);
    console.log(`Total duplicadas omitidas: ${duplicadas}`);
    
    const totalColonias = await Colonia.countDocuments();
    console.log(`Total colonias en BD: ${totalColonias}`);

    if (errores.length > 0) {
      console.log(`\nErrores encontrados: ${errores.length}`);
      console.log('Primeros 10 errores:');
      errores.slice(0, 10).forEach(err => console.log(`  - ${err}`));
    }

    process.exit(0);
  } catch (error) {
    console.error('✗ Error en importación:', error);
    process.exit(1);
  }
};

// Ejecutar importación
const csvPath = process.argv[2] || './data/colonias.csv';
importColonias(csvPath);
