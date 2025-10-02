const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Estado = require('../models/Estado');
const Municipio = require('../models/Municipio');

dotenv.config();

// Data for all 32 Mexican states with sample municipalities
const mexicoData = [
  {
    nombre: 'Aguascalientes',
    codigo: 'AGS',
    municipios: ['Aguascalientes', 'Asientos', 'Calvillo', 'Cosío', 'Jesús María', 'Pabellón de Arteaga', 'Rincón de Romos', 'San José de Gracia', 'Tepezalá', 'El Llano', 'San Francisco de los Romo']
  },
  {
    nombre: 'Baja California',
    codigo: 'BC',
    municipios: ['Ensenada', 'Mexicali', 'Tecate', 'Tijuana', 'Playas de Rosarito']
  },
  {
    nombre: 'Baja California Sur',
    codigo: 'BCS',
    municipios: ['Comondú', 'Mulegé', 'La Paz', 'Los Cabos', 'Loreto']
  },
  {
    nombre: 'Campeche',
    codigo: 'CAM',
    municipios: ['Calkiní', 'Campeche', 'Carmen', 'Champotón', 'Hecelchakán', 'Hopelchén', 'Palizada', 'Tenabo', 'Escárcega', 'Calakmul', 'Candelaria']
  },
  {
    nombre: 'Chiapas',
    codigo: 'CHIS',
    municipios: ['Tuxtla Gutiérrez', 'San Cristóbal de las Casas', 'Tapachula', 'Comitán de Domínguez', 'Palenque', 'Chiapa de Corzo', 'Ocosingo', 'Tonalá', 'Villaflores', 'Arriaga']
  },
  {
    nombre: 'Chihuahua',
    codigo: 'CHIH',
    municipios: ['Chihuahua', 'Juárez', 'Cuauhtémoc', 'Delicias', 'Hidalgo del Parral', 'Nuevo Casas Grandes', 'Camargo', 'Jiménez', 'Meoqui', 'Ojinaga']
  },
  {
    nombre: 'Ciudad de México',
    codigo: 'CDMX',
    municipios: ['Álvaro Obregón', 'Azcapotzalco', 'Benito Juárez', 'Coyoacán', 'Cuajimalpa de Morelos', 'Cuauhtémoc', 'Gustavo A. Madero', 'Iztacalco', 'Iztapalapa', 'Magdalena Contreras', 'Miguel Hidalgo', 'Milpa Alta', 'Tláhuac', 'Tlalpan', 'Venustiano Carranza', 'Xochimilco']
  },
  {
    nombre: 'Coahuila',
    codigo: 'COAH',
    municipios: ['Saltillo', 'Torreón', 'Monclova', 'Piedras Negras', 'Acuña', 'Ramos Arizpe', 'Frontera', 'Sabinas', 'Parras', 'Matamoros']
  },
  {
    nombre: 'Colima',
    codigo: 'COL',
    municipios: ['Armería', 'Colima', 'Comala', 'Coquimatlán', 'Cuauhtémoc', 'Ixtlahuacán', 'Manzanillo', 'Minatitlán', 'Tecomán', 'Villa de Álvarez']
  },
  {
    nombre: 'Durango',
    codigo: 'DGO',
    municipios: ['Durango', 'Gómez Palacio', 'Lerdo', 'Santiago Papasquiaro', 'Guadalupe Victoria', 'Pueblo Nuevo', 'Cuencamé', 'Nombre de Dios', 'Mapimí', 'Canatlán']
  },
  {
    nombre: 'Guanajuato',
    codigo: 'GTO',
    municipios: ['León', 'Irapuato', 'Celaya', 'Salamanca', 'Guanajuato', 'San Miguel de Allende', 'Pénjamo', 'Silao', 'Dolores Hidalgo', 'Acámbaro']
  },
  {
    nombre: 'Guerrero',
    codigo: 'GRO',
    municipios: ['Acapulco de Juárez', 'Chilpancingo de los Bravo', 'Iguala de la Independencia', 'Zihuatanejo de Azueta', 'Taxco de Alarcón', 'Tlapa de Comonfort', 'Chilapa de Álvarez', 'Ometepec', 'Arcelia', 'Coyuca de Benítez']
  },
  {
    nombre: 'Hidalgo',
    codigo: 'HGO',
    municipios: ['Pachuca de Soto', 'Tulancingo de Bravo', 'Tula de Allende', 'Huejutla de Reyes', 'Tepeji del Río', 'Ixmiquilpan', 'Tizayuca', 'Actopan', 'Apan', 'Mineral de la Reforma']
  },
  {
    nombre: 'Jalisco',
    codigo: 'JAL',
    municipios: ['Guadalajara', 'Zapopan', 'Tlaquepaque', 'Tonalá', 'Tlajomulco de Zúñiga', 'Puerto Vallarta', 'Lagos de Moreno', 'Tepatitlán de Morelos', 'El Salto', 'Zapotlanejo']
  },
  {
    nombre: 'México',
    codigo: 'MEX',
    municipios: ['Ecatepec de Morelos', 'Nezahualcóyotl', 'Naucalpan de Juárez', 'Tlalnepantla de Baz', 'Toluca', 'Chimalhuacán', 'Cuautitlán Izcalli', 'Atizapán de Zaragoza', 'Ixtapaluca', 'Tultitlán']
  },
  {
    nombre: 'Michoacán',
    codigo: 'MICH',
    municipios: ['Morelia', 'Uruapan', 'Zamora', 'Lázaro Cárdenas', 'Apatzingán', 'Zitácuaro', 'Pátzcuaro', 'La Piedad', 'Sahuayo', 'Hidalgo']
  },
  {
    nombre: 'Morelos',
    codigo: 'MOR',
    municipios: ['Cuernavaca', 'Jiutepec', 'Cuautla', 'Temixco', 'Emiliano Zapata', 'Yautepec', 'Xochitepec', 'Puente de Ixtla', 'Jojutla', 'Ayala']
  },
  {
    nombre: 'Nayarit',
    codigo: 'NAY',
    municipios: ['Tepic', 'Bahía de Banderas', 'Santiago Ixcuintla', 'Compostela', 'Tuxpan', 'Ixtlán del Río', 'San Blas', 'Acaponeta', 'Tecuala', 'Rosamorada']
  },
  {
    nombre: 'Nuevo León',
    codigo: 'NL',
    municipios: ['Monterrey', 'Guadalupe', 'San Nicolás de los Garza', 'Apodaca', 'General Escobedo', 'Santa Catarina', 'San Pedro Garza García', 'Juárez', 'Cadereyta Jiménez', 'García']
  },
  {
    nombre: 'Oaxaca',
    codigo: 'OAX',
    municipios: ['Oaxaca de Juárez', 'San Juan Bautista Tuxtepec', 'Juchitán de Zaragoza', 'Salina Cruz', 'Huajuapan de León', 'Puerto Escondido', 'Tehuantepec', 'Tlaxiaco', 'Miahuatlán de Porfirio Díaz', 'Ocotlán de Morelos']
  },
  {
    nombre: 'Puebla',
    codigo: 'PUE',
    municipios: ['Puebla', 'Tehuacán', 'San Martín Texmelucan', 'Atlixco', 'San Pedro Cholula', 'Teziutlán', 'Cuautlancingo', 'Amozoc', 'Huauchinango', 'Zacatlán']
  },
  {
    nombre: 'Querétaro',
    codigo: 'QRO',
    municipios: ['Querétaro', 'San Juan del Río', 'Corregidora', 'El Marqués', 'Cadereyta de Montes', 'Pedro Escobedo', 'Tequisquiapan', 'Ezequiel Montes', 'Jalpan de Serra', 'Colón']
  },
  {
    nombre: 'Quintana Roo',
    codigo: 'QROO',
    municipios: ['Benito Juárez', 'Othón P. Blanco', 'Solidaridad', 'Cozumel', 'Felipe Carrillo Puerto', 'Tulum', 'Bacalar', 'José María Morelos', 'Lázaro Cárdenas', 'Isla Mujeres', 'Puerto Morelos']
  },
  {
    nombre: 'San Luis Potosí',
    codigo: 'SLP',
    municipios: ['San Luis Potosí', 'Soledad de Graciano Sánchez', 'Ciudad Valles', 'Matehuala', 'Rioverde', 'Tamazunchale', 'Cárdenas', 'Ebano', 'Tamuín', 'Cerritos']
  },
  {
    nombre: 'Sinaloa',
    codigo: 'SIN',
    municipios: ['Culiacán', 'Mazatlán', 'Ahome', 'Guasave', 'Navolato', 'El Fuerte', 'Salvador Alvarado', 'Escuinapa', 'Mocorito', 'Sinaloa']
  },
  {
    nombre: 'Sonora',
    codigo: 'SON',
    municipios: ['Hermosillo', 'Cajeme', 'Nogales', 'San Luis Río Colorado', 'Navojoa', 'Guaymas', 'Agua Prieta', 'Caborca', 'Huatabampo', 'Empalme']
  },
  {
    nombre: 'Tabasco',
    codigo: 'TAB',
    municipios: ['Centro', 'Cárdenas', 'Comalcalco', 'Huimanguillo', 'Macuspana', 'Cunduacán', 'Paraíso', 'Jalpa de Méndez', 'Nacajuca', 'Balancán']
  },
  {
    nombre: 'Tamaulipas',
    codigo: 'TAM',
    municipios: ['Reynosa', 'Matamoros', 'Nuevo Laredo', 'Tampico', 'Victoria', 'Altamira', 'Ciudad Madero', 'Río Bravo', 'Valle Hermoso', 'Miguel Alemán']
  },
  {
    nombre: 'Tlaxcala',
    codigo: 'TLAX',
    municipios: ['Tlaxcala', 'Apizaco', 'Huamantla', 'Chiautempan', 'Zacatelco', 'San Pablo del Monte', 'Calpulalpan', 'Tlaxco', 'Panotla', 'Contla de Juan Cuamatzi']
  },
  {
    nombre: 'Veracruz',
    codigo: 'VER',
    municipios: ['Veracruz', 'Xalapa', 'Coatzacoalcos', 'Poza Rica de Hidalgo', 'Córdoba', 'Minatitlán', 'Boca del Río', 'Orizaba', 'Tuxpan', 'Papantla']
  },
  {
    nombre: 'Yucatán',
    codigo: 'YUC',
    municipios: ['Mérida', 'Kanasín', 'Valladolid', 'Tizimín', 'Progreso', 'Umán', 'Ticul', 'Motul', 'Tekax', 'Hunucmá']
  },
  {
    nombre: 'Zacatecas',
    codigo: 'ZAC',
    municipios: ['Zacatecas', 'Fresnillo', 'Guadalupe', 'Jerez', 'Río Grande', 'Sombrerete', 'Loreto', 'Pinos', 'Jalpa', 'Nochistlán de Mejía']
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/secondmarket');
    console.log('✓ Connected to MongoDB');

    // Clear existing data
    await Estado.deleteMany({});
    await Municipio.deleteMany({});
    console.log('✓ Cleared existing data');

    // Insert states and municipalities
    for (const estadoData of mexicoData) {
      const estado = await Estado.create({
        nombre: estadoData.nombre,
        codigo: estadoData.codigo
      });
      console.log(`✓ Created state: ${estadoData.nombre}`);

      const municipios = estadoData.municipios.map(nombre => ({
        nombre,
        estado: estado._id
      }));

      await Municipio.insertMany(municipios);
      console.log(`  ✓ Created ${municipios.length} municipalities`);
    }

    console.log('\n✓ Seed completed successfully!');
    console.log(`Total states: ${mexicoData.length}`);
    
    const totalMunicipios = await Municipio.countDocuments();
    console.log(`Total municipalities: ${totalMunicipios}`);

    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
