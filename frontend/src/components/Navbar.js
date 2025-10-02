import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          SecondMarket
        </Link>
        
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">
            Inicio
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/my-listings" className="navbar-link">
                Mis Anuncios
              </Link>
              <Link to="/create-listing" className="navbar-link">
                Publicar
              </Link>
              <Link to="/interests" className="navbar-link">
                Intereses
              </Link>
              <Link to="/profile" className="navbar-link">
                Perfil
              </Link>
              <button onClick={logout} className="navbar-button">
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="navbar-button-link">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
