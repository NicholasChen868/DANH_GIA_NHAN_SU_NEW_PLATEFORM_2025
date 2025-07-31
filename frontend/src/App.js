import React, { useEffect, useState } from 'react';
import EnhancedEmployeeDashboard from './components/Dashboard/EnhancedEmployeeDashboard';
import Dashboard19Nhom from './components/Dashboard/Dashboard19Nhom';
import { applyDynamicStyles } from './styles/DynamicStyles';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeView, setActiveView] = useState('employee'); // 'employee' or '19nhom'
  
  useEffect(() => {
    // Apply dynamic styles when app loads
    applyDynamicStyles();
    
    // Set mock current user for testing
    // In production, this would come from authentication
    setCurrentUser({
      id: 'ESU001',
      name: 'Nguyễn Văn Admin',
      email: 'admin@esuhai.com',
      department: 'Công Nghệ Thông Tin',
      position: 'Trưởng Phòng IT',
      employeeCode: 'ESU001'
    });
  }, []);
  
  return (
    <div className="App">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b mb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              🏢 Esuhai Employee Management System
            </h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveView('employee')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeView === 'employee' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                👥 Employee Dashboard
              </button>
              <button
                onClick={() => setActiveView('19nhom')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeView === '19nhom' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📊 19 Nhóm Chuẩn
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {activeView === 'employee' ? (
        <EnhancedEmployeeDashboard currentUser={currentUser} />
      ) : (
        <Dashboard19Nhom />
      )}
    </div>
  );
}

export default App;