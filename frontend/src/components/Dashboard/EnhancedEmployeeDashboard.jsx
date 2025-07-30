import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  RefreshCw,
  Download,
  Users,
  Building2,
  BarChart3,
  Grid3X3,
  List,
  Settings
} from 'lucide-react';

import FilterPanel from './FilterPanel';
import EnhancedEmployeeCard from './EnhancedEmployeeCard';
import FormCService from '../../services/formCService';
import './EnhancedEmployeeDashboard.css';

const EnhancedEmployeeDashboard = ({ currentUser }) => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI State
  const [filters, setFilters] = useState({
    searchQuery: '',
    department: 'all',
    businessUnit: 'all',
    level: 'all',
    formStatus: 'all', 
    status: 'all'
  });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        loadEmployeeData(),
        loadDepartmentData(),
        loadStatistics()
      ]);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const loadEmployeeData = async () => {
    try {
      const response = await fetch('/data/employees.json');
      if (!response.ok) throw new Error('Failed to load employees');
      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      console.error('Error loading employees:', err);
      throw err;
    }
  };

  const loadDepartmentData = async () => {
    try {
      const response = await fetch('/data/departments.json');
      if (!response.ok) throw new Error('Failed to load departments');
      const data = await response.json();
      setDepartments(data);
    } catch (err) {
      console.error('Error loading departments:', err);
      // Don't throw - departments are optional
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await fetch('/data/statistics.json');
      if (!response.ok) throw new Error('Failed to load statistics');
      const data = await response.json();
      setStatistics(data);
    } catch (err) {
      console.error('Error loading statistics:', err);
      // Don't throw - statistics are optional
    }
  };

  // Filter employees based on current filters
  const filteredEmployees = useMemo(() => {
    if (!employees.length) return [];

    return employees.filter(employee => {
      // Search query filter
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const searchFields = [
          employee.name,
          employee.email,
          employee.position,
          employee.department,
          employee.id
        ].map(field => field?.toLowerCase() || '');
        
        if (!searchFields.some(field => field.includes(query))) {
          return false;
        }
      }

      // Department filter
      if (filters.department !== 'all' && employee.department !== filters.department) {
        return false;
      }

      // Business Unit filter
      if (filters.businessUnit !== 'all' && employee.buName !== filters.businessUnit) {
        return false;
      }

      // Level filter
      if (filters.level !== 'all' && employee.level !== filters.level) {
        return false;
      }

      // Status filter
      if (filters.status !== 'all' && employee.status !== filters.status) {
        return false;
      }

      // Form status filter
      if (filters.formStatus !== 'all') {
        const completedCount = employee.completedForms || 0;
        switch (filters.formStatus) {
          case 'completed':
            if (completedCount !== 3) return false;
            break;
          case 'partial':
            if (completedCount === 0 || completedCount === 3) return false;
            break;
          case 'incomplete':
            if (completedCount !== 0) return false;
            break;
        }
      }

      // Exclude current user if specified
      if (currentUser && employee.id === currentUser.id) {
        return false;
      }

      return employee.canBeEvaluated !== false;
    });
  }, [employees, filters, currentUser]);

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  // Handle form generation
  const handleGenerateFormC = async (employee) => {
    try {
      // Convert employee to the format expected by FormCService
      const employeeForForm = {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        position: employee.position,
        employeeCode: employee.id,
        toFormCData: () => ({
          id: employee.id,
          name: employee.name,
          email: employee.email,
          department: employee.department,
          position: employee.position,
          employeeCode: employee.id
        })
      };

      const result = await FormCService.openFormC(employeeForForm.toFormCData(), currentUser);
      
      if (result.success) {
        console.log('✅ Form C opened successfully for:', employee.name);
      } else {
        console.warn('⚠️ Form C popup blocked, fallback triggered');
      }
    } catch (error) {
      console.error('❌ Error opening Form C:', error);
      alert(`Lỗi tạo form đánh giá cho ${employee.name}: ${error.message}`);
    }
  };

  // Handle data export
  const handleExportData = () => {
    const date = new Date().toISOString().split('T')[0];
    const csvData = filteredEmployees.map(emp => [
      emp.id,
      emp.name,
      emp.email,
      emp.department,
      emp.buName,
      emp.position,
      emp.level,
      emp.status,
      emp.formStatus.formA ? 'Hoàn thành' : 'Chưa hoàn thành',
      emp.formStatus.formB ? 'Hoàn thành' : 'Chưa hoàn thành',
      emp.formStatus.formC ? 'Hoàn thành' : 'Chưa hoàn thành',
      `${emp.completedForms}/3`,
      emp.hireDate,
      emp.phone || 'N/A'
    ]);

    const headers = [
      'Mã NV', 'Họ Tên', 'Email', 'Phòng Ban', 'BU', 'Chức Vụ', 'Cấp Bậc', 'Trạng Thái',
      'Form A', 'Form B', 'Form C', 'Tiến Độ', 'Ngày Vào Làm', 'Điện Thoại'
    ];
    
    const csvContent = [headers, ...csvData].map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `esuhai_employees_${date}.csv`;
    link.click();
  };

  // Calculate display statistics
  const displayStats = useMemo(() => {
    if (!filteredEmployees.length) {
      return {
        total: 0,
        active: 0,
        formCompletion: { formA: 0, formB: 0, formC: 0 },
        averageCompletion: 0
      };
    }

    const active = filteredEmployees.filter(emp => emp.status === 'Active').length;
    const formA = filteredEmployees.filter(emp => emp.formStatus.formA).length;
    const formB = filteredEmployees.filter(emp => emp.formStatus.formB).length;
    const formC = filteredEmployees.filter(emp => emp.formStatus.formC).length;
    const totalFormSlots = filteredEmployees.length * 3;
    const completedFormSlots = formA + formB + formC;

    return {
      total: filteredEmployees.length,
      active,
      formCompletion: { formA, formB, formC },
      averageCompletion: totalFormSlots > 0 ? (completedFormSlots / totalFormSlots * 100) : 0
    };
  }, [filteredEmployees]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-content">
          <RefreshCw className="loading-spinner" />
          <h2>Đang tải dữ liệu nhân viên...</h2>
          <p>Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-content">
          <h2>Có lỗi xảy ra</h2>
          <p>{error}</p>
          <button onClick={loadAllData} className="retry-btn">
            <RefreshCw />
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="enhanced-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <Building2 className="header-icon" />
            <div className="header-info">
              <h1 className="header-title">
                Enhanced Dashboard Nhân Viên Esuhai
              </h1>
              <p className="header-subtitle">
                Quản lý và đánh giá {employees.length} nhân viên với trạng thái forms
              </p>
            </div>
          </div>
          
          <div className="header-actions">
            <button
              onClick={loadAllData}
              className="action-btn secondary"
              disabled={loading}
              title="Làm mới dữ liệu"
            >
              <RefreshCw className={loading ? 'spinning' : ''} />
              Làm mới
            </button>
            
            <button
              onClick={handleExportData}
              className="action-btn primary"
              disabled={!filteredEmployees.length}
              title="Xuất dữ liệu ra Excel"
            >
              <Download />
              Xuất Excel ({filteredEmployees.length})
            </button>
            
            <div className="view-controls">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="view-toggle-btn"
                title={viewMode === 'grid' ? 'Chuyển sang dạng danh sách' : 'Chuyển sang dạng lưới'}
              >
                {viewMode === 'grid' ? <List /> : <Grid3X3 />}
              </button>
              
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Panel */}
      <div className="statistics-panel">
        <div className="stat-card">
          <div className="stat-icon">
            <Users />
          </div>
          <div className="stat-content">
            <div className="stat-value">{displayStats.total}</div>
            <div className="stat-label">Nhân viên hiển thị</div>
            <div className="stat-detail">{displayStats.active} đang làm việc</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <BarChart3 />
          </div>
          <div className="stat-content">
            <div className="stat-value">{displayStats.averageCompletion.toFixed(1)}%</div>
            <div className="stat-label">Hoàn thành trung bình</div>
            <div className="stat-detail">Tất cả forms</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon form-a">
            ✅
          </div>
          <div className="stat-content">
            <div className="stat-value">{displayStats.formCompletion.formA}</div>
            <div className="stat-label">Form A</div>
            <div className="stat-detail">Hồi ức cấp 3</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon form-b">
            ✅
          </div>
          <div className="stat-content">
            <div className="stat-value">{displayStats.formCompletion.formB}</div>
            <div className="stat-label">Form B</div>
            <div className="stat-detail">Năng lực cá nhân</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon form-c">  
            ✅
          </div>
          <div className="stat-content">
            <div className="stat-value">{displayStats.formCompletion.formC}</div>
            <div className="stat-label">Form C</div>
            <div className="stat-detail">Đánh giá 360°</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <FilterPanel
        employees={employees}
        departments={departments}
        onFiltersChange={handleFiltersChange}
        initialFilters={filters}
        variant="compact"
      />

      {/* Results Info */}
      <div className="results-info">
        <div className="results-count">
          <Users />
          <span>
            Hiển thị {filteredEmployees.length} / {employees.length} nhân viên
          </span>
        </div>
        
        {Object.values(filters).some(f => f !== 'all' && f !== '') && (
          <div className="filter-indicator">
            <span>Đang áp dụng bộ lọc</span>
          </div>
        )}
      </div>

      {/* Employee Grid */}
      <div className={`employee-grid ${viewMode}`}>
        {filteredEmployees.map(employee => (
          <EnhancedEmployeeCard
            key={employee.id}
            employee={employee}
            onGenerateFormC={() => handleGenerateFormC(employee)}
          />
        ))}
      </div>

      {/* No Results */}
      {filteredEmployees.length === 0 && !loading && (
        <div className="no-results">
          <Users className="no-results-icon" />
          <h3>Không tìm thấy nhân viên</h3>
          <p>Thử thay đổi điều kiện tìm kiếm hoặc bộ lọc</p>
          <button 
            onClick={() => setFilters({
              searchQuery: '',
              department: 'all',
              businessUnit: 'all',
              level: 'all',
              formStatus: 'all',
              status: 'all'
            })}
            className="clear-filters-btn"
          >
            Xóa tất cả bộ lọc
          </button>
        </div>
      )}

      {/* Current User Info */}
      {currentUser && (
        <div className="current-user-info">
          <span>
            Đăng nhập với tư cách: <strong>{currentUser.name}</strong>
            {' '}({currentUser.position} - {currentUser.department})
          </span>
        </div>
      )}
    </div>
  );
};

export default EnhancedEmployeeDashboard;