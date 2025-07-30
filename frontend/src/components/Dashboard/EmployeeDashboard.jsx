import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Users, 
  TrendingUp, 
  Award, 
  Building2,
  RefreshCw,
  Download,
  Eye,
  Settings,
  X
} from 'lucide-react';

import EmployeeDataService from '../../services/EmployeeDataService';
import FormCService from '../../services/formCService';
import { EMPLOYEE_DEPARTMENTS, ABC_CATEGORIES } from '../../models/EmployeeModel';
import EmployeeCard from './EmployeeCard';
import StatisticsPanel from './StatisticsPanel';

const EmployeeDashboard = ({ currentUser }) => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPosition, setSelectedPosition] = useState('all');
  const [statistics, setStatistics] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Load initial data
  useEffect(() => {
    loadEmployees();
  }, []);

  // Filter employees based on search and filters
  useEffect(() => {
    let filtered = employees;

    // Apply search
    if (searchQuery.trim()) {
      filtered = EmployeeDataService.searchEmployees(searchQuery);
    }

    // Apply department filter
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(emp => emp.department === selectedDepartment);
    }

    // Apply ABC category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(emp => emp.getABCCategoryName() === selectedCategory);
    }

    // Apply position filter
    if (selectedPosition !== 'all') {
      filtered = filtered.filter(emp => emp.position === selectedPosition);
    }

    // Exclude current user for evaluation (compatibility with Form C)
    filtered = EmployeeDataService.getEvaluableEmployees(currentUser?.id);

    setFilteredEmployees(filtered);
  }, [employees, searchQuery, selectedDepartment, selectedCategory, selectedPosition, currentUser]);

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

  const handleRefresh = () => {
    loadEmployees();
  };

  const handleGenerateFormC = async (employee) => {
    try {
      // Use existing Form C service with employee's form data
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
    const csvData = employees.map(emp => ({
      'Mã NV': emp.employeeCode,
      'Họ Tên': emp.name,
      'Email': emp.email,
      'Phòng Ban': emp.department,
      'Chức Vụ': emp.position,
      'Điểm ABC': emp.abcScores.totalScore || 'N/A',
      'Phân Loại': emp.getABCCategoryName(),
      'Điểm Lương': emp.salary.total || 'N/A',
      'Cấp Lương': emp.getSalaryGrade(),
      'Ngày Vào Làm': emp.joinDate,
      'Kinh Nghiệm': emp.getYearsOfService() + ' năm',
      'Trạng Thái': emp.isActive ? 'Đang Làm' : 'Nghỉ Việc'
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(val => 
        typeof val === 'string' && val.includes(',') ? `"${val}"` : val
      ).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `esuhai_employees_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('all');
    setSelectedCategory('all');
    setSelectedPosition('all');
  };

  // Get unique positions for filter
  const availablePositions = useMemo(() => {
    const positions = [...new Set(employees.map(emp => emp.position))];
    return positions.sort();
  }, [employees]);

  // Get active filter count
  const activeFilterCount = [
    searchQuery.trim(),
    selectedDepartment !== 'all',
    selectedCategory !== 'all',
    selectedPosition !== 'all'
  ].filter(Boolean).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Đang tải dữ liệu nhân viên Esuhai...</p>
          <p className="text-gray-500 text-sm mt-2">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Building2 className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Dashboard Nhân Viên Esuhai
                </h1>
                <p className="text-sm text-gray-500">
                  Quản lý và đánh giá {statistics?.total || 0} nhân viên
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                className="flex items-center px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Làm mới
              </button>
              
              <button
                onClick={handleExportData}
                className="flex items-center px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Xuất Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Panel */}
        {statistics && (
          <StatisticsPanel statistics={statistics} className="mb-8" />
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm nhân viên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-3 py-2 text-sm rounded-lg border transition-colors ${
                  showFilters 
                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Bộ lọc
                {activeFilterCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Xóa lọc
                </button>
              )}

              {/* Results Count */}
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                {filteredEmployees.length} / {employees.length} nhân viên
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Department Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phòng ban
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Tất cả phòng ban</option>
                    {Object.values(EMPLOYEE_DEPARTMENTS).map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* ABC Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phân loại ABC
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Tất cả phân loại</option>
                    {ABC_CATEGORIES.map(category => (
                      <option key={category.name} value={category.name}>{category.name}</option>
                    ))}
                  </select>
                </div>

                {/* Position Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chức vụ
                  </label>
                  <select
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Tất cả chức vụ</option>
                    {availablePositions.map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Employee Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEmployees.map(employee => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onGenerateFormC={() => handleGenerateFormC(employee)}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredEmployees.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy nhân viên
            </h3>
            <p className="text-gray-600 mb-4">
              Thử thay đổi điều kiện tìm kiếm hoặc bộ lọc
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Xóa tất cả bộ lọc
              </button>
            )}
          </div>
        )}

        {/* Current User Info */}
        {currentUser && (
          <div className="mt-8 text-center text-sm text-gray-500">
            Đăng nhập với tư cách: <span className="font-medium text-gray-700">{currentUser.name}</span>
            {' '}({currentUser.position} - {currentUser.department})
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;