import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastContainer';
import PostalCodeSelector from '../components/PostalCodeSelector';
import FormError from '../components/FormError';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    telefono: '',
    codigoPostal: '',
    colonia: '',
    estado: '',
    municipio: ''
  });
  
  const [locationData, setLocationData] = useState(null);
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
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
  };

  const handleLocationChange = (data) => {
    setLocationData(data);
    setFormData(prev => ({
      ...prev,
      codigoPostal: data.codigoPostal || '',
      colonia: data.colonia || '',
      estado: data.estado || '',
      municipio: data.municipio || ''
    }));
    
    // Limpiar errores de ubicación
    if (errors.codigoPostal || errors.colonia || errors.estado || errors.municipio) {
      setErrors(prev => ({
        ...prev,
        codigoPostal: '',
        colonia: '',
        estado: '',
        municipio: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length !== 8) {
      newErrors.password = 'La contraseña debe tener exactamente 8 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.codigoPostal) {
      newErrors.codigoPostal = 'El código postal es requerido';
    } else if (formData.codigoPostal.length !== 5) {
      newErrors.codigoPostal = 'El código postal debe tener 5 dígitos';
    }

    if (!formData.colonia) {
      newErrors.colonia = 'Selecciona una colonia';
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

    const { confirmPassword, ...registerData } = formData;

    const result = await register(registerData);

    if (result.success) {
      showSuccess('¡Cuenta creada exitosamente!');
      navigate('/');
    } else {
      showError(result.error || 'Error al crear la cuenta');
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '2rem auto' }}>
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
          marginBottom: '0.5rem',
          textAlign: 'center'
        }}>
          Crear Cuenta
        </h1>
        <p style={{
          color: '#6B7280',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          Únete a SecondMarket
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
            <FormError message={errors.email} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="password" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Contraseña * (exactamente 8 caracteres)
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
            <FormError message={errors.password} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="confirmPassword" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Confirmar Contraseña *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              maxLength={8}
              style={{
                width: '100%',
                padding: '0.625rem',
                border: errors.confirmPassword ? '1px solid #EF4444' : '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            <FormError message={errors.confirmPassword} />
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
          <PostalCodeSelector
            value={locationData}
            onChange={handleLocationChange}
            error={errors.codigoPostal || errors.colonia}
          />

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
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          color: '#6B7280',
          fontSize: '0.875rem'
        }}>
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" style={{
            color: '#6366F1',
            fontWeight: '500',
            textDecoration: 'none'
          }}>
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
