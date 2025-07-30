import React, { useState } from 'react';
import FormCService from '../services/formCService';
import { APP_CONFIG, MESSAGES, CSS_CLASSES } from '../config/constants';

const EmployeeCard = ({ employee, currentUser, onEvaluationStart }) => {
  const [isGeneratingForm, setIsGeneratingForm] = useState(false);
  const [error, setError] = useState(null);
  
  /**
   * Check evaluation eligibility using configuration
   */
  const canEvaluate = () => {
    if (!currentUser || !employee) return false;
    
    // Self-evaluation check based on configuration
    if (!APP_CONFIG.FEATURES.SELF_EVALUATION && currentUser.id === employee.id) {
      return false;
    }
    
    // Employee evaluation eligibility
    if (!employee.canBeEvaluated) return false;
    
    return true;
  };
  
  /**
   * Handle evaluation click with configuration-based behavior
   */
  const handleEvaluateClick = async () => {
    try {
      setIsGeneratingForm(true);
      setError(null);
      
      // Security check using configuration
      if (!canEvaluate()) {
        throw new Error(MESSAGES.ERRORS.SELF_EVALUATION);
      }
      
      // Optional tracking callback
      if (onEvaluationStart) {
        onEvaluationStart(employee, currentUser);
      }
      
      // Open Form C using service
      const result = await FormCService.openFormC(employee, currentUser);
      
      if (result.success) {
        // Success handled by service
        console.log(result.message);
      } else if (result.reason === 'popup_blocked') {
        // Popup blocked - service handles fallback
        console.log('Popup blocked, fallback triggered');
      }
      
    } catch (error) {
      console.error('Error opening evaluation form:', error);
      setError(error.message);
      
      // Show error using configuration messages
      const errorMessage = `${MESSAGES.ERRORS.FORM_GENERATION}\n${error.message}\nVui lòng thử lại hoặc liên hệ IT support.`;
      alert(errorMessage);
      
    } finally {
      setIsGeneratingForm(false);
    }
  };
  
  /**
   * Get button state using configuration
   */
  const getButtonState = () => {
    if (!canEvaluate()) {
      if (!APP_CONFIG.FEATURES.SELF_EVALUATION && currentUser?.id === employee.id) {
        return { 
          disabled: true, 
          text: `👤 ${MESSAGES.BUTTONS.SELF}`, 
          className: CSS_CLASSES.BUTTONS.DISABLED 
        };
      }
      return { 
        disabled: true, 
        text: `🚫 ${MESSAGES.BUTTONS.CANNOT_EVALUATE}`, 
        className: CSS_CLASSES.BUTTONS.DISABLED 
      };
    }
    
    if (isGeneratingForm) {
      return { 
        disabled: true, 
        text: `🔄 ${MESSAGES.BUTTONS.LOADING}`, 
        className: CSS_CLASSES.BUTTONS.LOADING 
      };
    }
    
    if (error) {
      return { 
        disabled: false, 
        text: `⚠️ ${MESSAGES.BUTTONS.ERROR}`, 
        className: CSS_CLASSES.BUTTONS.ERROR 
      };
    }
    
    return { 
      disabled: false, 
      text: `📝 ${MESSAGES.BUTTONS.EVALUATE}`, 
      className: CSS_CLASSES.BUTTONS.PRIMARY 
    };
  };
  
  const buttonState = getButtonState();
  
  return (
    <div className={CSS_CLASSES.LAYOUT.CARD}>
      {/* Employee Info Display */}
      <div className="employee-info">
        <h3 className="employee-name">{employee.name}</h3>
        <p className="employee-position">{employee.position}</p>
        <p className="employee-department">{employee.department}</p>
        <p className="employee-email">{employee.email}</p>
      </div>
      
      {/* Evaluation Button */}
      <div className="employee-actions">
        <button
          onClick={handleEvaluateClick}
          disabled={buttonState.disabled}
          className={buttonState.className}
          title={buttonState.disabled ? MESSAGES.BUTTONS.CANNOT_EVALUATE : MESSAGES.BUTTONS.EVALUATE}
          style={{ minHeight: APP_CONFIG.UI.MIN_TOUCH_SIZE }}
        >
          {buttonState.text}
        </button>
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="error-message">
          <small>⚠️ {error}</small>
        </div>
      )}
    </div>
  );
};

export default EmployeeCard;