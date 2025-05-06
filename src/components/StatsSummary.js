import React from 'react';

const StatsSummary = ({ stats }) => {
  return (
    <div className="stats-summary">
      {stats && (
        <div className="stats-grid">
          <div className="stat-item">
            <h3>Necessary</h3>
            <div className="stat-value">{stats.necessary || 0}%</div>
          </div>
          <div className="stat-item">
            <h3>Preferences</h3>
            <div className="stat-value">{stats.preferences || 0}%</div>
          </div>
          <div className="stat-item">
            <h3>Statistics</h3>
            <div className="stat-value">{stats.statistics || 0}%</div>
          </div>
          <div className="stat-item">
            <h3>Marketing</h3>
            <div className="stat-value">{stats.marketing || 0}%</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsSummary;