import React, { useState, useEffect } from 'react';
import { 
  Search, 
  RefreshCw,
  Download,
  Users,
  Building2
} from 'lucide-react';

import EmployeeDataService from '../../services/EmployeeDataService';
import FormCService from '../../services/formCService';

const SimplifiedEmployeeDashboard = ({ currentUser }) => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = EmployeeDataService.searchEmployees(searchQuery);
      const evaluable = filtered.filter(emp => emp.canBeEvaluated && emp.id !== currentUser?.id);
      setFilteredEmployees(evaluable);
    } else {
      const evaluable = EmployeeDataService.getEvaluableEmployees(currentUser?.id);
      setFilteredEmployees(evaluable);
    }
  }, [employees, searchQuery, currentUser]);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const employeeData = await EmployeeDataService.loadEmployeeData();
      setEmployees(employeeData);
      
      const stats = EmployeeDataService.getStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFormC = async (employee) => {
    try {
      const result = await FormCService.openFormC(employee.toFormCData(), currentUser);
      
      if (result.success) {
        console.log('✅ Form C opened successfully');
      } else {
        console.warn('⚠️ Form C popup blocked, fallback triggered');
      }
    } catch (error) {
      console.error('❌ Error opening Form C:', error);
      alert(`Lỗi tạo form đánh giá: ${error.message}`);
    }
  };

  const handleExportData = () => {
    const date = new Date().toISOString().split('T')[0];
    const csvData = employees.map(emp => [
      emp.employeeCode,
      emp.name,
      emp.email,
      emp.department,
      emp.position,
      emp.abcScores.totalScore || 'N/A',
      emp.getABCCategoryName(),
      emp.salary.total || 'N/A',
      emp.getSalaryGrade(),
      emp.joinDate,
      emp.getYearsOfService() + ' năm',
      emp.isActive ? 'Đang Làm' : 'Nghỉ Việc'
    ]);

    const headers = ['Mã NV', 'Họ Tên', 'Email', 'Phòng Ban', 'Chức Vụ', 'Điểm ABC', 'Phân Loại', 'Điểm Lương', 'Cấp Lương', 'Ngày Vào Làm', 'Kinh Nghiệm', 'Trạng Thái'];
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `esuhai_employees_${date}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <RefreshCw className="loading-icon" />
          <p className="loading-text">Đang tải dữ liệu nhân viên Esuhai...</p>
          <p className="loading-subtext">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Building2 style={{ width: '2rem', height: '2rem', color: '#2563eb' }} />
              <div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                  Dashboard Nhân Viên Esuhai
                </h1>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                  Quản lý và đánh giá {statistics?.total || 0} nhân viên
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={loadEmployees}
                className="btn btn-secondary"
              >
                <RefreshCw style={{ width: '1rem', height: '1rem' }} />
                Làm mới
              </button>
              
              <button
                onClick={handleExportData}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                <Download style={{ width: '1rem', height: '1rem' }} />
                Xuất Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Statistics */}
        {statistics && (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Tổng Nhân Viên</h3>
              <p className="stat-value">{statistics.total}</p>
              <p className="stat-detail">{statistics.active} đang làm việc</p>
            </div>
            
            <div className="stat-card">
              <h3>Phòng Ban</h3>
              <p className="stat-value">{Object.keys(statistics.byDepartment).length}</p>
              <p className="stat-detail">Đơn vị tổ chức</p>
            </div>
            
            <div className="stat-card">
              <h3>ABC Trung Bình</h3>
              <p className="stat-value">
                {statistics.salaryDistribution.average.toFixed(1)}
              </p>
              <p className="stat-detail">Điểm đánh giá</p>
            </div>
            
            <div className="stat-card">
              <h3>Có Thể Đánh Giá</h3>
              <p className="stat-value">{filteredEmployees.length}</p>
              <p className="stat-detail">Nhân viên khả dụng</p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="filters-section">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm nhân viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
              <Users style={{ width: '1rem', height: '1rem' }} />
              {filteredEmployees.length} / {employees.length} nhân viên
            </div>
          </div>
        </div>

        {/* Employee Grid */}
        <div className="employee-grid">
          {filteredEmployees.map(employee => (
            <EmployeeCardSimplified
              key={employee.id}
              employee={employee}
              onGenerateFormC={() => handleGenerateFormC(employee)}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredEmployees.length === 0 && !loading && (
          <div className="no-results">
            <Users />
            <h3>Không tìm thấy nhân viên</h3>
            <p>Thử thay đổi từ khóa tìm kiếm</p>
          </div>
        )}

        {/* Current User Info */}
        {currentUser && (
          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: '#9ca3af' }}>
            Đăng nhập với tư cách: <span style={{ fontWeight: '500', color: '#6b7280' }}>{currentUser.name}</span>
            {' '}({currentUser.position} - {currentUser.department})
          </div>
        )}
      </div>
    </div>
  );
};

// Simplified Employee Card Component
const EmployeeCardSimplified = ({ employee, onGenerateFormC }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleClick = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      await onGenerateFormC();
    } finally {
      setIsGenerating(false);
    }
  };

  const abcCategory = employee.getABCCategory();
  
  return (
    <div className="employee-card">
      <div className="employee-card-header">
        <div className="employee-info">
          <img
            src={employee.avatar}
            alt={employee.name}
            className="employee-avatar"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=random&color=fff&size=64`;
            }}
          />
          <div className="employee-details">
            <h3 className="employee-name">{employee.name}</h3>
            <p className="employee-position">{employee.position}</p>
            <p className="employee-department">{employee.department}</p>
          </div>
          <div className="employee-badges">
            <div 
              className="abc-badge"
              style={{
                backgroundColor: abcCategory.bgColor,
                color: abcCategory.color
              }}
            >
              {abcCategory.name}
            </div>
            <div className="employee-code">{employee.employeeCode}</div>
          </div>
        </div>
      </div>
      
      <div className="employee-card-body">
        <div className="contact-info">
          <div className="contact-item">
            📧 {employee.email}
          </div>
          <div className="contact-item">
            📅 {employee.getYearsOfService()} năm kinh nghiệm
          </div>
        </div>

        {employee.abcScores.totalScore && (
          <div className="metrics-grid">
            <div className="metric-card" style={{ backgroundColor: '#eff6ff' }}>
              <div className="metric-header">
                <div className="metric-label" style={{ color: '#1d4ed8' }}>
                  ⭐ ABC Score
                </div>
                <div className="metric-value" style={{ color: '#1e40af' }}>
                  {employee.abcScores.totalScore.toFixed(1)}
                </div>
              </div>
              <div className="metric-breakdown" style={{ color: '#3b82f6' }}>
                <span>A:{employee.abcScores.groupA?.toFixed(1) || 'N/A'}</span>
                <span>B:{employee.abcScores.groupB?.toFixed(1) || 'N/A'}</span>
                <span>C:{employee.abcScores.groupC?.toFixed(1) || 'N/A'}</span>
              </div>
            </div>
            
            {employee.salary.total && (
              <div className="metric-card" style={{ backgroundColor: '#f0fdf4' }}>
                <div className="metric-header">
                  <div className="metric-label" style={{ color: '#15803d' }}>
                    💰 Lương
                  </div>
                  <div className="metric-value" style={{ color: '#166534' }}>
                    {employee.getSalaryGrade()}
                  </div>
                </div>
                <div className="metric-breakdown" style={{ color: '#16a34a' }}>
                  Tổng: {employee.salary.total} điểm
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="employee-actions">
        <div className="action-buttons">
          <button
            onClick={handleClick}
            disabled={isGenerating || !employee.canBeEvaluated}
            className={`btn ${isGenerating || !employee.canBeEvaluated ? 'btn-disabled' : 'btn-primary'}`}
          >
            {isGenerating ? (
              <>
                <div className="spinner" />
                Đang tạo...
              </>
            ) : (
              <>
                📝 Đánh giá
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className={`status-indicator ${employee.isActive ? 'status-active' : 'status-inactive'}`} />
    </div>
  );
};

export default SimplifiedEmployeeDashboard;