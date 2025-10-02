import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './FilterBar.css';

const FilterBar = ({ onFilterChange }) => {
  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [colonias, setColonias] = useState([]);
  const [selectedEstado, setSelectedEstado] = useState('');
  const [selectedMunicipio, setSelectedMunicipio] = useState('');
  const [selectedColonia, setSelectedColonia] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [searchText, setSearchText] = useState('');
  const [loadingColonias, setLoadingColonias] = useState(false);

  useEffect(() => {
    fetchEstados();
  }, []);

  useEffect(() => {
    if (selectedEstado) {
      fetchMunicipios(selectedEstado);
    } else {
      setMunicipios([]);
      setSelectedMunicipio('');
    }
  }, [selectedEstado]);

  useEffect(() => {
    // Buscar colonias cuando el código postal tenga 5 dígitos
    if (codigoPostal.length === 5) {
      fetchColonias(codigoPostal);
    } else {
      setColonias([]);
      setSelectedColonia('');
    }
  }, [codigoPostal]);

  useEffect(() => {
    // Notify parent component of filter changes
    onFilterChange({
      estado: selectedEstado,
      municipio: selectedMunicipio,
      colonia: selectedColonia,
      codigoPostal: codigoPostal.length === 5 ? codigoPostal : '',
      search: searchText,
    });
  }, [selectedEstado, selectedMunicipio, selectedColonia, codigoPostal, searchText, onFilterChange]);

  const fetchEstados = async () => {
    try {
      const response = await api.get('/locations/estados');
      setEstados(response.data.data || []);
    } catch (error) {
      console.error('Error fetching estados:', error);
    }
  };

  const fetchMunicipios = async (estadoId) => {
    try {
      const response = await api.get(`/locations/estados/${estadoId}/municipios`);
      setMunicipios(response.data.data || []);
    } catch (error) {
      console.error('Error fetching municipios:', error);
    }
  };

  const fetchColonias = async (cp) => {
    setLoadingColonias(true);
    try {
      const response = await api.get(`/locations/colonias/cp/${cp}`);
      const coloniasData = response.data.data || [];
      setColonias(coloniasData);
      
      // Si hay colonias, auto-seleccionar estado y municipio de la primera
      if (coloniasData.length > 0) {
        const primeraColonia = coloniasData[0];
        setSelectedEstado(primeraColonia.estado._id);
        setSelectedMunicipio(primeraColonia.municipio._id);
      }
    } catch (error) {
      console.error('Error fetching colonias:', error);
      setColonias([]);
    } finally {
      setLoadingColonias(false);
    }
  };

  const handleEstadoChange = (e) => {
    setSelectedEstado(e.target.value);
    setSelectedMunicipio('');
  };

  const handleMunicipioChange = (e) => {
    setSelectedMunicipio(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleCodigoPostalChange = (e) => {
    const valor = e.target.value.replace(/\D/g, '').slice(0, 5);
    setCodigoPostal(valor);
    if (valor.length !== 5) {
      setSelectedColonia('');
    }
  };

  const handleColoniaChange = (e) => {
    setSelectedColonia(e.target.value);
  };

  const handleClearFilters = () => {
    setSelectedEstado('');
    setSelectedMunicipio('');
    setSelectedColonia('');
    setCodigoPostal('');
    setSearchText('');
  };

  const hasActiveFilters = selectedEstado || selectedMunicipio || selectedColonia || codigoPostal || searchText;

  return (
    <div className="filter-bar">
      <div className="filter-bar-content">
        <div className="filter-group">
          <label htmlFor="search">Buscar</label>
          <input
            id="search"
            type="text"
            placeholder="Buscar anuncios..."
            value={searchText}
            onChange={handleSearchChange}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="codigoPostal">Código Postal</label>
          <input
            id="codigoPostal"
            type="text"
            placeholder="Ej: 03100"
            value={codigoPostal}
            onChange={handleCodigoPostalChange}
            className="filter-input"
            maxLength="5"
          />
          {loadingColonias && <span className="loading-text">Buscando...</span>}
        </div>

        {colonias.length > 0 && (
          <div className="filter-group">
            <label htmlFor="colonia">Colonia</label>
            <select
              id="colonia"
              value={selectedColonia}
              onChange={handleColoniaChange}
              className="filter-select"
            >
              <option value="">Todas las colonias</option>
              {colonias.map((colonia) => (
                <option key={colonia._id} value={colonia._id}>
                  {colonia.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="filter-group">
          <label htmlFor="estado">Estado</label>
          <select
            id="estado"
            value={selectedEstado}
            onChange={handleEstadoChange}
            className="filter-select"
            disabled={codigoPostal.length === 5}
          >
            <option value="">Todos los estados</option>
            {estados.map((estado) => (
              <option key={estado._id} value={estado._id}>
                {estado.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="municipio">Municipio</label>
          <select
            id="municipio"
            value={selectedMunicipio}
            onChange={handleMunicipioChange}
            className="filter-select"
            disabled={!selectedEstado || codigoPostal.length === 5}
          >
            <option value="">Todos los municipios</option>
            {municipios.map((municipio) => (
              <option key={municipio._id} value={municipio._id}>
                {municipio.nombre}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button onClick={handleClearFilters} className="filter-clear-btn">
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
