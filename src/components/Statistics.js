import React from 'react';

const Statistics = ({ filesUploaded, totalSize, successRate }) => {
  const formatSize = (bytes) => {
    return (bytes / (1024 * 1024)).toFixed(2);
  };

  return (
    <div className="stats">
      <div className="stat-card">
        <h4>Files Uploaded</h4>
        <p>{filesUploaded}</p>
      </div>
      <div className="stat-card">
        <h4>Total Size</h4>
        <p>{formatSize(totalSize)} MB</p>
      </div>
      <div className="stat-card">
        <h4>Success Rate</h4>
        <p>{successRate}%</p>
      </div>
    </div>
  );
};

export default Statistics;
