import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Página no encontrada</h2>
        <p className="not-found-text">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <Link to="/" className="not-found-button">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
