import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../components/ToastContainer';
import { formatPrice, formatDate } from '../utils/helpers';
import Loading from '../components/Loading';

const InterestsPage = () => {
  const { showSuccess, showError } = useToast();
  const [activeTab, setActiveTab] = useState('received');
  const [receivedInterests, setReceivedInterests] = useState([]);
  const [sentInterests, setSentInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInterests();
  }, []);

  const fetchInterests = async () => {
    setLoading(true);
    setError('');

    try {
      const [receivedResponse, sentResponse] = await Promise.all([
        api.get('/interests/received'),
        api.get('/interests/sent')
      ]);

      setReceivedInterests(receivedResponse.data.data);
      setSentInterests(sentResponse.data.data);
    } catch (err) {
      console.error('Error fetching interests:', err);
      setError('Error al cargar los intereses. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (interestId) => {
    try {
      await api.put(`/interests/${interestId}/read`);
      
      setReceivedInterests(prev =>
        prev.map(interest =>
          interest._id === interestId
            ? { ...interest, leido: true }
            : interest
        )
      );
      showSuccess('Marcado como leído');
    } catch (err) {
      console.error('Error marking as read:', err);
      showError('Error al marcar como leído');
    }
  };

  const renderReceivedInterests = () => {
    if (receivedInterests.length === 0) {
      return (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#6B7280'
        }}>
          <p>No has recibido intereses aún</p>
        </div>
      );
    }

    return (
      <div style={{
        display: 'grid',
        gap: '1rem'
      }}>
        {receivedInterests.map((interest) => (
          <div
            key={interest._id}
            style={{
              background: interest.leido ? 'white' : '#EEF2FF',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '1.5rem',
              transition: 'box-shadow 0.2s',
              cursor: 'pointer'
            }}
            onClick={() => !interest.leido && handleMarkAsRead(interest._id)}
          >
            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              {interest.listing?.imagenes?.[0] && (
                <Link
                  to={`/listings/${interest.listing._id}`}
                  style={{
                    textDecoration: 'none'
                  }}
                >
                  <img
                    src={`${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${interest.listing.imagenes[0]}`}
                    alt={interest.listing.titulo}
                    style={{
                      width: '120px',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                </Link>
              )}
              
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '0.5rem'
                }}>
                  <Link
                    to={`/listings/${interest.listing?._id}`}
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: 'bold',
                      color: '#6366F1',
                      textDecoration: 'none',
                      marginBottom: '0.25rem'
                    }}
                  >
                    {interest.listing?.titulo}
                  </Link>
                  {!interest.leido && (
                    <span style={{
                      background: '#6366F1',
                      color: 'white',
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px',
                      fontWeight: '500'
                    }}>
                      Nuevo
                    </span>
                  )}
                </div>
                
                <p style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#EC4899',
                  marginBottom: '0.75rem'
                }}>
                  {formatPrice(interest.listing?.precio)}
                </p>

                <div style={{
                  background: '#F9FAFB',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '0.75rem'
                }}>
                  <p style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Interesado:
                  </p>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6B7280',
                    marginBottom: '0.25rem'
                  }}>
                    <strong>Nombre:</strong> {interest.usuarioInteresado?.nombre || 'No especificado'}
                  </p>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6B7280',
                    marginBottom: '0.25rem'
                  }}>
                    <strong>Email:</strong> {interest.usuarioInteresado?.email}
                  </p>
                  {interest.usuarioInteresado?.telefono && (
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#6B7280',
                      marginBottom: '0.25rem'
                    }}>
                      <strong>Teléfono:</strong> {interest.usuarioInteresado.telefono}
                    </p>
                  )}
                  {interest.mensaje && (
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#6B7280',
                      marginTop: '0.5rem',
                      fontStyle: 'italic'
                    }}>
                      "{interest.mensaje}"
                    </p>
                  )}
                </div>

                <p style={{
                  fontSize: '0.75rem',
                  color: '#9CA3AF'
                }}>
                  {formatDate(interest.createdAt)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSentInterests = () => {
    if (sentInterests.length === 0) {
      return (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#6B7280'
        }}>
          <p>No has expresado interés en ningún anuncio aún</p>
        </div>
      );
    }

    return (
      <div style={{
        display: 'grid',
        gap: '1rem'
      }}>
        {sentInterests.map((interest) => (
          <div
            key={interest._id}
            style={{
              background: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '1.5rem',
              transition: 'box-shadow 0.2s'
            }}
          >
            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              {interest.listing?.imagenes?.[0] && (
                <Link
                  to={`/listings/${interest.listing._id}`}
                  style={{
                    textDecoration: 'none'
                  }}
                >
                  <img
                    src={`${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${interest.listing.imagenes[0]}`}
                    alt={interest.listing.titulo}
                    style={{
                      width: '120px',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                </Link>
              )}
              
              <div style={{ flex: 1, minWidth: '200px' }}>
                <Link
                  to={`/listings/${interest.listing?._id}`}
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: 'bold',
                    color: '#6366F1',
                    textDecoration: 'none',
                    display: 'block',
                    marginBottom: '0.25rem'
                  }}
                >
                  {interest.listing?.titulo}
                </Link>
                
                <p style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#EC4899',
                  marginBottom: '0.75rem'
                }}>
                  {formatPrice(interest.listing?.precio)}
                </p>

                <div style={{
                  background: '#F9FAFB',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '0.75rem'
                }}>
                  <p style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Vendedor:
                  </p>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6B7280',
                    marginBottom: '0.25rem'
                  }}>
                    <strong>Nombre:</strong> {interest.vendedor?.nombre || 'No especificado'}
                  </p>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6B7280',
                    marginBottom: '0.25rem'
                  }}>
                    <strong>Email:</strong> {interest.vendedor?.email}
                  </p>
                  {interest.vendedor?.telefono && (
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#6B7280',
                      marginBottom: '0.25rem'
                    }}>
                      <strong>Teléfono:</strong> {interest.vendedor.telefono}
                    </p>
                  )}
                  {interest.mensaje && (
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#6B7280',
                      marginTop: '0.5rem',
                      fontStyle: 'italic'
                    }}>
                      Tu mensaje: "{interest.mensaje}"
                    </p>
                  )}
                </div>

                <p style={{
                  fontSize: '0.75rem',
                  color: '#9CA3AF'
                }}>
                  {formatDate(interest.createdAt)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return <Loading message="Cargando intereses..." />;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1280px', margin: '2rem auto' }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '2rem' }}>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: '#6366F1',
            marginBottom: '0.5rem'
          }}>
            Mis Intereses
          </h1>
          <p style={{
            color: '#6B7280',
            marginBottom: '2rem'
          }}>
            Gestiona los intereses recibidos y enviados
          </p>

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

          <div style={{
            display: 'flex',
            gap: '1rem',
            borderBottom: '2px solid #E5E7EB',
            marginBottom: '2rem'
          }}>
            <button
              onClick={() => setActiveTab('received')}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                fontWeight: '500',
                color: activeTab === 'received' ? '#6366F1' : '#6B7280',
                borderBottom: activeTab === 'received' ? '2px solid #6366F1' : 'none',
                marginBottom: '-2px',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
            >
              Recibidos ({receivedInterests.length})
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                fontWeight: '500',
                color: activeTab === 'sent' ? '#6366F1' : '#6B7280',
                borderBottom: activeTab === 'sent' ? '2px solid #6366F1' : 'none',
                marginBottom: '-2px',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
            >
              Enviados ({sentInterests.length})
            </button>
          </div>

          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: '#6B7280'
            }}>
              <p>Cargando intereses...</p>
            </div>
          ) : (
            <>
              {activeTab === 'received' && renderReceivedInterests()}
              {activeTab === 'sent' && renderSentInterests()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterestsPage;
