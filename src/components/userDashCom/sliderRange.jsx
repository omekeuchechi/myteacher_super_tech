import React from 'react';

const RangeSlider = (props) => {
  const percentage = ((props.value - props.min) / (props.max - props.min)) * 100;

  const rangerStyle = {
    background: `linear-gradient(90deg, var(--primary-600) 0%, var(--orange-500) ${percentage}%, ${props.secondaryBgColor ? props.secondaryBgColor : 'var(--default-color)'} ${percentage + 0.1}%)`,
  };

  return (
    <input
      className={`range-slider-input ${props.customClasses || ''}`}
      style={rangerStyle}
      type="range"
      value={props.value}
      min={props.min}
      max={props.max}
      onChange={props.onChange}
      disabled={props.disabled}
    />
  );
};

export default RangeSlider;