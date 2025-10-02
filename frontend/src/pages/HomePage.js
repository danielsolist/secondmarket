import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import ListingCard from '../components/ListingCard';
import FilterBar from '../components/FilterBar';
import Loading from '../components/Loading';
import './HomePage.css';

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    estado: '',
    municipio: '',
    search: '',
  });

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [listings, filters]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/listings');
      // El backend devuelve { success: true, data: { listings: [], pagination: {} } }
      setListings(response.data.data?.listings || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setError('Error al cargar los anuncios. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...listings];

    // Filter by estado
    if (filters.estado) {
      filtered = filtered.filter(
        (listing) => listing.estado?._id === filters.estado
      );
    }

    // Filter by municipio
    if (filters.municipio) {
      filtered = filtered.filter(
        (listing) => listing.municipio?._id === filters.municipio
      );
    }

    // Filter by search text
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (listing) =>
          listing.titulo?.toLowerCase().includes(searchLower) ||
          listing.descripcion?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredListings(filtered);
  }, [listings, filters]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  if (loading) {
    return <Loading fullScreen message="Cargando anuncios..." />;
  }

  if (error) {
    return (
      <div className="home-page">
        <div className="home-container">
          <div className="error-state">
            <p>{error}</p>
            <button onClick={fetchListings} className="retry-btn">
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-header">
          <h1>Encuentra lo que buscas</h1>
          <p>Explora miles de productos de segunda mano en México</p>
        </div>

        <FilterBar onFilterChange={handleFilterChange} />

        {filteredListings.length === 0 ? (
          <div className="empty-state">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <h2>No se encontraron anuncios</h2>
            <p>
              {filters.estado || filters.municipio || filters.search
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Aún no hay anuncios publicados'}
            </p>
          </div>
        ) : (
          <>
            <div className="results-count">
              {filteredListings.length}{' '}
              {filteredListings.length === 1 ? 'anuncio' : 'anuncios'}{' '}
              {filters.estado || filters.municipio || filters.search
                ? 'encontrados'
                : 'disponibles'}
            </div>
            <div className="listings-grid">
              {filteredListings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
