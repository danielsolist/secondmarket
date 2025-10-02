import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ListingCard.css';

const ListingCard = ({ listing }) => {
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleClick = () => {
    navigate(`/listings/${listing._id}`);
  };

  return (
    <div className="listing-card" onClick={handleClick}>
      <div className="listing-card-image">
        {listing.imagenes && listing.imagenes.length > 0 ? (
          <img
            src={`${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${listing.imagenes[0]}`}
            alt={listing.titulo}
            loading="lazy"
          />
        ) : (
          <div className="listing-card-no-image">Sin imagen</div>
        )}
      </div>
      <div className="listing-card-content">
        <h3 className="listing-card-title">{listing.titulo}</h3>
        <p className="listing-card-price">{formatPrice(listing.precio)}</p>
        <div className="listing-card-location">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>
            {listing.municipio?.nombre}, {listing.estado?.nombre}
          </span>
        </div>
        <p className="listing-card-date">{formatDate(listing.createdAt)}</p>
      </div>
    </div>
  );
};

export default ListingCard;
