import React, { useState } from 'react';

const EnhancedEmployeeCard = ({ employee }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleGenerateForm = async (formType, employee) => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      if (formType === 'A') {
        // Form A - Hồi ức cấp 3
        console.log('Opening Form A for:', employee.name);
        
        const baseUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfhk-cfvPrDlpRONfmdDo6L6w1N5UhdgAZecmYLmZNDcXw9HQ/viewform';
        const params = new URLSearchParams();
        
        // Add prefilled data
        params.append('entry.1704172586', employee.name || '');
        params.append('entry.1184622690', employee.id || '');
        params.append('entry.1121817413', employee.department || '');
        params.append('entry.1727774632', employee.buName || '');
        params.append('entry.875025279', employee.email || '');
        
        const formUrl = `${baseUrl}?${params.toString()}`;
        window.open(formUrl, '_blank');
        
      } else if (formType === 'B') {
        // Form B - Khai báo năng lực
        console.log('Opening Form B for:', employee.name);
        
        const baseUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSepXF4C3-dUrmoeBrW4e8v2re4DxsAyiboqc1yI-2VOvjVSiw/viewform';
        const params = new URLSearchParams();
        
        // Add prefilled data
        params.append('entry.1519666825', employee.name || '');
        params.append('entry.570205598', employee.email || '');
        params.append('entry.870287758', employee.id || '');
        params.append('entry.2096138668', employee.gender || '');
        params.append('entry.1655662338', employee.dob || '');
        params.append('entry.1894722077', employee.hometown || '');
        params.append('entry.712912742', employee.education || '');
        params.append('entry.1741978684', employee.department || '');
        
        const formUrl = `${baseUrl}?${params.toString()}`;
        window.open(formUrl, '_blank');
        
      } else if (formType === 'C') {
        // Form C - Đánh giá 360°
        console.log('Opening Form C for:', employee.name);
        
        const baseUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfmOf---sF1s90IzEHIaMo-MVTIUX1k5kn2pCYKkhY-q-n6Mg/viewform';
        const params = new URLSearchParams();
        
        // Add prefilled data
        params.append('entry.1583418077', employee.name || '');
        params.append('entry.2321785', employee.email || '');
        params.append('entry.594876381', employee.department || '');
        params.append('entry.1893283171', employee.position || '');
        params.append('entry.1710308065', employee.id || '');
        
        const formUrl = `${baseUrl}?${params.toString()}`;
        window.open(formUrl, '_blank');
      }
    } catch (error) {
      console.error(`Error opening Form ${formType}:`, error);
      alert(`Lỗi mở form: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getAvatarUrl = () => {
    if (imageError) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=random&color=fff&size=64`;
    }
    return employee.avatar;
  };

  const getLevelBadgeColor = () => {
    const colors = {
      'Executive': { bg: '#fef3c7', color: '#d97706', border: '#f59e0b' },
      'Management': { bg: '#dbeafe', color: '#1d4ed8', border: '#3b82f6' },
      'Senior': { bg: '#d1fae5', color: '#059669', border: '#10b981' },
      'Staff': { bg: '#f3f4f6', color: '#374151', border: '#6b7280' }
    };
    return colors[employee.level] || colors.Staff;
  };

  const getStatusColor = () => {
    return employee.status === 'Active' ? '#10b981' : '#ef4444';
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-5 min-h-[400px] relative ${employee.status.toLowerCase()}`}>
      
      <div className="pl-2">

        {/* TOP SECTION: Avatar + Basic Info */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={getAvatarUrl()}
              alt={employee.name}
              className="h-14 w-14 rounded-full object-cover border-2 border-gray-100"
              onError={handleImageError}
            />
            <div 
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
              style={{ backgroundColor: getStatusColor() }}
              title={`Trạng thái: ${employee.status === 'Active' ? 'Đang làm việc' : 'Không hoạt động'}`}
            />
          </div>
          <div className="flex-1 pr-20">
            <h3 className="text-lg font-bold text-gray-900 mb-1" title={employee.name}>
              {employee.name}
            </h3>
            <p className="text-sm text-gray-500">
              MNV: {employee.id}
            </p>
          </div>
        </div>

        {/* MIDDLE SECTION: Position & Department */}
        <div className="space-y-2 py-2 border-t border-gray-100 mt-4">
          <div className="flex items-start">
            <span className="text-gray-400 mr-2">•</span>
            <div className="flex flex-1">
              <span className="text-sm font-medium text-gray-600 w-24 flex-shrink-0">Chức danh: </span>
              <span className="text-sm text-gray-900 flex-1" title={employee.position}>
                {employee.position}
              </span>
            </div>
          </div>
          
          <div className="flex items-start">
            <span className="text-gray-400 mr-2">•</span>
            <div className="flex flex-1">
              <span className="text-sm font-medium text-gray-600 w-24 flex-shrink-0">Phòng ban: </span>
              <span className="text-sm text-gray-900 flex-1" title={employee.department}>
                {employee.department}
              </span>
            </div>
          </div>
          
          <div className="flex items-start">
            <span className="text-gray-400 mr-2">•</span>
            <div className="flex flex-1">
              <span className="text-sm font-medium text-gray-600 w-24 flex-shrink-0">Cấp bậc: </span>
              <span 
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: getLevelBadgeColor().bg,
                  color: getLevelBadgeColor().color,
                  border: `1px solid ${getLevelBadgeColor().border}20`
                }}
              >
                {employee.level}
              </span>
            </div>
          </div>
          
          <div className="flex items-start">
            <span className="text-gray-400 mr-2">•</span>
            <div className="flex flex-1">
              <span className="text-sm font-medium text-gray-600 w-24 flex-shrink-0">Nhóm: </span>
              <span className="text-sm text-gray-900 flex-1" title={employee.talentGroup}>
                {employee.talentGroup}
              </span>
            </div>
          </div>
        </div>

        {/* PERSONAL FORMS SECTION (A & B) */}
        <div className="space-y-4 py-4 border-t border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-semibold text-gray-700">Forms Cá nhân:</h4>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ring-1 ring-inset ${
              (employee.formStatus.formA && employee.formStatus.formB) ? 'bg-blue-100 text-blue-700 ring-blue-200' :
              (!employee.formStatus.formA && !employee.formStatus.formB) ? 'bg-red-100 text-red-700 ring-red-200' :
              'bg-orange-100 text-orange-700 ring-orange-200'
            }`}>
              {(employee.formStatus.formA ? 1 : 0) + (employee.formStatus.formB ? 1 : 0)}/2 hoàn thành
            </span>
          </div>
          
          {/* Form A & B indicators */}
          <div className="space-y-3 py-2">
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                employee.formStatus.formA ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {employee.formStatus.formA ? '✓' : '✗'}
              </div>
              {employee.formStatus.formA ? (
                <span className="text-sm text-blue-700 font-medium bg-blue-50 px-2 py-1 rounded">Form A - Đã hoàn thành</span>
              ) : (
                <div className="flex items-center flex-1">
                  <span className="text-sm text-gray-700 font-medium mr-3">Form A - Chưa hoàn thành</span>
                  <button
                    onClick={() => handleGenerateForm('A', employee)}
                    disabled={isGenerating}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1 rounded transition-colors duration-200 disabled:opacity-50"
                    title="Hoàn thành Form A - Hồi ức cấp 3"
                  >
                    {isGenerating ? 'Đang tạo...' : 'NỘP NGAY'}
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                employee.formStatus.formB ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {employee.formStatus.formB ? '✓' : '✗'}
              </div>
              {employee.formStatus.formB ? (
                <span className="text-sm text-blue-700 font-medium bg-blue-50 px-2 py-1 rounded">Form B - Đã hoàn thành</span>
              ) : (
                <div className="flex items-center flex-1">
                  <span className="text-sm text-gray-700 font-medium mr-3">Form B - Chưa hoàn thành</span>
                  <button
                    onClick={() => handleGenerateForm('B', employee)}
                    disabled={isGenerating}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1 rounded transition-colors duration-200 disabled:opacity-50"
                    title="Hoàn thành Form B - Khai báo năng lực"
                  >
                    {isGenerating ? 'Đang tạo...' : 'NỘP NGAY'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PEER EVALUATION SECTION (Form C) */}
        <div className="space-y-4 py-4 border-t border-gray-100">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Đánh giá 360độ</h4>
            {employee.formStatus.formC ? (
              <div className="space-y-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ring-1 ring-inset bg-blue-100 text-blue-700 ring-blue-200">
                  Đã đánh giá {employee.formCCount || 1} người
                </span>
                <div className="text-sm text-blue-700 font-medium bg-blue-50 px-2 py-1 rounded inline-block">
                  Được {employee.receivedVotes || 0} lượt bình chọn
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600 italic">
                Hãy dành thời gian cho việc ý nghĩa này <strong>{employee.name}</strong> nhé?
              </p>
            )}
          </div>

          {/* EVALUATION BUTTON - BOTTOM LEFT CORNER */}
          <div className="flex justify-start">
            <button
              onClick={() => handleGenerateForm('C', employee)}
              disabled={isGenerating}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-black px-4 py-2 rounded-md shadow-md transition-colors duration-200 disabled:opacity-50"
              title="Đánh giá 360° - Đánh giá đồng nghiệp"
            >
              {isGenerating ? 'Đang tạo...' : 'ĐÁNH GIÁ'}
            </button>
          </div>
        </div>

        {/* Deadline Info */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Hạn nộp:</span>
            <span className="text-sm font-bold text-red-600">4/8/2025</span>
          </div>
        </div>
        
        {/* Footer Info */}
        <div className="pt-2">
          <div className="text-xs text-gray-400">
            Cập nhật gần nhất: {new Date(employee.lastUpdated).toLocaleDateString('vi-VN')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedEmployeeCard;