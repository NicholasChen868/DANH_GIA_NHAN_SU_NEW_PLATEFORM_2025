export const APP_CONFIG = {
  // Environment-based values
  FORM_C: {
    ID: process.env.REACT_APP_FORM_C_ID,
    BASE_URL: process.env.REACT_APP_FORM_C_BASE_URL,
    MAX_URL_LENGTH: parseInt(process.env.REACT_APP_MAX_URL_LENGTH) || 2000,
    
    // Entry mapping from environment
    ENTRIES: {
      EVALUATED_NAME: process.env.REACT_APP_ENTRY_EVALUATED_NAME,
      EVALUATED_EMAIL: process.env.REACT_APP_ENTRY_EVALUATED_EMAIL,
      DEPARTMENT: process.env.REACT_APP_ENTRY_DEPARTMENT,
      POSITION: process.env.REACT_APP_ENTRY_POSITION,
      EMPLOYEE_CODE: process.env.REACT_APP_ENTRY_EMPLOYEE_CODE
    }
  },
  
  // Data configuration
  DATA: {
    EMPLOYEE_PATH: process.env.REACT_APP_EMPLOYEE_DATA_PATH,
    BACKUP_PATH: process.env.REACT_APP_BACKUP_DATA_PATH,
    MAX_EMPLOYEES: parseInt(process.env.REACT_APP_MAX_EMPLOYEES) || 500
  },
  
  // UI configuration
  UI: {
    CARDS_PER_PAGE: parseInt(process.env.REACT_APP_CARDS_PER_PAGE) || 20,
    MOBILE_BREAKPOINT: parseInt(process.env.REACT_APP_MOBILE_BREAKPOINT) || 768,
    MIN_TOUCH_SIZE: parseInt(process.env.REACT_APP_MIN_TOUCH_SIZE) || 44,
    SEARCH_DEBOUNCE: parseInt(process.env.REACT_APP_SEARCH_DEBOUNCE_MS) || 300
  },
  
  // Feature flags
  FEATURES: {
    ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    SELF_EVALUATION: process.env.REACT_APP_ENABLE_SELF_EVALUATION === 'true',
    POPUP_FALLBACK: process.env.REACT_APP_ENABLE_POPUP_FALLBACK === 'true',
    DEBUG_MODE: process.env.REACT_APP_DEBUG_MODE === 'true'
  },
  
  // API configuration
  API: {
    TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT_MS) || 5000
  }
};

// Field mapping from dim_users.xlsx columns to form entries
export const FIELD_MAPPING = {
  // Employee data fields → Form entry keys
  'name': 'EVALUATED_NAME',
  'email': 'EVALUATED_EMAIL', 
  'department': 'DEPARTMENT',
  'position': 'POSITION',
  'employeeCode': 'EMPLOYEE_CODE'
};

// Excel column mapping to standardized field names
export const EXCEL_COLUMN_MAPPING = {
  // dim_users.xlsx columns → internal field names
  'Họ và Tên': 'name',
  'Email': 'email',
  'Nhóm': 'department', 
  'Chức vụ': 'position',
  'Mã NV': 'employeeCode',
  'ID': 'id',
  'Trạng thái': 'status'
};

// Validation rules
export const VALIDATION_RULES = {
  EMPLOYEE: {
    REQUIRED_FIELDS: ['name', 'email', 'department', 'position', 'employeeCode'],
    MAX_NAME_LENGTH: 100,
    MAX_DEPARTMENT_LENGTH: 50,
    MAX_POSITION_LENGTH: 50,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  
  URL: {
    MAX_LENGTH: APP_CONFIG.FORM_C.MAX_URL_LENGTH,
    ENCODING_CHARS: {
      SPACE: '+',
      APOSTROPHE: '%27',
      QUOTE: '%22'
    }
  }
};

// UI Messages - NO hardcode strings
export const MESSAGES = {
  LOADING: {
    EMPLOYEES: 'Đang tải danh sách nhân viên...',
    FORM: 'Đang tạo form đánh giá...',
    PLEASE_WAIT: 'Vui lòng đợi trong giây lát'
  },
  
  ERRORS: {
    LOAD_EMPLOYEES: 'Không thể tải danh sách nhân viên',
    INVALID_EMPLOYEE: 'Thông tin nhân viên không hợp lệ',
    FORM_GENERATION: 'Không thể tạo form đánh giá',
    POPUP_BLOCKED: 'Trình duyệt chặn popup',
    NETWORK_ERROR: 'Lỗi kết nối mạng',
    SELF_EVALUATION: 'Không thể đánh giá bản thân',
    MISSING_DATA: 'Thiếu thông tin bắt buộc'
  },
  
  SUCCESS: {
    FORM_OPENED: 'Form đánh giá đã được mở',
    DATA_COPIED: 'Link đã được copy vào clipboard'
  },
  
  BUTTONS: {
    EVALUATE: 'Đánh giá đồng nghiệp',
    SELF: 'Bản thân',
    LOADING: 'Đang tạo form...',
    ERROR: 'Thử lại',
    CANNOT_EVALUATE: 'Không thể đánh giá',
    RETRY: 'Thử lại',
    CLOSE: 'Đóng',
    OPEN_FORM: 'Mở Form Đánh Giá'
  },
  
  PLACEHOLDERS: {
    SEARCH: 'Tìm kiếm theo tên, phòng ban, chức vụ...'
  }
};

// CSS Classes - centralized styling references
export const CSS_CLASSES = {
  BUTTONS: {
    PRIMARY: 'evaluate-button primary',
    LOADING: 'evaluate-button loading', 
    ERROR: 'evaluate-button error',
    DISABLED: 'evaluate-button disabled'
  },
  
  STATES: {
    LOADING: 'dashboard-loading',
    ERROR: 'dashboard-error',
    EMPTY: 'empty-state'
  },
  
  LAYOUT: {
    GRID: 'employee-grid',
    CARD: 'employee-card',
    HEADER: 'dashboard-header',
    SEARCH: 'search-section'
  }
};

// Development/Debug configuration
export const DEBUG_CONFIG = {
  ENABLED: APP_CONFIG.FEATURES.DEBUG_MODE,
  LOG_LEVEL: APP_CONFIG.FEATURES.DEBUG_MODE ? 'debug' : 'error',
  SHOW_PERFORMANCE: APP_CONFIG.FEATURES.DEBUG_MODE
};