import React, { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronDown, Users, Building2, CheckSquare } from 'lucide-react';
import './FilterPanel.css';

const FilterPanel = ({ 
  employees = [], 
  departments = [], 
  onFiltersChange, 
  initialFilters = {},
  variant = 'default'
}) => {
  const [filters, setFilters] = useState({
    searchQuery: '',
    department: 'all',
    businessUnit: 'all',
    level: 'all',
    formStatus: 'all',
    status: 'all',
    ...initialFilters
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Get unique values for filter options
  const getFilterOptions = () => {
    const uniqueDepartments = [...new Set(employees.map(emp => emp.department))].sort();
    const uniqueBUs = [...new Set(employees.map(emp => emp.buName))].sort();
    const uniqueLevels = [...new Set(employees.map(emp => emp.level))].sort();
    
    return {
      departments: uniqueDepartments,
      businessUnits: uniqueBUs,
      levels: uniqueLevels
    };
  };

  const filterOptions = getFilterOptions();

  // Calculate active filters count
  useEffect(() => {
    const count = Object.entries(filters).reduce((total, [key, value]) => {
      if (key === 'searchQuery') return total + (value.trim() ? 1 : 0);
      return total + (value !== 'all' ? 1 : 0);
    }, 0);
    setActiveFiltersCount(count);
  }, [filters]);

  // Notify parent of filter changes
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      searchQuery: '',
      department: 'all',
      businessUnit: 'all',
      level: 'all',
      formStatus: 'all',
      status: 'all'
    };
    setFilters(clearedFilters);
  };

  const getFilterSummary = () => {
    const summary = [];
    if (filters.searchQuery) summary.push(`Tìm kiếm: "${filters.searchQuery}"`);
    if (filters.department !== 'all') summary.push(`Phòng ban: ${filters.department}`);
    if (filters.businessUnit !== 'all') summary.push(`BU: ${filters.businessUnit}`);
    if (filters.level !== 'all') summary.push(`Cấp bậc: ${filters.level}`);
    if (filters.formStatus !== 'all') {
      const statusLabels = {
        completed: 'Hoàn thành tất cả',
        incomplete: 'Chưa hoàn thành',
        partial: 'Hoàn thành một phần'
      };
      summary.push(`Forms: ${statusLabels[filters.formStatus]}`);
    }
    if (filters.status !== 'all') {
      summary.push(`Trạng thái: ${filters.status === 'Active' ? 'Đang làm việc' : 'Không hoạt động'}`);
    }
    return summary.join(' • ');
  };

  const renderCompactPanel = () => (
    <div className="filter-panel-compact">
      <div className="search-section-compact">
        <div className="search-input-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm nhân viên..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            className="search-input-compact"
          />
          {filters.searchQuery && (
            <button 
              onClick={() => handleFilterChange('searchQuery', '')}
              className="clear-search-btn"
              title="Xóa tìm kiếm"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`filter-toggle-btn ${activeFiltersCount > 0 ? 'has-filters' : ''}`}
          title="Mở bộ lọc nâng cao"
        >
          <Filter size={16} />
          {activeFiltersCount > 0 && (
            <span className="filter-count">{activeFiltersCount}</span>
          )}
          <ChevronDown 
            size={16} 
            className={`chevron ${isExpanded ? 'expanded' : ''}`} 
          />
        </button>
      </div>

      {isExpanded && (
        <div className="advanced-filters-compact">
          <div className="filter-row">
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="filter-select"
            >
              <option value="all">Tất cả phòng ban</option>
              {filterOptions.departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <select
              value={filters.businessUnit}
              onChange={(e) => handleFilterChange('businessUnit', e.target.value)}
              className="filter-select"
            >
              <option value="all">Tất cả BU</option>
              {filterOptions.businessUnits.map(bu => (
                <option key={bu} value={bu}>{bu}</option>
              ))}
            </select>
          </div>

          <div className="filter-row">
            <select
              value={filters.level}
              onChange={(e) => handleFilterChange('level', e.target.value)}
              className="filter-select"
            >
              <option value="all">Tất cả cấp bậc</option>
              {filterOptions.levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            <select
              value={filters.formStatus}
              onChange={(e) => handleFilterChange('formStatus', e.target.value)}
              className="filter-select"
            >
              <option value="all">Tất cả trạng thái form</option>
              <option value="completed">Hoàn thành tất cả (3/3)</option>
              <option value="partial">Hoàn thành một phần</option>
              <option value="incomplete">Chưa hoàn thành</option>
            </select>
          </div>

          <div className="filter-actions">
            {activeFiltersCount > 0 && (
              <button onClick={clearAllFilters} className="clear-filters-btn">
                <X size={14} />
                Xóa tất cả bộ lọc
              </button>
            )}
          </div>
        </div>
      )}

      {activeFiltersCount > 0 && !isExpanded && (
        <div className="filter-summary">
          <span className="summary-text">{getFilterSummary()}</span>
          <button onClick={clearAllFilters} className="clear-summary-btn">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );

  if (variant === 'compact') {
    return renderCompactPanel();
  }

  return (
    <div className="filter-panel">
      <div className="filter-panel-header">
        <div className="header-left">
          <Filter className="panel-icon" />
          <h3 className="panel-title">Bộ lọc và tìm kiếm</h3>
          {activeFiltersCount > 0 && (
            <span className="active-filters-badge">{activeFiltersCount} bộ lọc</span>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="expand-btn"
          title={isExpanded ? 'Thu gọn' : 'Mở rộng'}
        >
          <ChevronDown className={`chevron ${isExpanded ? 'expanded' : ''}`} />
        </button>
      </div>

      <div className="search-section">
        <div className="search-input-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, chức vụ..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            className="search-input"
          />
          {filters.searchQuery && (
            <button 
              onClick={() => handleFilterChange('searchQuery', '')}
              className="clear-search-btn"
              title="Xóa tìm kiếm"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="advanced-filters">
          <div className="filter-grid">
            <div className="filter-group">
              <label className="filter-label">
                <Building2 size={16} />
                Phòng ban
              </label>
              <select
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                className="filter-select"
              >
                <option value="all">Tất cả phòng ban</option>
                {filterOptions.departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">
                <Users size={16} />
                Business Unit
              </label>
              <select
                value={filters.businessUnit}
                onChange={(e) => handleFilterChange('businessUnit', e.target.value)}
                className="filter-select"
              >
                <option value="all">Tất cả BU</option>
                {filterOptions.businessUnits.map(bu => (
                  <option key={bu} value={bu}>{bu}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">
                <Users size={16} />
                Cấp bậc
              </label>
              <select
                value={filters.level}
                onChange={(e) => handleFilterChange('level', e.target.value)}
                className="filter-select"
              >
                <option value="all">Tất cả cấp bậc</option>
                {filterOptions.levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">
                <CheckSquare size={16} />
                Trạng thái Forms
              </label>
              <select
                value={filters.formStatus}
                onChange={(e) => handleFilterChange('formStatus', e.target.value)}
                className="filter-select"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="completed">Hoàn thành tất cả (3/3)</option>
                <option value="partial">Hoàn thành một phần (1-2/3)</option>
                <option value="incomplete">Chưa hoàn thành (0/3)</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">
                <Users size={16} />
                Tình trạng làm việc
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="filter-select"
              >
                <option value="all">Tất cả</option>
                <option value="Active">Đang làm việc</option>
                <option value="Inactive">Không hoạt động</option>
              </select>
            </div>
          </div>

          <div className="filter-actions">
            {activeFiltersCount > 0 && (
              <button onClick={clearAllFilters} className="clear-all-btn">
                <X size={16} />
                Xóa tất cả bộ lọc
              </button>
            )}
            <div className="filter-summary-text">
              {activeFiltersCount > 0 ? getFilterSummary() : 'Chưa có bộ lọc nào được áp dụng'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;