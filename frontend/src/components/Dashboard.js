import React, { useState, useEffect, useCallback } from 'react';
import EmployeeCard from './EmployeeCard';
import EmployeeService from '../services/employeeService';
import { APP_CONFIG, MESSAGES, CSS_CLASSES } from '../config/constants';

const Dashboard = ({ currentUser }) => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Debounced search using configuration
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  
  // Load employees on mount
  useEffect(() => {
    loadEmployees();
  }, [currentUser]);
  
  // Debounce search query using configuration
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, APP_CONFIG.UI.SEARCH_DEBOUNCE);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);
  
  // Filter employees when debounced search changes
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      const filtered = EmployeeService.searchEmployees(debouncedSearchQuery);
      setFilteredEmployees(filtered);
    } else {
      // Show evaluable employees using service configuration
      const evaluable = EmployeeService.getEvaluableEmployees(currentUser?.id);
      setFilteredEmployees(evaluable);
    }
  }, [debouncedSearchQuery, employees, currentUser]);
  
  /**
   * Load employees using service
   */
  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const employeeData = await EmployeeService.loadEmployees();
      setEmployees(employeeData);
      
      // Log results using configuration
      if (APP_CONFIG.FEATURES.DEBUG_MODE) {
        console.log(`Dashboard loaded ${employeeData.length} employees`);
      }
      
    } catch (error) {
      console.error('Failed to load employees:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Handle search with configuration
   */
  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);
  
  /**
   * Handle evaluation start tracking
   */
  const handleEvaluationStart = useCallback((employee, evaluator) => {
    // Optional tracking using configuration
    if (APP_CONFIG.FEATURES.DEBUG_MODE) {
      console.log(`${evaluator.name} started evaluating ${employee.name}`);
    }
    
    // Analytics tracking (if enabled)
    if (APP_CONFIG.FEATURES.ANALYTICS && window.gtag) {
      window.gtag('event', 'evaluation_started', {
        event_category: 'dashboard',
        event_label: `${employee.department}_${employee.position}`,
        evaluator_id: evaluator.id,
        employee_id: employee.id
      });
    }
  }, []);
  
  // Loading state using configuration
  if (loading) {
    return (
      <div className={CSS_CLASSES.STATES.LOADING}>
        <h2>🔄 {MESSAGES.LOADING.EMPLOYEES}</h2>
        <p>{MESSAGES.LOADING.PLEASE_WAIT}</p>
      </div>
    );
  }
  
  // Error state using configuration
  if (error) {
    return (
      <div className={CSS_CLASSES.STATES.ERROR}>
        <h2>⚠️ {MESSAGES.ERRORS.LOAD_EMPLOYEES}</h2>
        <p>Chi tiết: {error}</p>
        <button onClick={loadEmployees} className="retry-button">
          🔄 {MESSAGES.BUTTONS.RETRY}
        </button>
      </div>
    );
  }
  
  return (
    <div className="dashboard">
      {/* Header */}
      <div className={CSS_CLASSES.LAYOUT.HEADER}>
        <h1>📋 Đánh Giá Đồng Nghiệp</h1>
        <p>Chào {currentUser?.name}! Chọn đồng nghiệp để đánh giá:</p>
      </div>
      
      {/* Search */}
      <div className={CSS_CLASSES.LAYOUT.SEARCH}>
        <input
          type="text"
          placeholder={`🔍 ${MESSAGES.PLACEHOLDERS.SEARCH}`}
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
          style={{ fontSize: '16px' }} // Prevent iOS zoom
        />
        <div className="search-stats">
          Hiển thị {filteredEmployees.length} nhân viên
          {employees.length > 0 && ` (Tổng: ${employees.length})`}
        </div>
      </div>
      
      {/* Employee Grid */}
      <div className={CSS_CLASSES.LAYOUT.GRID}>
        {filteredEmployees.map(employee => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            currentUser={currentUser}
            onEvaluationStart={handleEvaluationStart}
          />
        ))}
      </div>
      
      {/* Empty State */}
      {filteredEmployees.length === 0 && (
        <div className={CSS_CLASSES.STATES.EMPTY}>
          <h3>🔍 Không tìm thấy nhân viên</h3>
          <p>Thử thay đổi từ khóa tìm kiếm</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;