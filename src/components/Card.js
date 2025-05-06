import React from 'react';
import './Card.css';

const Card = ({ 
  title, 
  description, 
  icon, 
  children, 
  className,
  actions,
  headerRight
}) => {
  return (
    <div className={`card ${className || ''}`}>
      {(title || icon || headerRight) && (
        <div className="card-header">
          <div className="card-header-left">
            {icon && <div className="card-icon">{icon}</div>}
            <div className="card-header-text">
              {title && <h2 className="card-title">{title}</h2>}
              {description && <p className="card-description">{description}</p>}
            </div>
          </div>
          {headerRight && (
            <div className="card-header-right">
              {headerRight}
            </div>
          )}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
      {actions && (
        <div className="card-actions">
          {actions}
        </div>
      )}
    </div>
  );
};

export default Card; 