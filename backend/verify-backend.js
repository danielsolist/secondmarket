#!/usr/bin/env node

/**
 * Script de verificación del backend
 * Verifica que todos los componentes estén funcionando correctamente
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const checks = {
  passed: [],
  failed: []
};

function pass(message) {
  checks.passed.push(message);
  console.log('✅', message);
}

function fail(message, error) {
  checks.failed.push({ message, error: error?.message || error });
  console.log('❌', message);
  if (error) console.log('   Error:', error.message || error);
}

async function verifyBackend() {
  console.log('\n🔍 Verificando Backend de SecondMarket...\n');

  // 1. Verificar variables de entorno
  console.log('📋 Verificando variables de entorno...');
  const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
  let envOk = true;
  
  requiredEnvVars.forEach(varName => {
    if (process.env[varName]) {
      pass(`Variable ${varName} configurada`);
    } else {
      fail(`Variable ${varName} no configurada`);
      envOk = false;
    }
  });

  if (!envOk) {
    console.log('\n⚠️  Configura las variables de entorno en backend/.env\n');
    process.exit(1);
  }

  // 2. Verificar conexión a MongoDB
  console.log('\n🗄️  Verificando conexión a MongoDB...');
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    pass('Conexión a MongoDB exitosa');
  } catch (error) {
    fail('No se pudo conectar a MongoDB', error);
    console.log('\n⚠️  Asegúrate de que MongoDB esté corriendo:\n');
    console.log('   brew services start mongodb-community\n');
    process.exit(1);
  }

  // 3. Verificar modelos
  console.log('\n📦 Verificando modelos...');
  const models = ['Estado', 'Municipio', 'User', 'Listing', 'Interest'];
  
  for (const modelName of models) {
    try {
      require(`./models/${modelName}`);
      pass(`Modelo ${modelName} cargado`);
    } catch (error) {
      fail(`Error al cargar modelo ${modelName}`, error);
    }
  }

  // 4. Verificar datos en la base de datos
  console.log('\n🌎 Verificando datos geográficos...');
  try {
    const Estado = require('./models/Estado');
    const Municipio = require('./models/Municipio');
    
    const estadoCount = await Estado.countDocuments();
    const municipioCount = await Municipio.countDocuments();
    
    if (estadoCount === 32) {
      pass(`32 estados cargados en la base de datos`);
    } else if (estadoCount === 0) {
      fail('No hay estados en la base de datos');
      console.log('\n⚠️  Ejecuta el seed para cargar los datos:\n');
      console.log('   npm run seed\n');
    } else {
      fail(`Solo ${estadoCount} estados encontrados (se esperan 32)`);
    }
    
    if (municipioCount > 0) {
      pass(`${municipioCount} municipios cargados en la base de datos`);
    } else {
      fail('No hay municipios en la base de datos');
    }
  } catch (error) {
    fail('Error al verificar datos geográficos', error);
  }

  // 5. Verificar rutas
  console.log('\n🛣️  Verificando rutas...');
  const routes = ['auth', 'users', 'listings', 'locations', 'interests'];
  
  for (const route of routes) {
    try {
      require(`./routes/${route}`);
      pass(`Ruta /api/${route} cargada`);
    } catch (error) {
      fail(`Error al cargar ruta /api/${route}`, error);
    }
  }

  // 6. Verificar middleware
  console.log('\n🔧 Verificando middleware...');
  const middleware = ['auth', 'upload', 'errorHandler'];
  
  for (const mw of middleware) {
    try {
      require(`./middleware/${mw}`);
      pass(`Middleware ${mw} cargado`);
    } catch (error) {
      fail(`Error al cargar middleware ${mw}`, error);
    }
  }

  // 7. Verificar servicios
  console.log('\n📧 Verificando servicios...');
  try {
    require('./services/emailService');
    pass('Servicio de email cargado');
  } catch (error) {
    fail('Error al cargar servicio de email', error);
  }

  // Cerrar conexión
  await mongoose.connection.close();

  // Resumen
  console.log('\n' + '='.repeat(50));
  console.log('📊 RESUMEN DE VERIFICACIÓN');
  console.log('='.repeat(50));
  console.log(`✅ Verificaciones exitosas: ${checks.passed.length}`);
  console.log(`❌ Verificaciones fallidas: ${checks.failed.length}`);
  
  if (checks.failed.length === 0) {
    console.log('\n🎉 ¡Backend verificado exitosamente!');
    console.log('\n📝 Para iniciar el servidor:');
    console.log('   npm start     (producción)');
    console.log('   npm run dev   (desarrollo con nodemon)\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  Hay problemas que necesitan atención:\n');
    checks.failed.forEach(({ message, error }) => {
      console.log(`   • ${message}`);
      if (error) console.log(`     ${error}`);
    });
    console.log('');
    process.exit(1);
  }
}

// Ejecutar verificación
verifyBackend().catch(error => {
  console.error('\n❌ Error fatal durante la verificación:', error);
  process.exit(1);
});
