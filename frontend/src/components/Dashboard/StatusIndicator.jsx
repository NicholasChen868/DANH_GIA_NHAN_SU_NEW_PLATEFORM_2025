import React from 'react';
import './StatusIndicator.css';

const StatusIndicator = ({ type, completed, label, variant = 'default' }) => {
  const getStatusConfig = () => {
    const configs = {
      A: {
        icon: completed ? '✅' : '⚠️',
        color: completed ? '#10b981' : '#f59e0b',
        bgColor: completed ? '#d1fae5' : '#fef3c7',
        shortLabel: 'Form A',
        fullLabel: 'Hồi ức cấp 3'
      },
      B: {
        icon: completed ? '✅' : '⚠️',
        color: completed ? '#10b981' : '#f59e0b',
        bgColor: completed ? '#d1fae5' : '#fef3c7',
        shortLabel: 'Form B',
        fullLabel: 'Năng lực cá nhân'
      },
      C: {
        icon: completed ? '✅' : '⚠️',
        color: completed ? '#10b981' : '#f59e0b',
        bgColor: completed ? '#d1fae5' : '#fef3c7',
        shortLabel: 'Form C',
        fullLabel: 'Đánh giá 360°'
      }
    };
    
    return configs[type] || configs.A;
  };

  const config = getStatusConfig();
  const displayLabel = label || (variant === 'compact' ? config.shortLabel : config.fullLabel);

  if (variant === 'compact') {
    return (
      <div 
        className={`status-indicator-compact ${completed ? 'completed' : 'pending'}`}
        title={`${config.fullLabel}: ${completed ? 'Đã hoàn thành' : 'Chưa hoàn thành'}`}
        style={{
          color: config.color,
          backgroundColor: config.bgColor
        }}
      >
        <span className="status-icon">{config.icon}</span>
        <span className="status-text">{config.shortLabel}</span>
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div 
        className={`status-badge ${completed ? 'completed' : 'pending'}`}
        style={{
          color: config.color,
          backgroundColor: config.bgColor,
          border: `1px solid ${config.color}20`
        }}
      >
        {config.icon}
      </div>
    );
  }

  return (
    <div 
      className={`status-indicator ${completed ? 'completed' : 'pending'}`}
      style={{
        color: config.color,
        backgroundColor: config.bgColor
      }}
    >
      <div className="status-icon-wrapper">
        <span className="status-icon">{config.icon}</span>
      </div>
      <div className="status-content">
        <div className="status-label">{displayLabel}</div>
        <div className="status-state">
          {completed ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
        </div>
      </div>
    </div>
  );
};

export const FormProgressBar = ({ formStatus, variant = 'default' }) => {
  const totalForms = 3;
  const completedCount = Object.values(formStatus).filter(Boolean).length;
  const progressPercentage = (completedCount / totalForms) * 100;

  const getProgressColor = () => {
    if (progressPercentage === 100) return '#10b981'; // Green
    if (progressPercentage >= 66) return '#3b82f6'; // Blue
    if (progressPercentage >= 33) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  if (variant === 'compact') {
    return (
      <div className="form-progress-compact">
        <div className="progress-text" style={{ color: getProgressColor() }}>
          {completedCount}/{totalForms} forms
        </div>
        <div className="progress-bar-mini">
          <div 
            className="progress-fill-mini"
            style={{ 
              width: `${progressPercentage}%`,
              backgroundColor: getProgressColor()
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="form-progress-bar">
      <div className="progress-header">
        <div className="progress-label">Tiến độ hoàn thành</div>
        <div className="progress-count" style={{ color: getProgressColor() }}>
          {completedCount}/{totalForms} forms
        </div>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ 
            width: `${progressPercentage}%`,
            backgroundColor: getProgressColor()
          }}
        />
      </div>
      <div className="progress-percentage" style={{ color: getProgressColor() }}>
        {progressPercentage.toFixed(0)}% hoàn thành
      </div>
    </div>
  );
};

export default StatusIndicator;