// TaskLabel.js (React Component)
import '/styles/label.css';
import React, { useState } from 'react';
import labels from '../../Config/LabelColors'
const TaskLabel = ({ setSelectedLabel, selectedLabel, isVisible }) => {

  if (!isVisible) return null;

  const handleLabelClick = (label) => {
    setSelectedLabel(label);
  };

  return (
    <div className="label-popup-overlay">
      <div className="label-popup">
        <div className="label-options">
          {labels.map((label,idx) => (
            <button
              key={label.color}
              className={`label-option ${selectedLabel === idx ? 'selected' : ''}`}
              style={{ backgroundColor: label.color }}
              onClick={() => handleLabelClick(idx)}
              aria-label={`Select ${label.name} label`}
            >
              {selectedLabel === idx && '✓'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};



export default TaskLabel;
