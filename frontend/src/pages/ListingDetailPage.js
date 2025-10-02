import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ImageGallery from '../components/ImageGallery';
import ShareButtons from '../components/ShareButtons';
import InterestButton from '../components/InterestButton';
import { formatPrice, formatDate } from '../utils/helpers';
import './ListingDetailPage.css';

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/listings/${id}`);
      const listingData = response.data.data.listing;
      
      // Transform image URLs to full URLs
      const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
      if (listingData.imagenes) {
        listingData.imagenes = listingData.imagenes.map(img => `${baseUrl}${img}`);
      }
      
      setListing(listingData);
      setError('');
    } catch (err) {
      setError(
        err.response?.data?.error?.message || 
        'Error al cargar el anuncio'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInterestSuccess = () => {
    // Optional: Show a success message or update UI
    console.log('Interés enviado exitosamente');
  };

  if (loading) {
    return (
      <div className="listing-detail-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando anuncio...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="listing-detail-container">
        <div className="error-state">
          <h2>Error</h2>
          <p>{error || 'Anuncio no encontrado'}</p>
          <button onClick={() => navigate('/')} className="btn-back">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user && listing.usuario._id === user.id;
  const canShowInterest = user && !isOwner;

  return (
    <div className="listing-detail-container">
      <div className="listing-detail-content">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Volver
        </button>

        <div className="listing-detail-grid">
          <div className="listing-detail-main">
            <ImageGallery images={listing.imagenes} />

            <div className="listing-info">
              <div className="listing-header">
                <h1>{listing.titulo}</h1>
                <div className="listing-meta">
                  <span className="listing-views">
                    👁️ {listing.vistas} {listing.vistas === 1 ? 'vista' : 'vistas'}
                  </span>
                  <span className="listing-date">
                    Publicado {formatDate(listing.createdAt)}
                  </span>
                </div>
              </div>

              <div className="listing-price">
                {formatPrice(listing.precio)}
              </div>

              <div className="listing-description">
                <h2>Descripción</h2>
                <p>{listing.descripcion}</p>
              </div>

              <div className="listing-location">
                <h2>Ubicación</h2>
                <p>
                  📍 {listing.municipio.nombre}, {listing.estado.nombre}
                </p>
              </div>

              <ShareButtons 
                title={listing.titulo}
                url={window.location.href}
              />
            </div>
          </div>

          <div className="listing-detail-sidebar">
            <div className="seller-card">
              <h3>Vendedor</h3>
              <div className="seller-info">
                <div className="seller-avatar">
                  {listing.usuario.nombre ? listing.usuario.nombre.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="seller-details">
                  <p className="seller-name">
                    {listing.usuario.nombre || 'Usuario'}
                  </p>
                  <p className="seller-location">
                    {listing.usuario.municipio?.nombre}, {listing.usuario.estado?.nombre}
                  </p>
                </div>
              </div>

              {canShowInterest && (
                <div className="interest-section">
                  <InterestButton 
                    listingId={listing._id}
                    onSuccess={handleInterestSuccess}
                  />
                </div>
              )}

              {isOwner && (
                <div className="owner-actions">
                  <p className="owner-badge">Este es tu anuncio</p>
                  <button 
                    onClick={() => navigate(`/listings/${listing._id}/edit`)}
                    className="btn-edit"
                  >
                    Editar anuncio
                  </button>
                </div>
              )}

              {!user && (
                <div className="login-prompt">
                  <p>¿Te interesa este producto?</p>
                  <button 
                    onClick={() => navigate('/login')}
                    className="btn-login"
                  >
                    Iniciar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;
