import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  Calendar, 
  Award, 
  DollarSign, 
  Eye,
  FileText,
  Star,
  Users,
  Building2
} from 'lucide-react';

const EmployeeCard = ({ employee, onGenerateFormC, onViewDetails }) => {
  const [isGeneratingForm, setIsGeneratingForm] = useState(false);
  
  const handleGenerateFormC = async () => {
    if (isGeneratingForm) return;
    
    setIsGeneratingForm(true);
    try {
      await onGenerateFormC(employee);
    } catch (error) {
      console.error('Error generating Form C:', error);
    } finally {
      setIsGeneratingForm(false);
    }
  };
  
  const abcCategory = employee.getABCCategory();
  const salaryGrade = employee.getSalaryGrade();
  const yearsOfService = employee.getYearsOfService();
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      {/* Header with Avatar and Basic Info */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start space-x-3">
          <img
            src={employee.avatar}
            alt={employee.name}
            className="w-12 h-12 rounded-full object-cover bg-gray-200"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=random&color=fff&size=64`;
            }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {employee.name}
            </h3>
            <p className="text-xs text-gray-600 truncate">
              {employee.position}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {employee.department}
            </p>
          </div>
          <div className="flex flex-col items-end space-y-1">
            {/* ABC Category Badge */}
            <div 
              className="px-2 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: abcCategory.bgColor,
                color: abcCategory.color
              }}
            >
              {abcCategory.name}
            </div>
            {/* Employee Code */}
            <span className="text-xs text-gray-400 font-mono">
              {employee.employeeCode}
            </span>
          </div>
        </div>
      </div>
      
      {/* Employee Details */}
      <div className="p-4 space-y-3">
        {/* Contact Info */}
        <div className="space-y-2">
          <div className="flex items-center text-xs text-gray-600">
            <Mail className="w-3 h-3 mr-2 flex-shrink-0" />
            <span className="truncate">{employee.email}</span>
          </div>
          {employee.phone && (
            <div className="flex items-center text-xs text-gray-600">
              <Phone className="w-3 h-3 mr-2 flex-shrink-0" />
              <span>{employee.phone}</span>
            </div>
          )}
          <div className="flex items-center text-xs text-gray-600">
            <Calendar className="w-3 h-3 mr-2 flex-shrink-0" />
            <span>{yearsOfService} năm kinh nghiệm</span>
          </div>
        </div>
        
        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-2">
          {/* ABC Score */}
          {employee.abcScores.totalScore && (
            <div className="bg-blue-50 p-2 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="w-3 h-3 text-blue-600 mr-1" />
                  <span className="text-xs text-blue-700 font-medium">ABC</span>
                </div>
                <span className="text-sm font-bold text-blue-800">
                  {employee.abcScores.totalScore.toFixed(1)}
                </span>
              </div>
              {/* ABC Breakdown */}
              <div className="mt-1 flex justify-between text-xs text-blue-600">
                <span>A:{employee.abcScores.groupA?.toFixed(1) || 'N/A'}</span>
                <span>B:{employee.abcScores.groupB?.toFixed(1) || 'N/A'}</span>
                <span>C:{employee.abcScores.groupC?.toFixed(1) || 'N/A'}</span>
              </div>
            </div>
          )}
          
          {/* Salary Grade */}
          {employee.salary.total && (
            <div className="bg-green-50 p-2 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="w-3 h-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-700 font-medium">Lương</span>
                </div>
                <span className="text-sm font-bold text-green-800">
                  {salaryGrade}
                </span>
              </div>
              <div className="mt-1 text-xs text-green-600">
                Tổng: {employee.salary.total} điểm
              </div>
            </div>
          )}
        </div>
        
        {/* Detailed Scores (if available) */}
        {employee.salary.total && (
          <div className="bg-gray-50 p-2 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Chi tiết lương:</div>
            <div className="grid grid-cols-3 gap-1 text-xs">
              <div className="text-center">
                <div className="text-gray-500">P1</div>
                <div className="font-medium">{employee.salary.p1 || 0}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-500">P2</div>
                <div className="font-medium">{employee.salary.p2 || 0}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-500">P3</div>
                <div className="font-medium">{employee.salary.p3 || 0}</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex space-x-2">
          <button
            onClick={handleGenerateFormC}
            disabled={isGeneratingForm || !employee.canBeEvaluated}
            className={`flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
              isGeneratingForm || !employee.canBeEvaluated
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isGeneratingForm ? (
              <>
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-2" />
                Đang tạo...
              </>
            ) : (
              <>
                <FileText className="w-3 h-3 mr-2" />
                Đánh giá
              </>
            )}
          </button>
          
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(employee)}
              className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors"
            >
              <Eye className="w-3 h-3" />
            </button>
          )}
        </div>
        
        {!employee.canBeEvaluated && (
          <div className="mt-2 text-xs text-red-600 text-center">
            Không thể đánh giá
          </div>
        )}
      </div>
      
      {/* Status Indicator */}
      <div className="absolute top-2 right-2">
        <div className={`w-2 h-2 rounded-full ${
          employee.isActive ? 'bg-green-400' : 'bg-gray-400'
        }`} title={employee.isActive ? 'Đang làm việc' : 'Nghỉ việc'} />
      </div>
    </div>
  );
};

export default EmployeeCard;