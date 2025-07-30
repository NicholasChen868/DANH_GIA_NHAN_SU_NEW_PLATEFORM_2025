import React, { useEffect, useState } from 'react';
import EnhancedEmployeeDashboard from './components/Dashboard/EnhancedEmployeeDashboard';
import { applyDynamicStyles } from './styles/DynamicStyles';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  
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
      <EnhancedEmployeeDashboard currentUser={currentUser} />
    </div>
  );
}

export default App;