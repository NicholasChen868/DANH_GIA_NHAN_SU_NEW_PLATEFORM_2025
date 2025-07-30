import { APP_CONFIG, EXCEL_COLUMN_MAPPING, VALIDATION_RULES, MESSAGES } from '../config/constants';

class EmployeeDataProcessor {
  
  /**
   * Process Excel data with configurable field mapping
   */
  static processExcelData(rawData) {
    try {
      const processedEmployees = rawData.map((row, index) => {
        const employee = {};
        
        // Map Excel columns to internal fields using configuration
        Object.entries(EXCEL_COLUMN_MAPPING).forEach(([excelColumn, internalField]) => {
          employee[internalField] = this.cleanFieldValue(row[excelColumn]);
        });
        
        // Add computed fields
        employee.id = employee.id || this.generateEmployeeId(employee, index);
        employee.canBeEvaluated = this.determineEvaluationEligibility(employee);
        employee.searchText = this.generateSearchText(employee);
        
        return employee;
      });
      
      // Validate processed data
      const validEmployees = processedEmployees.filter(emp => {
        const validation = this.validateEmployeeRecord(emp);
        if (!validation.isValid && APP_CONFIG.FEATURES.DEBUG_MODE) {
          console.warn(`Invalid employee ${emp.name}:`, validation.errors);
        }
        return validation.isValid;
      });
      
      this.logProcessingResults(rawData.length, validEmployees.length);
      
      return validEmployees;
      
    } catch (error) {
      throw new Error(`${MESSAGES.ERRORS.INVALID_EMPLOYEE}: ${error.message}`);
    }
  }
  
  /**
   * Clean and normalize field values
   */
  static cleanFieldValue(value) {
    if (typeof value !== 'string') {
      return value?.toString()?.trim() || '';
    }
    return value.trim();
  }
  
  /**
   * Generate employee ID if missing
   */
  static generateEmployeeId(employee, index) {
    if (employee.employeeCode) {
      return employee.employeeCode;
    }
    
    // Fallback ID generation
    const namePrefix = employee.name?.substring(0, 3).toUpperCase() || 'EMP';
    return `${namePrefix}${String(index + 1).padStart(3, '0')}`;
  }
  
  /**
   * Determine if employee can be evaluated
   */
  static determineEvaluationEligibility(employee) {
    // Check if all required fields exist
    const hasRequiredFields = VALIDATION_RULES.EMPLOYEE.REQUIRED_FIELDS.every(
      field => employee[field]?.trim()
    );
    
    // Check status if exists
    const isActive = !employee.status || 
                    employee.status.toLowerCase().includes('active') ||
                    employee.status.toLowerCase().includes('làm việc');
    
    return hasRequiredFields && isActive;
  }
  
  /**
   * Generate searchable text for employee
   */
  static generateSearchText(employee) {
    return [
      employee.name,
      employee.department,
      employee.position,
      employee.email
    ].filter(Boolean).join(' ').toLowerCase();
  }
  
  /**
   * Validate employee record using configuration rules
   */
  static validateEmployeeRecord(employee) {
    const errors = [];
    const rules = VALIDATION_RULES.EMPLOYEE;
    
    // Check required fields
    rules.REQUIRED_FIELDS.forEach(field => {
      if (!employee[field]?.trim()) {
        errors.push(`Missing ${field}`);
      }
    });
    
    // Validate field lengths
    if (employee.name?.length > rules.MAX_NAME_LENGTH) {
      errors.push(`Name exceeds ${rules.MAX_NAME_LENGTH} characters`);
    }
    
    if (employee.department?.length > rules.MAX_DEPARTMENT_LENGTH) {
      errors.push(`Department exceeds ${rules.MAX_DEPARTMENT_LENGTH} characters`);
    }
    
    if (employee.position?.length > rules.MAX_POSITION_LENGTH) {
      errors.push(`Position exceeds ${rules.MAX_POSITION_LENGTH} characters`);
    }
    
    // Validate email format
    if (employee.email && !rules.EMAIL_REGEX.test(employee.email)) {
      errors.push('Invalid email format');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Log processing results (configurable)
   */
  static logProcessingResults(totalCount, validCount) {
    if (APP_CONFIG.FEATURES.DEBUG_MODE) {
      console.log(`Employee Processing Results:`);
      console.log(`- Total records: ${totalCount}`);
      console.log(`- Valid records: ${validCount}`);
      console.log(`- Invalid records: ${totalCount - validCount}`);
      console.log(`- Success rate: ${(validCount/totalCount*100).toFixed(1)}%`);
    }
  }
  
  /**
   * Export to JSON with metadata
   */
  static exportToJSON(employees) {
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        totalCount: employees.length,
        maxEmployees: APP_CONFIG.DATA.MAX_EMPLOYEES,
        version: '1.0'
      },
      employees: employees.slice(0, APP_CONFIG.DATA.MAX_EMPLOYEES) // Respect max limit
    };
    
    return JSON.stringify(exportData, null, 2);
  }
}

export default EmployeeDataProcessor;