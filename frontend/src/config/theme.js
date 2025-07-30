import { APP_CONFIG } from './constants';

export const THEME = {
  COLORS: {
    PRIMARY: '#1976d2',
    PRIMARY_HOVER: '#1565c0',
    SECONDARY: '#42a5f5',
    ERROR: '#f44336',
    ERROR_HOVER: '#d32f2f',
    SUCCESS: '#4caf50',
    WARNING: '#ff9800',
    
    // Semantic colors
    DISABLED: '#f5f5f5',
    DISABLED_TEXT: '#999',
    BORDER: '#e0e0e0',
    BACKGROUND: '#ffffff',
    SHADOW: 'rgba(0,0,0,0.1)',
    SHADOW_HOVER: 'rgba(0,0,0,0.15)',
    
    // Text colors
    TEXT_PRIMARY: '#333',
    TEXT_SECONDARY: '#666',
    TEXT_TERTIARY: '#888',
    TEXT_MUTED: '#999'
  },
  
  SPACING: {
    XS: '4px',
    SM: '8px',
    MD: '12px',
    LG: '16px',
    XL: '20px',
    XXL: '24px'
  },
  
  TYPOGRAPHY: {
    FONT_SIZE: {
      XS: '0.75rem',    // 12px
      SM: '0.875rem',   // 14px  
      BASE: '1rem',     // 16px
      LG: '1.125rem',   // 18px
      XL: '1.25rem',    // 20px
      XXL: '1.5rem'     // 24px
    },
    
    FONT_WEIGHT: {
      NORMAL: 400,
      MEDIUM: 500,
      SEMIBOLD: 600,
      BOLD: 700
    }
  },
  
  BREAKPOINTS: {
    MOBILE: `${APP_CONFIG.UI.MOBILE_BREAKPOINT}px`,
    TABLET: '1024px',
    DESKTOP: '1200px'
  },
  
  SHADOWS: {
    SM: '0 2px 4px rgba(0,0,0,0.1)',
    MD: '0 4px 8px rgba(0,0,0,0.15)',
    LG: '0 8px 16px rgba(0,0,0,0.2)'
  },
  
  TRANSITIONS: {
    FAST: '0.15s ease',
    NORMAL: '0.2s ease',
    SLOW: '0.3s ease'
  },
  
  DIMENSIONS: {
    BUTTON_HEIGHT: `${APP_CONFIG.UI.MIN_TOUCH_SIZE}px`,
    BUTTON_HEIGHT_MOBILE: `${APP_CONFIG.UI.MIN_TOUCH_SIZE + 4}px`,
    BORDER_RADIUS: '6px',
    BORDER_RADIUS_LG: '8px'
  }
};