# ESUHAI ABC MODEL - CONFIG FILE
# JavaScript/Node.js Configuration Module

module.exports = {
  // =====================================
  // FORM CONFIGURATION
  // =====================================
  forms: {
    formA: {
      url: 'https://forms.gle/Y6fYUHbRcMP2jfHH7',
      prefillUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfhk-cfvPrDlpRONfmdDo6L6w1N5UhdgAZecmYLmZNDcXw9HQ/viewform',
      entryIds: {
        name: '1704172586',
        code: '1184622690', 
        position: '1121817413',
        department: '1727774632',
        email: '875025279'
      }
    },
    formB: {
      url: 'https://forms.gle/iMUPkrUWnxpdsJHu5',
      prefillUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSepXF4C3-dUrmoeBrW4e8v2re4DxsAyiboqc1yI-2VOvjVSiw/viewform',
      entryIds: {
        name: '1519666825',
        email: '570205598',
        code: '870287758',
        gender: '2096138668',
        dob: '1655662338',
        location: '1894722077',
        education: '712912742',
        department: '1741978684'
      }
    }
  },

  // =====================================
  // ABC MODEL SETTINGS
  // =====================================
  abcModel: {
    version: '2.0',
    totalEmployees: 420,
    totalGroups: 20,
    implementationTimeline: 14,
    weights: {
      formA: 0.30,
      formB: 0.40,
      formC: 0.30
    },
    qualityThresholds: {
      minCompletionRate: 0.95,
      dataValidationThreshold: 0.85,
      crossCheckSampleSize: 50
    }
  },

  // =====================================
  // BUSINESS UNITS MAPPING
  // =====================================
  businessUnits: {
    'MSA': 'Marketing, Sales, Admission',
    'IDS': 'Matching & Export Services', 
    'ESUTECH': 'Tư vấn Kỹ sư',
    'ESUCARE': 'Chăm sóc sức khỏe',
    'ESUWORKS': 'Headhunting & Placement',
    'ALESU': 'Sáng tạo & Hạ tầng Số',
    'JPC': 'Truyền thông & Vận hành',
    'GATEAWARDS': 'Tư vấn Du học'
  },

  departments: {
    'BOD': 'Ban Tổng Giám đốc',
    'TC': 'Tài chính - Kế toán',
    'NS': 'Nhân sự', 
    'IT': 'Công nghệ thông tin',
    'HC': 'Hành chính - Tổng vụ',
    'PC': 'Pháp chế',
    'KZ': 'Đào tạo Tiếng Nhật',
    'PS': 'Đào tạo Kỹ năng'
  },

  // =====================================
  // URL GENERATION FUNCTIONS
  // =====================================
  generateFormUrl: function(formType, userData) {
    const form = this.forms[formType];
    if (!form) return null;

    let url = form.prefillUrl + '?usp=pp_url';
    
    // Add user data as URL parameters
    Object.keys(userData).forEach(key => {
      if (form.entryIds[key]) {
        url += `&entry.${form.entryIds[key]}=${encodeURIComponent(userData[key])}`;
      }
    });

    return url;
  },

  // =====================================
  // VALIDATION FUNCTIONS
  // =====================================
  validateUser: function(userData) {
    const required = ['name', 'email', 'code'];
    return required.every(field => userData[field] && userData[field].trim() !== '');
  },

  // =====================================
  // DATA PROCESSING SETTINGS
  // =====================================
  dataProcessing: {
    batchSize: 50,
    timeout: 300000, // 5 minutes
    retryAttempts: 3,
    exportFormats: ['PDF', 'EXCEL', 'JSON'],
    dashboardRefreshInterval: 300000 // 5 minutes
  },

  // =====================================
  // SECURITY SETTINGS
  // =====================================
  security: {
    dataEncryption: true,
    personalDataAnonymization: true,
    dataRetentionPeriod: '3_YEARS',
    accessLevels: {
      admin: 'FULL',
      manager: 'DEPARTMENT', 
      employee: 'SELF_ONLY'
    }
  },

  // =====================================
  // NOTIFICATION SETTINGS
  // =====================================
  notifications: {
    emailEnabled: true,
    adminEmail: 'admin@esuhai.com',
    hrEmail: 'hr@esuhai.com',
    reminderInterval: 24 * 60 * 60 * 1000, // 24 hours in ms
    completionDeadlineDays: 7
  }
};
