import React from 'react';
import './Loading.css';

const Loading = ({ fullScreen = false, size = 'medium', message = '' }) => {
  const Component = fullScreen ? 'div' : 'div';
  const className = fullScreen ? 'loading-fullscreen' : 'loading-inline';

  return (
    <div className={className}>
      <div className={`loading-spinner loading-${size}`}>
        <div className="spinner"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default Loading;
