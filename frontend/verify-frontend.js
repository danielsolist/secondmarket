#!/usr/bin/env node

/**
 * Script de verificación del frontend
 * Verifica que todos los componentes estén correctamente configurados
 */

const fs = require('fs');
const path = require('path');

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

function fileExists(filePath) {
  return fs.existsSync(path.join(__dirname, filePath));
}

function verifyFrontend() {
  console.log('\n🔍 Verificando Frontend de SecondMarket...\n');

  // 1. Verificar variables de entorno
  console.log('📋 Verificando configuración...');
  if (fileExists('.env')) {
    pass('Archivo .env encontrado');
    const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
    if (envContent.includes('REACT_APP_API_URL')) {
      pass('Variable REACT_APP_API_URL configurada');
    } else {
      fail('Variable REACT_APP_API_URL no configurada');
    }
  } else {
    fail('Archivo .env no encontrado');
    console.log('\n⚠️  Crea el archivo .env:\n');
    console.log('   cp .env.example .env\n');
  }

  // 2. Verificar package.json
  console.log('\n📦 Verificando dependencias...');
  if (fileExists('package.json')) {
    pass('package.json encontrado');
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
    
    const requiredDeps = ['react', 'react-dom', 'react-router-dom', 'axios', 'react-scripts'];
    requiredDeps.forEach(dep => {
      if (pkg.dependencies[dep]) {
        pass(`Dependencia ${dep} instalada`);
      } else {
        fail(`Dependencia ${dep} no encontrada`);
      }
    });
  } else {
    fail('package.json no encontrado');
  }

  // 3. Verificar estructura de archivos
  console.log('\n📁 Verificando estructura de archivos...');
  
  const requiredFiles = [
    'src/index.js',
    'src/App.js',
    'src/App.css',
    'src/index.css',
    'public/index.html'
  ];

  requiredFiles.forEach(file => {
    if (fileExists(file)) {
      pass(`Archivo ${file} encontrado`);
    } else {
      fail(`Archivo ${file} no encontrado`);
    }
  });

  // 4. Verificar páginas
  console.log('\n📄 Verificando páginas...');
  
  const pages = [
    'HomePage',
    'LoginPage',
    'RegisterPage',
    'ProfilePage',
    'MyListingsPage',
    'CreateListingPage',
    'EditListingPage',
    'ListingDetailPage',
    'InterestsPage',
    'NotFoundPage'
  ];

  pages.forEach(page => {
    const filePath = `src/pages/${page}.js`;
    if (fileExists(filePath)) {
      pass(`Página ${page} encontrada`);
    } else {
      fail(`Página ${page} no encontrada`);
    }
  });

  // 5. Verificar componentes
  console.log('\n🧩 Verificando componentes...');
  
  const components = [
    'Navbar',
    'ListingCard',
    'FilterBar',
    'LocationSelector',
    'ImageGallery',
    'ShareButtons',
    'InterestButton',
    'Toast',
    'ToastContainer',
    'Loading',
    'FormError',
    'ProtectedRoute'
  ];

  components.forEach(component => {
    const filePath = `src/components/${component}.js`;
    if (fileExists(filePath)) {
      pass(`Componente ${component} encontrado`);
    } else {
      fail(`Componente ${component} no encontrado`);
    }
  });

  // 6. Verificar contextos
  console.log('\n🔄 Verificando contextos...');
  
  if (fileExists('src/context/AuthContext.js')) {
    pass('AuthContext encontrado');
  } else {
    fail('AuthContext no encontrado');
  }

  // 7. Verificar servicios
  console.log('\n🌐 Verificando servicios...');
  
  if (fileExists('src/services/api.js')) {
    pass('Servicio API encontrado');
  } else {
    fail('Servicio API no encontrado');
  }

  // 8. Verificar utilidades
  console.log('\n🛠️  Verificando utilidades...');
  
  if (fileExists('src/utils/helpers.js')) {
    pass('Archivo de helpers encontrado');
  } else {
    fail('Archivo de helpers no encontrado');
  }

  // 9. Verificar estilos CSS
  console.log('\n🎨 Verificando estilos...');
  
  const cssFiles = [
    'src/App.css',
    'src/index.css',
    'src/components/Navbar.css',
    'src/components/ListingCard.css',
    'src/components/FilterBar.css',
    'src/components/LocationSelector.css',
    'src/components/Toast.css',
    'src/pages/HomePage.css',
    'src/pages/LoginPage.css',
    'src/pages/CreateListingPage.css'
  ];

  let cssCount = 0;
  cssFiles.forEach(file => {
    if (fileExists(file)) {
      cssCount++;
    }
  });

  if (cssCount >= 8) {
    pass(`${cssCount} archivos CSS encontrados`);
  } else {
    fail(`Solo ${cssCount} archivos CSS encontrados (se esperan al menos 8)`);
  }

  // 10. Verificar node_modules
  console.log('\n📚 Verificando instalación...');
  
  if (fileExists('node_modules')) {
    pass('node_modules encontrado (dependencias instaladas)');
  } else {
    fail('node_modules no encontrado');
    console.log('\n⚠️  Instala las dependencias:\n');
    console.log('   npm install\n');
  }

  // Resumen
  console.log('\n' + '='.repeat(50));
  console.log('📊 RESUMEN DE VERIFICACIÓN');
  console.log('='.repeat(50));
  console.log(`✅ Verificaciones exitosas: ${checks.passed.length}`);
  console.log(`❌ Verificaciones fallidas: ${checks.failed.length}`);
  
  if (checks.failed.length === 0) {
    console.log('\n🎉 ¡Frontend verificado exitosamente!');
    console.log('\n📝 Para iniciar el servidor de desarrollo:');
    console.log('   npm start\n');
    console.log('📝 Para crear build de producción:');
    console.log('   npm run build\n');
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
try {
  verifyFrontend();
} catch (error) {
  console.error('\n❌ Error fatal durante la verificación:', error.message);
  process.exit(1);
}
