import React from 'react';
import { 
  Users, 
  Building2, 
  Award, 
  TrendingUp, 
  DollarSign,
  UserCheck,
  UserX,
  Star,
  BarChart3
} from 'lucide-react';

const StatisticsPanel = ({ statistics, className = '' }) => {
  if (!statistics) return null;
  
  // Calculate percentages
  const activePercentage = statistics.total > 0 ? Math.round((statistics.active / statistics.total) * 100) : 0;
  
  // Get top departments
  const topDepartments = Object.entries(statistics.byDepartment)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);
  
  // Get ABC distribution
  const abcDistribution = Object.entries(statistics.byABCCategory)
    .sort(([,a], [,b]) => b - a);
  
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {/* Total Employees */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Tổng Nhân Viên</p>
            <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
            <div className="flex items-center mt-1">
              <UserCheck className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">
                {statistics.active} đang làm ({activePercentage}%)
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Department Distribution */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <Building2 className="w-6 h-6 text-purple-600 mr-2" />
          <h3 className="text-sm font-medium text-gray-900">Phòng Ban Lớn Nhất</h3>
        </div>
        <div className="space-y-2">
          {topDepartments.map(([dept, count], index) => (
            <div key={dept} className="flex justify-between items-center">
              <span className="text-sm text-gray-600 truncate">
                {dept.length > 20 ? dept.substring(0, 20) + '...' : dept}
              </span>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900 mr-2">{count}</span>
                <div className={`w-2 h-2 rounded-full ${
                  index === 0 ? 'bg-purple-500' : 
                  index === 1 ? 'bg-purple-400' : 'bg-purple-300'
                }`} />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* ABC Performance */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <Star className="w-6 h-6 text-yellow-600 mr-2" />
          <h3 className="text-sm font-medium text-gray-900">Phân Loại ABC</h3>
        </div>
        <div className="space-y-2">
          {abcDistribution.slice(0, 3).map(([category, count], index) => {
            const percentage = Math.round((count / statistics.total) * 100);
            const colors = [
              'bg-green-500', 'bg-yellow-500', 'bg-blue-500',
              'bg-purple-500', 'bg-cyan-500', 'bg-orange-500', 'bg-red-500'
            ];
            
            return (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${colors[index]} mr-2`} />
                  <span className="text-sm text-gray-600">
                    {category.length > 12 ? category.substring(0, 12) + '...' : category}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                  <span className="text-xs text-gray-500 ml-1">({percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Salary Statistics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <DollarSign className="w-6 h-6 text-green-600 mr-2" />
          <h3 className="text-sm font-medium text-gray-900">Thống Kê Lương</h3>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-600">Trung Bình</p>
            <p className="text-lg font-bold text-gray-900">
              {statistics.salaryDistribution.average} điểm
            </p>
          </div>
          
          <div className="space-y-1">
            {Object.entries(statistics.salaryDistribution.grades)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 3)
              .map(([grade, count]) => (
                <div key={grade} className="flex justify-between text-sm">
                  <span className="text-gray-600">{grade}</span>
                  <span className="font-medium text-gray-900">{count} người</span>
                </div>
              ))
            }
          </div>
        </div>
      </div>
      
      {/* Extended Statistics Row */}
      <div className="lg:col-span-4 bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <BarChart3 className="w-6 h-6 text-indigo-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Thống Kê Chi Tiết</h3>
          <div className="ml-auto text-sm text-gray-500">
            Cập nhật: {statistics.lastUpdated?.toLocaleString('vi-VN') || 'N/A'}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Department Breakdown */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Phân Bổ Phòng Ban</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {Object.entries(statistics.byDepartment)
                .sort(([,a], [,b]) => b - a)
                .map(([dept, count]) => {
                  const percentage = Math.round((count / statistics.total) * 100);
                  return (
                    <div key={dept} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 truncate" title={dept}>
                        {dept.length > 25 ? dept.substring(0, 25) + '...' : dept}
                      </span>
                      <div className="text-right">
                        <span className="font-medium text-gray-900">{count}</span>
                        <span className="text-gray-500 ml-1">({percentage}%)</span>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
          
          {/* Position Breakdown */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Phân Bổ Chức Vụ</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {Object.entries(statistics.byPosition)
                .sort(([,a], [,b]) => b - a)
                .map(([position, count]) => {
                  const percentage = Math.round((count / statistics.total) * 100);
                  return (
                    <div key={position} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 truncate" title={position}>
                        {position.length > 20 ? position.substring(0, 20) + '...' : position}
                      </span>
                      <div className="text-right">
                        <span className="font-medium text-gray-900">{count}</span>
                        <span className="text-gray-500 ml-1">({percentage}%)</span>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
          
          {/* ABC Category Breakdown */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Phân Loại ABC Đầy Đủ</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {abcDistribution.map(([category, count]) => {
                const percentage = Math.round((count / statistics.total) * 100);
                return (
                  <div key={category} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{category}</span>
                    <div className="text-right">
                      <span className="font-medium text-gray-900">{count}</span>
                      <span className="text-gray-500 ml-1">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;