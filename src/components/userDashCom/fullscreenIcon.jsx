import React, { useState } from 'react';

const FullscreenIcon = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => console.error('Failed to enter fullscreen:', err));
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch((err) => console.error('Failed to exit fullscreen:', err));
    }
  };

  return (
    <button 
      onClick={toggleFullscreen} 
      style={{ 
        fontSize: '20px', 
        background: 'none', 
        border: 'none', 
        cursor: 'pointer', 
        color: '#fff' 
      }}
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      <i className={`fas fa-${isFullscreen ? 'compress' : 'expand'}`} />
    </button>
  );
};

export default FullscreenIcon;
