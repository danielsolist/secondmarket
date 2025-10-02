import React, { useState, useEffect } from 'react';
import './PostalCodeSelector.css';

const PostalCodeSelector = ({ value, onChange, error }) => {
  const [codigoPostal, setCodigoPostal] = useState('');
  const [colonias, setColonias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Buscar colonias cuando el código postal tenga 5 dígitos
  useEffect(() => {
    const buscarColonias = async () => {
      if (codigoPostal.length === 5) {
        setLoading(true);
        setSearchError('');
        
        try {
          const response = await fetch(`http://localhost:5000/api/locations/colonias/cp/${codigoPostal}`);
          const data = await response.json();
          
          if (data.success && data.data.length > 0) {
            setColonias(data.data);
          } else {
            setColonias([]);
            setSearchError('No se encontraron colonias para este código postal');
          }
        } catch (error) {
          console.error('Error al buscar colonias:', error);
          setSearchError('Error al buscar colonias');
          setColonias([]);
        } finally {
          setLoading(false);
        }
      } else {
        setColonias([]);
        setSearchError('');
      }
    };

    buscarColonias();
  }, [codigoPostal]);

  const handleCodigoPostalChange = (e) => {
    const valor = e.target.value.replace(/\D/g, '').slice(0, 5);
    setCodigoPostal(valor);
    
    // Limpiar selección si cambia el CP
    if (onChange) {
      onChange({
        codigoPostal: valor,
        colonia: null,
        estado: null,
        municipio: null
      });
    }
  };

  const handleColoniaChange = (e) => {
    const coloniaId = e.target.value;
    const coloniaSeleccionada = colonias.find(c => c._id === coloniaId);
    
    if (coloniaSeleccionada && onChange) {
      onChange({
        codigoPostal,
        colonia: coloniaSeleccionada._id,
        coloniaObj: coloniaSeleccionada,
        estado: coloniaSeleccionada.estado._id,
        estadoObj: coloniaSeleccionada.estado,
        municipio: coloniaSeleccionada.municipio._id,
        municipioObj: coloniaSeleccionada.municipio
      });
    }
  };

  return (
    <div className="postal-code-selector">
      <div className="form-group">
        <label htmlFor="codigoPostal">Código Postal *</label>
        <input
          type="text"
          id="codigoPostal"
          value={codigoPostal}
          onChange={handleCodigoPostalChange}
          placeholder="Ej: 03100"
          maxLength="5"
          className={error ? 'error' : ''}
        />
        {loading && <span className="loading-text">Buscando colonias...</span>}
        {searchError && <span className="error-text">{searchError}</span>}
      </div>

      {colonias.length > 0 && (
        <div className="form-group">
          <label htmlFor="colonia">Colonia *</label>
          <select
            id="colonia"
            value={value?.colonia || ''}
            onChange={handleColoniaChange}
            className={error ? 'error' : ''}
          >
            <option value="">Selecciona una colonia</option>
            {colonias.map(colonia => (
              <option key={colonia._id} value={colonia._id}>
                {colonia.nombre}
              </option>
            ))}
          </select>
        </div>
      )}

      {value?.estadoObj && value?.municipioObj && (
        <div className="location-info">
          <p>
            <strong>Municipio:</strong> {value.municipioObj.nombre}
          </p>
          <p>
            <strong>Estado:</strong> {value.estadoObj.nombre}
          </p>
        </div>
      )}

      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

export default PostalCodeSelector;
