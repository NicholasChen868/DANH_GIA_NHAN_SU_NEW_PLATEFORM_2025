#!/usr/bin/env node

/**
 * ENHANCED DATA GENERATOR FOR ESUHAI EMPLOYEE DASHBOARD
 * Generates 420+ realistic employee records with form status simulation
 */

const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// Esuhai's actual business unit structure
const BUSINESS_UNITS = [
  { code: 'BOD', name: 'Ban Tổng Giám Đốc', fullName: 'BOD/TGĐ', type: 'executive' },
  { code: 'MSA', name: 'Marketing, Sales & Admission', fullName: 'MS & AS', type: 'business' },
  { code: 'IDS', name: 'International Development Services', fullName: 'IDS', type: 'business' },
  { code: 'FIN', name: 'Tài Chính', fullName: 'Finance', type: 'support' },
  { code: 'HR', name: 'Nhân Sự', fullName: 'Human Resources', type: 'support' },
  { code: 'IT', name: 'Công Nghệ Thông Tin', fullName: 'Information Technology', type: 'support' },
  { code: 'ADM', name: 'Hành Chính', fullName: 'Administration', type: 'support' },
  { code: 'LEG', name: 'Pháp Chế', fullName: 'Legal', type: 'support' },
  { code: 'KAI', name: 'Kaizen', fullName: 'Kaizen Team', type: 'improvement' },
  { code: 'PRO', name: 'ProSkills', fullName: 'ProSkills Division', type: 'training' },
  { code: 'ESC', name: 'EsuCare', fullName: 'EsuCare Services', type: 'service' },
  { code: 'EST', name: 'EsuTech', fullName: 'EsuTech Solutions', type: 'technology' },
  { code: 'KOK', name: 'Koka-Team', fullName: 'Koka Team', type: 'special' },
  { code: 'ESW', name: 'EsuWorks', fullName: 'EsuWorks Platform', type: 'platform' },
  { code: 'ALE', name: 'ALESU', fullName: 'ALESU Services', type: 'service' },
  { code: 'JPC', name: 'JPC', fullName: 'Joint Project Center', type: 'project' },
  { code: 'GAT', name: 'GateAwards', fullName: 'GateAwards Platform', type: 'platform' }
];

// Position hierarchy
const POSITIONS = {
  executive: ['Tổng Giám đốc', 'Phó Tổng Giám đốc', 'Giám đốc điều hành'],
  management: ['Trưởng BU', 'Phó Trưởng BU', 'Trưởng Phòng', 'Phó Trưởng Phòng'],
  team_lead: ['Team Leader', 'Chuyên viên cao cấp', 'Chuyên gia'],
  senior: ['Chuyên viên chính', 'Chuyên viên', 'Kỹ sư'],
  junior: ['Nhân viên', 'Thực tập sinh', 'Hỗ trợ']
};

// Vietnamese names for realistic data
const FIRST_NAMES = [
  'Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng',
  'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý', 'Mai', 'Đào', 'Vương', 'Lưu'
];

const MIDDLE_NAMES = ['Văn', 'Thị', 'Minh', 'Quang', 'Anh', 'Thanh', 'Hữu', 'Đức', 'Thế', 'Kim'];

const LAST_NAMES = [
  'An', 'Bình', 'Cường', 'Dũng', 'Em', 'Giang', 'Hòa', 'Khánh', 'Linh', 'Minh',
  'Nam', 'Oanh', 'Phương', 'Quân', 'Sơn', 'Thành', 'Uyên', 'Vân', 'Xuân', 'Yến'
];

// Form completion simulation patterns
function generateFormStatus(position, department, joinDate) {
  const seniority = new Date() - new Date(joinDate);
  const monthsWorked = seniority / (1000 * 60 * 60 * 24 * 30);
  
  // More senior employees more likely to complete forms
  let baseRate = 0.4;
  if (monthsWorked > 12) baseRate = 0.7;
  if (monthsWorked > 24) baseRate = 0.8;
  
  // Management positions have higher completion rates
  if (position.includes('Trưởng') || position.includes('Giám đốc')) {
    baseRate += 0.2;
  }
  
  return {
    formA: Math.random() < baseRate + 0.1, // Form A (self-reflection) - highest completion
    formB: Math.random() < baseRate, // Form B (competency) - medium completion
    formC: Math.random() < baseRate - 0.1 // Form C (360 evaluation) - lowest completion
  };
}

function generateRandomName() {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const middleName = MIDDLE_NAMES[Math.floor(Math.random() * MIDDLE_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${firstName} ${middleName} ${lastName}`;
}

function generateEmployeeId(index) {
  return `ESU${String(index + 1).padStart(3, '0')}`;
}

function generateEmail(name, bu) {
  const cleanName = name.toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ỳýỵỷỹ]/g, 'y');
  
  const parts = cleanName.split(' ');
  const firstName = parts[parts.length - 1];
  const lastName = parts[0];
  
  return `${firstName}.${lastName}@esuhai.com`;
}

function generateHireDate() {
  const start = new Date(2020, 0, 1);
  const end = new Date(2024, 11, 31);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    .toISOString().split('T')[0];
}

function assignPositionToBU(bu) {
  const positions = [];
  
  if (bu.type === 'executive') {
    positions.push(...POSITIONS.executive, ...POSITIONS.management.slice(0, 2));
  } else if (bu.type === 'support' || bu.type === 'business') {
    positions.push(...POSITIONS.management, ...POSITIONS.team_lead, ...POSITIONS.senior);
  } else {
    positions.push(...POSITIONS.team_lead, ...POSITIONS.senior, ...POSITIONS.junior);
  }
  
  return positions[Math.floor(Math.random() * positions.length)];
}

function generateEmployeesData(count = 442) {
  const employees = [];
  
  for (let i = 0; i < count; i++) {
    const bu = BUSINESS_UNITS[Math.floor(Math.random() * BUSINESS_UNITS.length)];
    const name = generateRandomName();
    const position = assignPositionToBU(bu);
    const hireDate = generateHireDate();
    const employeeId = generateEmployeeId(i);
    
    const formStatus = generateFormStatus(position, bu.name, hireDate);
    
    const employee = {
      id: employeeId,
      name: name,
      department: bu.name,
      buName: bu.code,
      buFullName: bu.fullName,
      position: position,
      level: position.includes('Giám đốc') ? 'Executive' : 
             position.includes('Trưởng') ? 'Management' :
             position.includes('Leader') || position.includes('cao cấp') ? 'Senior' : 'Staff',
      email: generateEmail(name, bu.code),
      phone: `09${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
      hireDate: hireDate,
      managerId: i > 0 ? `ESU${String(Math.floor(Math.random() * Math.min(i, 50)) + 1).padStart(3, '0')}` : null,
      avatar: `/avatars/${employeeId}.jpg`,
      status: Math.random() > 0.05 ? 'Active' : 'Inactive', // 95% active
      formStatus: formStatus,
      evaluationStatus: {
        formA: formStatus.formA ? 'Completed' : 'Pending',
        formB: formStatus.formB ? 'Completed' : 'Pending',
        formC: formStatus.formC ? 'Completed' : 'Pending'
      },
      completedForms: [formStatus.formA, formStatus.formB, formStatus.formC].filter(Boolean).length,
      overallScore: 0,
      talentGroup: 'TBD',
      canBeEvaluated: true,
      lastUpdated: new Date().toISOString()
    };
    
    employees.push(employee);
  }
  
  // Ensure we have some executives
  employees[0].name = 'LÊ LONG SƠN';
  employees[0].position = 'Tổng Giám đốc';
  employees[0].department = 'Ban Tổng Giám Đốc';
  employees[0].level = 'Executive';
  employees[0].email = 'leson@esuhai.com';
  
  return employees;
}

function createDepartmentMapping() {
  return BUSINESS_UNITS.map((bu, index) => ({
    id: `DEPT${String(index + 1).padStart(3, '0')}`,
    code: bu.code,
    name: bu.name,
    fullName: bu.fullName,
    type: bu.type,
    headCount: Math.floor(Math.random() * 50) + 10,
    isActive: true
  }));
}

function generateEnhancedData() {
  console.log('🚀 Generating enhanced employee data...');
  
  // Generate 442 employees
  const employees = generateEmployeesData(442);
  const departments = createDepartmentMapping();
  
  console.log(`✅ Generated ${employees.length} employees across ${departments.length} departments`);
  
  // Calculate statistics
  const stats = {
    total: employees.length,
    active: employees.filter(e => e.status === 'Active').length,
    byDepartment: employees.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {}),
    formCompletion: {
      formA: employees.filter(e => e.formStatus.formA).length,
      formB: employees.filter(e => e.formStatus.formB).length,
      formC: employees.filter(e => e.formStatus.formC).length
    },
    completionRates: {
      formA: (employees.filter(e => e.formStatus.formA).length / employees.length * 100).toFixed(1),
      formB: (employees.filter(e => e.formStatus.formB).length / employees.length * 100).toFixed(1),
      formC: (employees.filter(e => e.formStatus.formC).length / employees.length * 100).toFixed(1)
    }
  };
  
  console.log('📊 Statistics:');
  console.log(`- Total employees: ${stats.total}`);
  console.log(`- Active employees: ${stats.active}`);
  console.log(`- Form A completion: ${stats.completionRates.formA}%`);
  console.log(`- Form B completion: ${stats.completionRates.formB}%`);
  console.log(`- Form C completion: ${stats.completionRates.formC}%`);
  
  // Save to JSON for React app
  const jsonPath = path.join(__dirname, '../frontend/public/data/employees.json');
  fs.writeFileSync(jsonPath, JSON.stringify(employees, null, 2));
  
  // Save departments
  const deptPath = path.join(__dirname, '../frontend/public/data/departments.json');
  fs.writeFileSync(deptPath, JSON.stringify(departments, null, 2));
  
  // Save statistics
  const statsPath = path.join(__dirname, '../frontend/public/data/statistics.json');
  fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));
  
  console.log(`📁 Files created:`);
  console.log(`- ${jsonPath}`);
  console.log(`- ${deptPath}`);
  console.log(`- ${statsPath}`);
  
  return { employees, departments, stats };
}

// Main execution
if (require.main === module) {
  try {
    generateEnhancedData();
    console.log('✅ Enhanced data generation complete!');
  } catch (error) {
    console.error('❌ Error generating data:', error);
    process.exit(1);
  }
}

module.exports = { generateEnhancedData, generateFormStatus };