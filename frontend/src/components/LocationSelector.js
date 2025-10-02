import React, { useState, useEffect } from 'react';
import api from '../services/api';

const LocationSelector = ({ 
  estadoValue, 
  municipioValue, 
  onEstadoChange, 
  onMunicipioChange,
  errors = {},
  required = true 
}) => {
  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [loadingEstados, setLoadingEstados] = useState(true);
  const [loadingMunicipios, setLoadingMunicipios] = useState(false);

  // Load estados on mount
  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await api.get('/locations/estados');
        setEstados(response.data.data);
      } catch (error) {
        console.error('Error loading estados:', error);
      } finally {
        setLoadingEstados(false);
      }
    };
    fetchEstados();
  }, []);

  // Load municipios when estado changes
  useEffect(() => {
    if (estadoValue) {
      const fetchMunicipios = async () => {
        setLoadingMunicipios(true);
        try {
          const response = await api.get(`/locations/estados/${estadoValue}/municipios`);
          setMunicipios(response.data.data);
        } catch (error) {
          console.error('Error loading municipios:', error);
        } finally {
          setLoadingMunicipios(false);
        }
      };
      fetchMunicipios();
    } else {
      setMunicipios([]);
    }
  }, [estadoValue]);

  const handleEstadoChange = (e) => {
    const value = e.target.value;
    onEstadoChange(value);
    // Reset municipio when estado changes
    onMunicipioChange('');
  };

  return (
    <>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="estado" style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          Estado {required && '*'}
        </label>
        <select
          id="estado"
          name="estado"
          value={estadoValue}
          onChange={handleEstadoChange}
          disabled={loadingEstados}
          style={{
            width: '100%',
            padding: '0.625rem',
            border: errors.estado ? '1px solid #EF4444' : '1px solid #D1D5DB',
            borderRadius: '8px',
            fontSize: '1rem',
            outline: 'none',
            background: 'white',
            cursor: loadingEstados ? 'not-allowed' : 'pointer'
          }}
        >
          <option value="">
            {loadingEstados ? 'Cargando estados...' : 'Selecciona un estado'}
          </option>
          {estados.map(estado => (
            <option key={estado._id} value={estado._id}>
              {estado.nombre}
            </option>
          ))}
        </select>
        {errors.estado && (
          <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {errors.estado}
          </p>
        )}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="municipio" style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          Municipio {required && '*'}
        </label>
        <select
          id="municipio"
          name="municipio"
          value={municipioValue}
          onChange={(e) => onMunicipioChange(e.target.value)}
          disabled={!estadoValue || loadingMunicipios}
          style={{
            width: '100%',
            padding: '0.625rem',
            border: errors.municipio ? '1px solid #EF4444' : '1px solid #D1D5DB',
            borderRadius: '8px',
            fontSize: '1rem',
            outline: 'none',
            background: 'white',
            cursor: (!estadoValue || loadingMunicipios) ? 'not-allowed' : 'pointer'
          }}
        >
          <option value="">
            {!estadoValue
              ? 'Primero selecciona un estado'
              : loadingMunicipios
              ? 'Cargando municipios...'
              : 'Selecciona un municipio'}
          </option>
          {municipios.map(municipio => (
            <option key={municipio._id} value={municipio._id}>
              {municipio.nombre}
            </option>
          ))}
        </select>
        {errors.municipio && (
          <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {errors.municipio}
          </p>
        )}
      </div>
    </>
  );
};

export default LocationSelector;
