import { APP_CONFIG, MESSAGES, DEBUG_CONFIG } from '../config/constants';

class EmployeeService {
  static employees = null;
  static employeeIndex = new Map();
  static lastLoadTime = null;
  
  /**
   * Load employees with configurable data source
   */
  static async loadEmployees() {
    try {
      // Check cache validity
      if (this.employees && this.isCacheValid()) {
        if (DEBUG_CONFIG.ENABLED) {
          console.log('Using cached employee data');
        }
        return this.employees;
      }
      
      // Try primary data source
      let employeeData;
      try {
        employeeData = await this.fetchFromDataSource(APP_CONFIG.DATA.EMPLOYEE_PATH);
      } catch (primaryError) {
        // Fallback to backup source
        if (DEBUG_CONFIG.ENABLED) {
          console.warn('Primary data source failed, trying backup:', primaryError);
        }
        employeeData = await this.fetchFromDataSource(APP_CONFIG.DATA.BACKUP_PATH);
      }
      
      // Process and validate data
      this.employees = this.processEmployeeData(employeeData);
      this.buildEmployeeIndex();
      this.lastLoadTime = Date.now();
      
      this.logLoadResults();
      
      return this.employees;
      
    } catch (error) {
      const errorMessage = `${MESSAGES.ERRORS.LOAD_EMPLOYEES}: ${error.message}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }
  
  /**
   * Fetch data from configurable source
   */
  static async fetchFromDataSource(dataPath) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), APP_CONFIG.API.TIMEOUT);
    
    try {
      const response = await fetch(dataPath, {
        signal: controller.signal,
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Handle both direct array and metadata wrapper
      return data.employees || data;
      
    } finally {
      clearTimeout(timeoutId);
    }
  }
  
  /**
   * Process employee data with validation
   */
  static processEmployeeData(rawData) {
    if (!Array.isArray(rawData)) {
      throw new Error('Employee data must be an array');
    }
    
    if (rawData.length > APP_CONFIG.DATA.MAX_EMPLOYEES) {
      console.warn(`Data contains ${rawData.length} employees, limiting to ${APP_CONFIG.DATA.MAX_EMPLOYEES}`);
      rawData = rawData.slice(0, APP_CONFIG.DATA.MAX_EMPLOYEES);
    }
    
    return rawData.filter(employee => {
      // Basic validation
      return employee && 
             typeof employee === 'object' && 
             employee.name && 
             employee.email;
    });
  }
  
  /**
   * Build search index for performance
   */
  static buildEmployeeIndex() {
    this.employeeIndex.clear();
    
    this.employees.forEach(employee => {
      // Multiple index keys for flexible lookup
      if (employee.id) this.employeeIndex.set(employee.id, employee);
      if (employee.email) this.employeeIndex.set(employee.email, employee);
      if (employee.employeeCode) this.employeeIndex.set(employee.employeeCode, employee);
    });
  }
  
  /**
   * Check if cache is still valid
   */
  static isCacheValid() {
    if (!this.lastLoadTime) return false;
    
    const cacheAge = Date.now() - this.lastLoadTime;
    const maxCacheAge = 5 * 60 * 1000; // 5 minutes
    
    return cacheAge < maxCacheAge;
  }
  
  /**
   * Get employee by various identifiers
   */
  static getEmployeeById(identifier) {
    return this.employeeIndex.get(identifier);
  }
  
  /**
   * Search employees with configurable debouncing
   */
  static searchEmployees(query) {
    if (!query?.trim()) {
      return this.employees || [];
    }
    
    const searchTerm = query.toLowerCase().trim();
    
    return this.employees.filter(employee => {
      return employee.searchText?.includes(searchTerm) ||
             employee.name?.toLowerCase().includes(searchTerm) ||
             employee.department?.toLowerCase().includes(searchTerm) ||
             employee.position?.toLowerCase().includes(searchTerm);
    });
  }
  
  /**
   * Get evaluable employees (exclude current user)
   */
  static getEvaluableEmployees(currentUserId) {
    if (!this.employees) return [];
    
    return this.employees.filter(employee => {
      // Exclude current user if self-evaluation disabled
      if (!APP_CONFIG.FEATURES.SELF_EVALUATION && employee.id === currentUserId) {
        return false;
      }
      
      // Check if employee can be evaluated
      return employee.canBeEvaluated !== false;
    });
  }
  
  /**
   * Get employees by department
   */
  static getEmployeesByDepartment(department) {
    if (!department) return [];
    
    return this.employees.filter(employee => 
      employee.department?.toLowerCase().includes(department.toLowerCase())
    );
  }
  
  /**
   * Log load results (configurable)
   */
  static logLoadResults() {
    if (DEBUG_CONFIG.ENABLED) {
      console.log(`Employee Service Load Results:`);
      console.log(`- Total employees loaded: ${this.employees.length}`);
      console.log(`- Index entries created: ${this.employeeIndex.size}`);
      console.log(`- Cache valid until: ${new Date(this.lastLoadTime + 5*60*1000).toLocaleTimeString()}`);
    }
  }
  
  /**
   * Get service statistics
   */
  static getStatistics() {
    return {
      totalEmployees: this.employees?.length || 0,
      indexSize: this.employeeIndex.size,
      lastLoadTime: this.lastLoadTime,
      cacheValid: this.isCacheValid(),
      maxEmployees: APP_CONFIG.DATA.MAX_EMPLOYEES
    };
  }
}

export default EmployeeService;