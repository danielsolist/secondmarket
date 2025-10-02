# Datos de Colonias de México

## Cómo obtener el archivo completo de colonias

Para cargar todas las colonias de México (~100,000 registros), necesitas obtener el archivo oficial del Servicio Postal Mexicano.

### Opción 1: Descarga Oficial (Recomendado)

1. Visita el sitio oficial de Correos de México:
   https://www.correosdemexico.gob.mx/SSLServicios/ConsultaCP/CodigoPostal_Exportar.aspx

2. Descarga el archivo de códigos postales (formato TXT o CSV)

3. Guarda el archivo en esta carpeta como `colonias.csv`

4. Ejecuta el script de importación:
   ```bash
   cd backend
   npm install csv-parser  # Si no está instalado
   node scripts/importColoniasFromCSV.js ./data/colonias.csv
   ```

### Opción 2: Fuente Alternativa

También puedes obtener los datos de:
- INEGI: https://www.inegi.org.mx/
- SEPOMEX (Servicio Postal Mexicano)
- Datasets públicos en GitHub

### Formato Esperado del CSV

El archivo CSV debe tener las siguientes columnas:

```
d_codigo,d_asenta,D_mnpio,d_estado,d_ciudad,d_CP,c_estado,c_mnpio,id_asenta_cpcons,d_zona,c_cve_ciudad
```

Donde:
- `d_codigo` o `d_CP`: Código postal (5 dígitos)
- `d_asenta`: Nombre de la colonia/asentamiento
- `D_mnpio`: Nombre del municipio
- `d_estado`: Nombre del estado

### Notas Importantes

1. **Tiempo de importación**: La importación de ~100,000 colonias puede tomar varios minutos
2. **Espacio en disco**: Asegúrate de tener suficiente espacio (~50-100 MB)
3. **Memoria**: El proceso puede requerir 1-2 GB de RAM
4. **Duplicados**: El script automáticamente omite colonias duplicadas

### Verificación

Después de la importación, verifica que los datos se cargaron correctamente:

```bash
# Desde MongoDB shell o Compass
db.colonias.countDocuments()
# Debería mostrar ~100,000 documentos

# Buscar colonias por código postal
db.colonias.find({ codigoPostal: "03100" })
```

### Datos de Ejemplo

El proyecto incluye 18 colonias de ejemplo en `backend/scripts/seedColonias.js` para:
- Ciudad de México (Benito Juárez, Cuauhtémoc)
- Guadalajara, Jalisco
- Monterrey, Nuevo León

Para cargar solo los datos de ejemplo:
```bash
cd backend
node scripts/seedColonias.js
```

## Troubleshooting

### Error: "Estado no encontrado" o "Municipio no encontrado"

Asegúrate de que los nombres en el CSV coincidan exactamente con los nombres en tu base de datos. El script hace coincidencias case-insensitive, pero los nombres deben ser idénticos.

### Error: "Archivo no encontrado"

Verifica que el archivo CSV esté en la ubicación correcta:
```bash
ls -la backend/data/colonias.csv
```

### Importación muy lenta

Esto es normal para archivos grandes. El script procesa en lotes de 1000 registros y muestra el progreso cada 10,000 registros.

### Memoria insuficiente

Si encuentras errores de memoria, puedes:
1. Aumentar el límite de memoria de Node.js:
   ```bash
   node --max-old-space-size=4096 scripts/importColoniasFromCSV.js ./data/colonias.csv
   ```
2. Dividir el archivo CSV en partes más pequeñas

## Mantenimiento

Los datos de códigos postales pueden cambiar con el tiempo. Se recomienda:
- Actualizar los datos cada 6-12 meses
- Verificar el sitio oficial de SEPOMEX para actualizaciones
- Mantener un backup de los datos antes de actualizar
