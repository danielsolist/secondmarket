import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastContainer';
import api from '../services/api';
import { formatPrice, formatDate } from '../utils/helpers';
import Loading from '../components/Loading';

const MyListingsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ show: false, listingId: null, titulo: '' });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchMyListings();
  }, [user]);

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/listings/user/${user._id}`);
      setListings(response.data.data?.listings || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setError('Error al cargar tus anuncios');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (listingId) => {
    navigate(`/edit-listing/${listingId}`);
  };

  const handleDeleteClick = (listing) => {
    setDeleteModal({
      show: true,
      listingId: listing._id,
      titulo: listing.titulo
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true);
      await api.delete(`/listings/${deleteModal.listingId}`);
      setListings(listings.filter(l => l._id !== deleteModal.listingId));
      setDeleteModal({ show: false, listingId: null, titulo: '' });
      showSuccess('Anuncio eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting listing:', error);
      showError('Error al eliminar el anuncio');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ show: false, listingId: null, titulo: '' });
  };

  if (loading) {
    return <Loading message="Cargando tus anuncios..." />;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          color: '#1F2937'
        }}>
          Mis Anuncios
        </h1>
        <button
          onClick={() => navigate('/create-listing')}
          style={{
            background: '#6366F1',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = '#4F46E5'}
          onMouseLeave={(e) => e.target.style.background = '#6366F1'}
        >
          + Crear Anuncio
        </button>
      </div>

      {error && (
        <div style={{
          background: '#FEE2E2',
          border: '1px solid #EF4444',
          color: '#991B1B',
          padding: '0.75rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}

      {listings.length === 0 ? (
        <div style={{
          background: 'white',
          padding: '3rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '1.125rem',
            color: '#6B7280',
            marginBottom: '1.5rem'
          }}>
            No tienes anuncios publicados
          </p>
          <button
            onClick={() => navigate('/create-listing')}
            style={{
              background: '#6366F1',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Crear tu primer anuncio
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {listings.map((listing) => (
            <div
              key={listing._id}
              style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
            >
              <div style={{
                position: 'relative',
                paddingBottom: '75%',
                background: '#F3F4F6',
                overflow: 'hidden'
              }}>
                {listing.imagenes && listing.imagenes.length > 0 ? (
                  <img
                    src={`http://localhost:5000${listing.imagenes[0]}`}
                    alt={listing.titulo}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: '#9CA3AF',
                    fontSize: '0.875rem'
                  }}>
                    Sin imagen
                  </div>
                )}
              </div>

              <div style={{ padding: '1rem' }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1F2937',
                  marginBottom: '0.5rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {listing.titulo}
                </h3>

                <p style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#6366F1',
                  marginBottom: '0.5rem'
                }}>
                  {formatPrice(listing.precio)}
                </p>

                <p style={{
                  fontSize: '0.875rem',
                  color: '#6B7280',
                  marginBottom: '0.25rem'
                }}>
                  📍 {listing.municipio?.nombre}, {listing.estado?.nombre}
                </p>

                <p style={{
                  fontSize: '0.875rem',
                  color: '#9CA3AF',
                  marginBottom: '0.5rem'
                }}>
                  👁️ {listing.vistas || 0} vistas • {formatDate(listing.createdAt)}
                </p>

                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginTop: '1rem'
                }}>
                  <button
                    onClick={() => handleEdit(listing._id)}
                    style={{
                      flex: 1,
                      background: '#6366F1',
                      color: 'white',
                      padding: '0.625rem',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#4F46E5'}
                    onMouseLeave={(e) => e.target.style.background = '#6366F1'}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteClick(listing)}
                    style={{
                      flex: 1,
                      background: '#EF4444',
                      color: 'white',
                      padding: '0.625rem',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#DC2626'}
                    onMouseLeave={(e) => e.target.style.background = '#EF4444'}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '400px',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#1F2937',
              marginBottom: '1rem'
            }}>
              Confirmar eliminación
            </h3>
            <p style={{
              color: '#6B7280',
              marginBottom: '1.5rem'
            }}>
              ¿Estás seguro de que deseas eliminar el anuncio "{deleteModal.titulo}"? Esta acción no se puede deshacer.
            </p>
            <div style={{
              display: 'flex',
              gap: '0.75rem'
            }}>
              <button
                onClick={handleDeleteCancel}
                disabled={deleting}
                style={{
                  flex: 1,
                  background: '#F3F4F6',
                  color: '#374151',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: deleting ? 'not-allowed' : 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                style={{
                  flex: 1,
                  background: deleting ? '#9CA3AF' : '#EF4444',
                  color: 'white',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: deleting ? 'not-allowed' : 'pointer'
                }}
              >
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyListingsPage;
