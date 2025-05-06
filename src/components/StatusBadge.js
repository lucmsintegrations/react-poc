import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ status, label, className }) => {
  const getStatusClass = () => {
    switch (status) {
      case 'success':
        return 'status-success';
      case 'warning':
        return 'status-warning';
      case 'error':
        return 'status-error';
      case 'info':
        return 'status-info';
      case 'pending':
        return 'status-pending';
      default:
        return 'status-default';
    }
  };

  return (
    <span className={`status-badge ${getStatusClass()} ${className || ''}`}>
      {label}
    </span>
  );
};

export default StatusBadge; 