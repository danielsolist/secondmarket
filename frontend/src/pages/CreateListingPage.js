import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../components/ToastContainer';
import LocationSelector from '../components/LocationSelector';
import FormError from '../components/FormError';

const CreateListingPage = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    precio: '',
    estado: '',
    municipio: '',
    imagenes: []
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [serverError, setServerError] = useState('');

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
  };

  const handleEstadoChange = (value) => {
    setFormData(prev => ({
      ...prev,
      estado: value
    }));
    if (errors.estado) {
      setErrors(prev => ({
        ...prev,
        estado: ''
      }));
    }
    setServerError('');
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
    setServerError('');
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 5) {
      setErrors(prev => ({
        ...prev,
        imagenes: 'Máximo 5 imágenes permitidas'
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      imagenes: files
    }));

    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);

    if (errors.imagenes) {
      setErrors(prev => ({
        ...prev,
        imagenes: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es requerido';
    } else if (formData.titulo.length > 100) {
      newErrors.titulo = 'El título no puede exceder 100 caracteres';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    } else if (formData.descripcion.length > 1000) {
      newErrors.descripcion = 'La descripción no puede exceder 1000 caracteres';
    }

    if (!formData.precio) {
      newErrors.precio = 'El precio es requerido';
    } else if (isNaN(formData.precio) || parseFloat(formData.precio) < 0) {
      newErrors.precio = 'El precio debe ser un número válido mayor o igual a 0';
    }

    if (!formData.estado) {
      newErrors.estado = 'Selecciona un estado';
    }

    if (!formData.municipio) {
      newErrors.municipio = 'Selecciona un municipio';
    }

    if (formData.imagenes.length === 0) {
      newErrors.imagenes = 'Debes subir al menos una imagen';
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
      const formDataToSend = new FormData();
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('precio', formData.precio);
      formDataToSend.append('estado', formData.estado);
      formDataToSend.append('municipio', formData.municipio);
      
      formData.imagenes.forEach((image) => {
        formDataToSend.append('imagenes', image);
      });

      await api.post('/listings', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showSuccess('¡Anuncio creado exitosamente!');
      navigate('/my-listings');
    } catch (error) {
      console.error('Error creating listing:', error);
      showError(
        error.response?.data?.error?.message || 
        'Error al crear el anuncio. Por favor intenta de nuevo.'
      );
    } finally {
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
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          color: '#6366F1',
          marginBottom: '0.5rem'
        }}>
          Crear Anuncio
        </h1>
        <p style={{
          color: '#6B7280',
          marginBottom: '2rem'
        }}>
          Publica tu artículo de segunda mano
        </p>

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

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="titulo" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Título *
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              maxLength={100}
              style={{
                width: '100%',
                padding: '0.625rem',
                border: errors.titulo ? '1px solid #EF4444' : '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            {errors.titulo && (
              <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.titulo}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="descripcion" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Descripción *
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              maxLength={1000}
              rows={5}
              style={{
                width: '100%',
                padding: '0.625rem',
                border: errors.descripcion ? '1px solid #EF4444' : '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
            {errors.descripcion && (
              <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.descripcion}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="precio" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Precio (MXN) *
            </label>
            <input
              type="number"
              id="precio"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              min="0"
              step="0.01"
              style={{
                width: '100%',
                padding: '0.625rem',
                border: errors.precio ? '1px solid #EF4444' : '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            {errors.precio && (
              <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.precio}
              </p>
            )}
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
            <label htmlFor="imagenes" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Imágenes * (máximo 5)
            </label>
            <input
              type="file"
              id="imagenes"
              name="imagenes"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleImageChange}
              style={{
                width: '100%',
                padding: '0.625rem',
                border: errors.imagenes ? '1px solid #EF4444' : '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                background: 'white'
              }}
            />
            {errors.imagenes && (
              <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.imagenes}
              </p>
            )}
            
            {imagePreviews.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: '1rem',
                marginTop: '1rem'
              }}>
                {imagePreviews.map((preview, index) => (
                  <div key={index} style={{
                    position: 'relative',
                    paddingBottom: '100%',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '2px solid #E5E7EB'
                  }}>
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
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
            {loading ? 'Creando anuncio...' : 'Publicar Anuncio'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateListingPage;
