import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './ToastContainer';
import api from '../services/api';
import './InterestButton.css';

const InterestButton = ({ listingId, onSuccess }) => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleOpenModal = () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setMensaje('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/interests', {
        listing: listingId,
        mensaje: mensaje.trim() || undefined
      });
      
      showSuccess('¡Interés enviado! El vendedor recibirá tu información.');
      handleCloseModal();
      if (onSuccess) onSuccess();
    } catch (err) {
      showError(
        err.response?.data?.error?.message || 
        'Error al expresar interés. Intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        className="interest-button"
        onClick={handleOpenModal}
        disabled={loading}
      >
        <span className="interest-button-icon">💬</span>
        <span>Estoy interesado</span>
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Expresar interés</h3>
              <button 
                className="modal-close"
                onClick={handleCloseModal}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            {success ? (
              <div className="modal-body">
                <div className="success-message">
                  <span className="success-icon">✓</span>
                  <p>¡Interés enviado! El vendedor recibirá tu información de contacto.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <p className="modal-description">
                    El vendedor recibirá tu información de contacto. 
                    Opcionalmente puedes agregar un mensaje.
                  </p>

                  <div className="form-group">
                    <label htmlFor="mensaje">Mensaje (opcional)</label>
                    <textarea
                      id="mensaje"
                      value={mensaje}
                      onChange={(e) => setMensaje(e.target.value)}
                      placeholder="Ej: Hola, me interesa tu producto..."
                      rows="4"
                      maxLength="500"
                      disabled={loading}
                    />
                    <small className="char-count">
                      {mensaje.length}/500 caracteres
                    </small>
                  </div>

                  {error && (
                    <div className="error-message">
                      {error}
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleCloseModal}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Enviando...' : 'Enviar interés'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default InterestButton;
