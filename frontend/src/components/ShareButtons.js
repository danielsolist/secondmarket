import React, { useState } from 'react';
import './ShareButtons.css';

const ShareButtons = ({ title, url }) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || window.location.href;
  const shareText = title || 'Mira este anuncio en SecondMarket';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`
  };

  return (
    <div className="share-section">
      <h3>Compartir anuncio</h3>
      <div className="share-buttons">
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="share-button facebook"
          aria-label="Compartir en Facebook"
        >
          <span className="share-button-icon">f</span>
          <span>Facebook</span>
        </a>
        
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="share-button whatsapp"
          aria-label="Compartir en WhatsApp"
        >
          <span className="share-button-icon">💬</span>
          <span>WhatsApp</span>
        </a>
        
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="share-button twitter"
          aria-label="Compartir en Twitter"
        >
          <span className="share-button-icon">🐦</span>
          <span>Twitter</span>
        </a>
        
        <a
          href={shareLinks.email}
          className="share-button email"
          aria-label="Compartir por correo"
        >
          <span className="share-button-icon">✉️</span>
          <span>Correo</span>
        </a>
        
        <button
          onClick={handleCopyLink}
          className={`share-button copy ${copied ? 'copied' : ''}`}
          aria-label="Copiar enlace"
        >
          <span className="share-button-icon">{copied ? '✓' : '🔗'}</span>
          <span>{copied ? '¡Copiado!' : 'Copiar URL'}</span>
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;
