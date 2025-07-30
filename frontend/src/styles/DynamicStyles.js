import { THEME } from '../config/theme';
import { APP_CONFIG } from '../config/constants';

export const generateDynamicCSS = () => {
  return `
    /* Dynamic styles generated from configuration */
    
    .employee-card {
      border: 1px solid ${THEME.COLORS.BORDER};
      border-radius: ${THEME.DIMENSIONS.BORDER_RADIUS};
      padding: ${THEME.SPACING.LG};
      margin: ${THEME.SPACING.SM};
      background: ${THEME.COLORS.BACKGROUND};
      box-shadow: ${THEME.SHADOWS.SM};
      transition: transform ${THEME.TRANSITIONS.NORMAL}, box-shadow ${THEME.TRANSITIONS.NORMAL};
    }
    
    .employee-card:hover {
      transform: translateY(-2px);
      box-shadow: ${THEME.SHADOWS.MD};
    }
    
    .employee-info {
      margin-bottom: ${THEME.SPACING.MD};
    }
    
    .employee-name {
      margin: 0 0 ${THEME.SPACING.XS} 0;
      font-size: ${THEME.TYPOGRAPHY.FONT_SIZE.LG};
      font-weight: ${THEME.TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD};
      color: ${THEME.COLORS.TEXT_PRIMARY};
    }
    
    .employee-position {
      margin: ${THEME.SPACING.XS} 0;
      font-weight: ${THEME.TYPOGRAPHY.FONT_WEIGHT.MEDIUM};
      color: ${THEME.COLORS.TEXT_SECONDARY};
    }
    
    .employee-department {
      margin: ${THEME.SPACING.XS} 0;
      color: ${THEME.COLORS.TEXT_TERTIARY};
      font-size: ${THEME.TYPOGRAPHY.FONT_SIZE.SM};
    }
    
    .employee-email {
      margin: ${THEME.SPACING.XS} 0;
      color: ${THEME.COLORS.TEXT_MUTED};
      font-size: ${THEME.TYPOGRAPHY.FONT_SIZE.XS};
    }
    
    .employee-actions {
      margin-top: ${THEME.SPACING.MD};
    }
    
    /* Button States - All from configuration */
    .evaluate-button {
      width: 100%;
      min-height: ${THEME.DIMENSIONS.BUTTON_HEIGHT};
      padding: ${THEME.SPACING.MD} ${THEME.SPACING.LG};
      border: none;
      border-radius: ${THEME.DIMENSIONS.BORDER_RADIUS};
      font-size: ${THEME.TYPOGRAPHY.FONT_SIZE.SM};
      font-weight: ${THEME.TYPOGRAPHY.FONT_WEIGHT.MEDIUM};
      cursor: pointer;
      transition: all ${THEME.TRANSITIONS.NORMAL};
      display: flex;
      align-items: center;
      justify-content: center;
      gap: ${THEME.SPACING.XS};
    }
    
    .evaluate-button.primary {
      background: ${THEME.COLORS.PRIMARY};
      color: white;
    }
    
    .evaluate-button.primary:hover {
      background: ${THEME.COLORS.PRIMARY_HOVER};
    }
    
    .evaluate-button.loading {
      background: ${THEME.COLORS.SECONDARY};
      color: white;
      cursor: wait;
    }
    
    .evaluate-button.error {
      background: ${THEME.COLORS.ERROR};
      color: white;
    }
    
    .evaluate-button.error:hover {
      background: ${THEME.COLORS.ERROR_HOVER};
    }
    
    .evaluate-button.disabled {
      background: ${THEME.COLORS.DISABLED};
      color: ${THEME.COLORS.DISABLED_TEXT};
      cursor: not-allowed;
    }
    
    .error-message {
      margin-top: ${THEME.SPACING.SM};
      padding: ${THEME.SPACING.SM};
      background: #ffebee;
      border-radius: ${THEME.DIMENSIONS.BORDER_RADIUS};
      color: ${THEME.COLORS.ERROR};
      font-size: ${THEME.TYPOGRAPHY.FONT_SIZE.XS};
    }
    
    /* Grid Layout using configuration */
    .employee-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: ${THEME.SPACING.LG};
      padding: ${THEME.SPACING.LG};
    }
    
    /* Mobile Responsive using configuration breakpoints */
    @media (max-width: ${THEME.BREAKPOINTS.MOBILE}) {
      .employee-card {
        margin: ${THEME.SPACING.XS} 0;
        padding: ${THEME.SPACING.MD};
      }
      
      .evaluate-button {
        min-height: ${THEME.DIMENSIONS.BUTTON_HEIGHT_MOBILE};
        font-size: ${THEME.TYPOGRAPHY.FONT_SIZE.BASE}; /* Prevent iOS zoom */
      }
      
      .employee-grid {
        grid-template-columns: 1fr;
        gap: ${THEME.SPACING.SM};
        padding: ${THEME.SPACING.SM};
      }
    }
    
    /* Dashboard states using configuration */
    .dashboard-loading,
    .dashboard-error {
      text-align: center;
      padding: ${THEME.SPACING.XXL};
    }
    
    .dashboard-loading h2,
    .dashboard-error h2 {
      color: ${THEME.COLORS.TEXT_PRIMARY};
      margin-bottom: ${THEME.SPACING.MD};
    }
    
    .dashboard-loading p,
    .dashboard-error p {
      color: ${THEME.COLORS.TEXT_SECONDARY};
      margin-bottom: ${THEME.SPACING.LG};
    }
    
    .retry-button {
      padding: ${THEME.SPACING.MD} ${THEME.SPACING.XL};
      background: ${THEME.COLORS.PRIMARY};
      color: white;
      border: none;
      border-radius: ${THEME.DIMENSIONS.BORDER_RADIUS};
      cursor: pointer;
      font-size: ${THEME.TYPOGRAPHY.FONT_SIZE.SM};
      transition: background ${THEME.TRANSITIONS.NORMAL};
    }
    
    .retry-button:hover {
      background: ${THEME.COLORS.PRIMARY_HOVER};
    }
    
    /* Search section */
    .search-section {
      padding: ${THEME.SPACING.LG};
      border-bottom: 1px solid ${THEME.COLORS.BORDER};
    }
    
    .search-input {
      width: 100%;
      padding: ${THEME.SPACING.MD};
      border: 1px solid ${THEME.COLORS.BORDER};
      border-radius: ${THEME.DIMENSIONS.BORDER_RADIUS};
      font-size: ${THEME.TYPOGRAPHY.FONT_SIZE.BASE};
      transition: border-color ${THEME.TRANSITIONS.FAST};
    }
    
    .search-input:focus {
      outline: none;
      border-color: ${THEME.COLORS.PRIMARY};
      box-shadow: 0 0 0 2px ${THEME.COLORS.PRIMARY}20;
    }
    
    .search-stats {
      margin-top: ${THEME.SPACING.SM};
      font-size: ${THEME.TYPOGRAPHY.FONT_SIZE.SM};
      color: ${THEME.COLORS.TEXT_MUTED};
    }
    
    .empty-state {
      text-align: center;
      padding: ${THEME.SPACING.XXL};
      color: ${THEME.COLORS.TEXT_SECONDARY};
    }
    
    .empty-state h3 {
      margin-bottom: ${THEME.SPACING.MD};
      color: ${THEME.COLORS.TEXT_PRIMARY};
    }
  `;
};

// Apply dynamic styles to document
export const applyDynamicStyles = () => {
  const styleId = 'dynamic-employee-styles';
  
  // Remove existing styles if any
  const existingStyle = document.getElementById(styleId);
  if (existingStyle) {
    existingStyle.remove();
  }
  
  // Add new styles
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = generateDynamicCSS();
  document.head.appendChild(style);
};