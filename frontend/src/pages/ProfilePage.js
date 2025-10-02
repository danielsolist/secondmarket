import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastContainer';
import api from '../services/api';
import LocationSelector from '../components/LocationSelector';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    telefono: '',
    estado: '',
    municipio: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        nombre: user.nombre || '',
        telefono: user.telefono || '',
        estado: user.estado?._id || '',
        municipio: user.municipio?._id || '',
        password: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setServerError('');
    setSuccessMessage('');
  };

  const handleEstadoChange = (value) => {
    setFormData(prev => ({
      ...prev,
      estado: value,
      municipio: ''
    }));
    if (errors.estado) {
      setErrors(prev => ({
        ...prev,
        estado: ''
      }));
    }
  };

  const handleMunicipioChange = (value) => {
    setFormData(prev => ({
      ...prev,
      municipio: value
    }));
    if (errors.municipio) {
      setErrors(prev => ({
        ...prev,
        municipio: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    if (formData.password && formData.password.length !== 8) {
      newErrors.password = 'La contraseña debe tener exactamente 8 caracteres';
    }

    if (!formData.estado) {
      newErrors.estado = 'Selecciona un estado';
    }

    if (!formData.municipio) {
      newErrors.municipio = 'Selecciona un municipio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const updateData = {
        email: formData.email,
        nombre: formData.nombre,
        telefono: formData.telefono,
        estado: formData.estado,
        municipio: formData.municipio
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await api.put(`/users/${user._id}`, updateData);
      
      updateUser(response.data.data.user);
      showSuccess('Perfil actualizado exitosamente');
      setIsEditing(false);
      setFormData(prev => ({ ...prev, password: '' }));
    } catch (error) {
      console.error('Error updating profile:', error);
      showError(
        error.response?.data?.error?.message || 
        'Error al actualizar el perfil. Por favor intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);

    try {
      await api.delete(`/users/${user._id}`);
      showSuccess('Cuenta eliminada exitosamente');
      logout();
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      showError(
        error.response?.data?.error?.message || 
        'Error al dar de baja la cuenta. Por favor intenta de nuevo.'
      );
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '2rem auto' }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: '#6366F1',
            margin: 0
          }}>
            Mi Perfil
          </h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              style={{
                background: '#6366F1',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              Editar Perfil
            </button>
          )}
        </div>

        {successMessage && (
          <div style={{
            background: '#D1FAE5',
            border: '1px solid #10B981',
            color: '#065F46',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}>
            {successMessage}
          </div>
        )}

        {serverError && (
          <div style={{
            background: '#FEE2E2',
            border: '1px solid #EF4444',
            color: '#991B1B',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}>
            {serverError}
          </div>
        )}

        {!isEditing ? (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#6B7280',
                marginBottom: '0.25rem'
              }}>
                Correo Electrónico
              </label>
              <p style={{
                fontSize: '1rem',
                color: '#374151',
                margin: 0
              }}>
                {user?.email}
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#6B7280',
                marginBottom: '0.25rem'
              }}>
                Nombre
              </label>
              <p style={{
                fontSize: '1rem',
                color: '#374151',
                margin: 0
              }}>
                {user?.nombre || 'No especificado'}
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#6B7280',
                marginBottom: '0.25rem'
              }}>
                Teléfono
              </label>
              <p style={{
                fontSize: '1rem',
                color: '#374151',
                margin: 0
              }}>
                {user?.telefono || 'No especificado'}
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#6B7280',
                marginBottom: '0.25rem'
              }}>
                Ubicación
              </label>
              <p style={{
                fontSize: '1rem',
                color: '#374151',
                margin: 0
              }}>
                {user?.municipio?.nombre}, {user?.estado?.nombre}
              </p>
            </div>

            <div style={{
              borderTop: '1px solid #E5E7EB',
              paddingTop: '1.5rem',
              marginTop: '2rem'
            }}>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                style={{
                  background: '#EF4444',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                Dar de Baja Cuenta
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="email" style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Correo Electrónico *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: errors.email ? '1px solid #EF4444' : '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
              {errors.email && (
                <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {errors.email}
                </p>
              )}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="nombre" style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="telefono" style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Teléfono
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>

            <LocationSelector
              estadoValue={formData.estado}
              municipioValue={formData.municipio}
              onEstadoChange={handleEstadoChange}
              onMunicipioChange={handleMunicipioChange}
              errors={errors}
              required={true}
            />

            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="password" style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Nueva Contraseña (dejar en blanco para no cambiar)
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                maxLength={8}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: errors.password ? '1px solid #EF4444' : '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
              {errors.password && (
                <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {errors.password}
                </p>
              )}
              <p style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                marginTop: '0.25rem'
              }}>
                La contraseña debe tener exactamente 8 caracteres
              </p>
            </div>

            <div style={{
              display: 'flex',
              gap: '1rem'
            }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  background: loading ? '#9CA3AF' : '#6366F1',
                  color: 'white',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setErrors({});
                  setServerError('');
                  setFormData({
                    email: user?.email || '',
                    nombre: user?.nombre || '',
                    telefono: user?.telefono || '',
                    estado: user?.estado?._id || '',
                    municipio: user?.municipio?._id || '',
                    password: ''
                  });
                }}
                style={{
                  flex: 1,
                  background: '#E5E7EB',
                  color: '#374151',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>

      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#374151',
              marginBottom: '1rem'
            }}>
              ¿Confirmar baja de cuenta?
            </h2>
            <p style={{
              color: '#6B7280',
              marginBottom: '1.5rem'
            }}>
              Esta acción desactivará tu cuenta y no podrás acceder a ella. ¿Estás seguro?
            </p>
            <div style={{
              display: 'flex',
              gap: '1rem'
            }}>
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                style={{
                  flex: 1,
                  background: loading ? '#9CA3AF' : '#EF4444',
                  color: 'white',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Procesando...' : 'Sí, dar de baja'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
                style={{
                  flex: 1,
                  background: '#E5E7EB',
                  color: '#374151',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
