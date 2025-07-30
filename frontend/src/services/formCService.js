import { 
  APP_CONFIG, 
  FIELD_MAPPING, 
  VALIDATION_RULES, 
  MESSAGES, 
  DEBUG_CONFIG 
} from '../config/constants';

class FormCService {
  
  /**
   * Validate employee data against configuration rules
   */
  static validateEmployeeForForm(employee) {
    const errors = [];
    const rules = VALIDATION_RULES.EMPLOYEE;
    
    // Check required fields from configuration
    rules.REQUIRED_FIELDS.forEach(field => {
      if (!employee[field]?.toString().trim()) {
        errors.push(`Missing ${field}`);
      }
    });
    
    // Validate field lengths using configuration
    const fieldLengthChecks = [
      { field: 'name', max: rules.MAX_NAME_LENGTH },
      { field: 'department', max: rules.MAX_DEPARTMENT_LENGTH },
      { field: 'position', max: rules.MAX_POSITION_LENGTH }
    ];
    
    fieldLengthChecks.forEach(({ field, max }) => {
      if (employee[field]?.length > max) {
        errors.push(`${field} exceeds ${max} characters`);
      }
    });
    
    // Validate email using configuration regex
    if (employee.email && !rules.EMAIL_REGEX.test(employee.email)) {
      errors.push('Invalid email format');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Encode text for URL using configuration rules
   */
  static encodeTextForURL(text) {
    if (!text) return '';
    
    const cleaned = text.toString().trim();
    const encodingRules = VALIDATION_RULES.URL.ENCODING_CHARS;
    
    // URL encode with configuration-based character replacement
    return encodeURIComponent(cleaned)
      .replace(/%20/g, encodingRules.SPACE)
      .replace(/'/g, encodingRules.APOSTROPHE)
      .replace(/"/g, encodingRules.QUOTE);
  }
  
  /**
   * Generate Form C URL using configuration with proper Vietnamese encoding
   */
  static generateFormCURL(employee, evaluatorInfo = null) {
    try {
      // Validate input against configuration rules
      const validation = this.validateEmployeeForForm(employee);
      if (!validation.isValid) {
        throw new Error(`${MESSAGES.ERRORS.INVALID_EMPLOYEE}: ${validation.errors.join(', ')}`);
      }
      
      // Build query parameters using URLSearchParams for proper encoding
      const params = new URLSearchParams();
      const formConfig = APP_CONFIG.FORM_C;
      
      // Map employee fields to form entries using configuration
      Object.entries(FIELD_MAPPING).forEach(([empField, entryKey]) => {
        const entryId = formConfig.ENTRIES[entryKey];
        const value = employee[empField];
        
        if (entryId && value) {
          // Use URLSearchParams.append for proper Vietnamese character encoding
          params.append(entryId, value.toString().trim());
        }
      });
      
      // Optional evaluator tracking (if enabled)
      if (evaluatorInfo?.name && APP_CONFIG.FEATURES.ANALYTICS) {
        // params.append(formConfig.ENTRIES.EVALUATOR, evaluatorInfo.name);
      }
      
      // Build final URL using configuration
      const finalUrl = `${formConfig.BASE_URL}?${params.toString()}`;
      
      // Validate URL length against configuration
      if (finalUrl.length > formConfig.MAX_URL_LENGTH) {
        const warning = `Generated URL is ${finalUrl.length} chars (max: ${formConfig.MAX_URL_LENGTH})`;
        
        if (DEBUG_CONFIG.ENABLED) {
          console.warn(warning);
        }
        
        // Could implement truncation strategy here if needed
        throw new Error(`${MESSAGES.ERRORS.FORM_GENERATION}: URL too long`);
      }
      
      this.logURLGeneration(employee, finalUrl);
      
      // Debug log for Vietnamese character verification
      if (DEBUG_CONFIG.ENABLED) {
        console.log('Form C URL generated:');
        console.log(`Employee: ${employee.name}`);
        console.log(`Department: ${employee.department}`);
        console.log(`Position: ${employee.position}`);
        console.log(`Final URL: ${finalUrl}`);
      }
      
      return finalUrl;
      
    } catch (error) {
      console.error('Error generating Form C URL:', error);
      throw new Error(`${MESSAGES.ERRORS.FORM_GENERATION}: ${error.message}`);
    }
  }
  
  /**
   * Open Form C with configurable fallback handling
   */
  static async openFormC(employee, evaluatorInfo = null) {
    try {
      const formUrl = this.generateFormCURL(employee, evaluatorInfo);
      
      // Try to open in new tab
      const popup = window.open(formUrl, '_blank', 'noopener,noreferrer');
      
      // Handle popup blocker using configuration
      if (!popup || popup.closed || typeof popup.closed == 'undefined') {
        if (APP_CONFIG.FEATURES.POPUP_FALLBACK) {
          this.handlePopupBlocked(formUrl, employee.name);
        }
        return { 
          success: false, 
          reason: 'popup_blocked', 
          url: formUrl,
          message: MESSAGES.ERRORS.POPUP_BLOCKED
        };
      }
      
      // Success
      this.logFormOpened(employee, evaluatorInfo);
      
      return { 
        success: true, 
        url: formUrl,
        message: MESSAGES.SUCCESS.FORM_OPENED
      };
      
    } catch (error) {
      console.error('Failed to open Form C:', error);
      throw error;
    }
  }
  
  /**
   * Handle popup blocker with configurable fallback
   */
  static handlePopupBlocked(url, employeeName) {
    if (!APP_CONFIG.FEATURES.POPUP_FALLBACK) {
      return;
    }
    
    // Try clipboard API first
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        const message = `${MESSAGES.ERRORS.POPUP_BLOCKED}!\n\nLink đánh giá cho ${employeeName} đã được copy.\nDán vào tab mới để mở form.`;
        alert(message);
      }).catch(() => {
        this.showFallbackModal(url, employeeName);
      });
    } else {
      this.showFallbackModal(url, employeeName);
    }
  }
  
  /**
   * Show fallback modal using configuration
   */
  static showFallbackModal(url, employeeName) {
    const modalHtml = this.generateFallbackModalHTML(url, employeeName);
    
    const modal = document.createElement('div');
    modal.innerHTML = modalHtml;
    document.body.appendChild(modal);
    
    // Auto-remove modal after timeout (configurable)
    setTimeout(() => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    }, 30000); // 30 seconds
  }
  
  /**
   * Generate fallback modal HTML using configuration
   */
  static generateFallbackModalHTML(url, employeeName) {
    return `
      <div style="
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0,0,0,0.5); z-index: 10000; 
        display: flex; align-items: center; justify-content: center;
      ">
        <div style="
          background: white; padding: 20px; border-radius: 8px; 
          max-width: 500px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        ">
          <h3>Form đánh giá ${employeeName}</h3>
          <p>${MESSAGES.ERRORS.POPUP_BLOCKED}. Click link bên dưới:</p>
          <a href="${url}" target="_blank" style="
            display: inline-block; padding: 12px 24px; 
            background: #1976d2; color: white; text-decoration: none; 
            border-radius: 6px; margin: 15px; font-weight: 500;
          ">
            ${MESSAGES.BUTTONS.OPEN_FORM}
          </a>
          <br>
          <button onclick="this.closest('div').remove()" style="
            padding: 8px 16px; border: 1px solid #ccc; 
            background: white; cursor: pointer; border-radius: 4px;
          ">
            ${MESSAGES.BUTTONS.CLOSE}
          </button>
        </div>
      </div>
    `;
  }
  
  /**
   * Log URL generation (configurable)
   */
  static logURLGeneration(employee, url) {
    if (DEBUG_CONFIG.ENABLED) {
      console.log(`Form C URL generated for ${employee.name}:`);
      console.log(`- URL length: ${url.length}/${APP_CONFIG.FORM_C.MAX_URL_LENGTH}`);
      console.log(`- Fields mapped: ${Object.keys(FIELD_MAPPING).length}`);
    }
  }
  
  /**
   * Log form opening (configurable)
   */
  static logFormOpened(employee, evaluator) {
    if (DEBUG_CONFIG.ENABLED) {
      console.log(`Form C opened: ${evaluator?.name || 'Unknown'} evaluating ${employee.name}`);
    }
    
    // Analytics tracking (if enabled)
    if (APP_CONFIG.FEATURES.ANALYTICS && window.gtag) {
      window.gtag('event', 'form_opened', {
        event_category: 'evaluation',
        event_label: `${employee.department}_${employee.position}`,
        custom_parameter_1: employee.id
      });
    }
  }
  
  /**
   * Get service configuration for debugging
   */
  static getServiceConfig() {
    return {
      formId: APP_CONFIG.FORM_C.ID,
      maxUrlLength: APP_CONFIG.FORM_C.MAX_URL_LENGTH,
      entriesCount: Object.keys(APP_CONFIG.FORM_C.ENTRIES).length,
      fieldMappingCount: Object.keys(FIELD_MAPPING).length,
      popupFallbackEnabled: APP_CONFIG.FEATURES.POPUP_FALLBACK,
      analyticsEnabled: APP_CONFIG.FEATURES.ANALYTICS
    };
  }
}

export default FormCService;