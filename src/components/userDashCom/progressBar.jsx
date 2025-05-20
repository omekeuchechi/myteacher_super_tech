import React from 'react';

const ProgressBar = ({ progress, color }) => {
  const containerStyles = {
    height: '20px',
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: '10px',
    overflow: 'hidden',
  };

  const fillerStyles = {
    height: '100%',
    width: `${progress}%`,
    backgroundColor: `${color}`,
    transition: 'width 0.3s ease',
    borderRadius: '10px 0 0 10px',
  };

  return (
    <div style={containerStyles}>
      <div style={fillerStyles} />
    </div>
  );
};

export default ProgressBar;