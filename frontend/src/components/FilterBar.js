import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './FilterBar.css';

const FilterBar = ({ onFilterChange }) => {
  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [selectedEstado, setSelectedEstado] = useState('');
  const [selectedMunicipio, setSelectedMunicipio] = useState('');
  const [searchText, setSearchText] = useState('');

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
    // Notify parent component of filter changes
    onFilterChange({
      estado: selectedEstado,
      municipio: selectedMunicipio,
      search: searchText,
    });
  }, [selectedEstado, selectedMunicipio, searchText, onFilterChange]);

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

  const handleClearFilters = () => {
    setSelectedEstado('');
    setSelectedMunicipio('');
    setSearchText('');
  };

  const hasActiveFilters = selectedEstado || selectedMunicipio || searchText;

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
          <label htmlFor="estado">Estado</label>
          <select
            id="estado"
            value={selectedEstado}
            onChange={handleEstadoChange}
            className="filter-select"
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
            disabled={!selectedEstado}
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
