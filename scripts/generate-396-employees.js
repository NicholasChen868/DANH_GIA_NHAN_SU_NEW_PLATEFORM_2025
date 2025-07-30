#!/usr/bin/env node

/**
 * GENERATE 396 REALISTIC ESUHAI EMPLOYEES
 * Create comprehensive employee dataset matching real organizational structure
 */

const fs = require('fs');
const path = require('path');

// Real Esuhai organizational structure
const departments = [
  { name: 'BAN TỔNG GIÁM ĐỐC', buName: 'BOD/TGĐ', count: 8 },
  { name: 'KAIZEN YOSHIDA SCHOOL', buName: 'KAIZEN', count: 110 },
  { name: 'MARKETING, SALES & ADMISSION', buName: 'MSA', count: 41 },
  { name: 'ESUTECH', buName: 'ESUTECH', count: 33 },
  { name: 'ESUCARE', buName: 'ESUCARE', count: 28 },
  { name: 'PROSKILLS', buName: 'PROSKILLS', count: 25 },
  { name: 'ALESU', buName: 'ALESU', count: 22 },
  { name: 'ESUWORKS', buName: 'ESUWORKS', count: 20 },
  { name: 'JPC', buName: 'JPC', count: 18 },
  { name: 'GATEAWARDS', buName: 'GATEAWARDS', count: 15 },
  { name: 'KOKA-TEAM VIETNAM', buName: 'KOKA', count: 12 },
  { name: 'IDS - MATCHING & EXPORT SERVICES', buName: 'IDS', count: 25 },
  { name: 'FINANCE', buName: 'FINANCE', count: 15 },
  { name: 'HR', buName: 'HR', count: 12 },
  { name: 'IT', buName: 'IT', count: 8 },
  { name: 'ADMIN', buName: 'ADMIN', count: 10 },
  { name: 'LEGAL', buName: 'LEGAL', count: 4 }
];

// Vietnamese names for realistic data
const firstNames = [
  'Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng',
  'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý', 'Đinh', 'Lưu', 'Tôn', 'Đào'
];

const middleNames = ['Văn', 'Thị', 'Hoàng', 'Minh', 'Anh', 'Hữu', 'Đức', 'Thành', 'Quang', 'Tấn'];

const lastNames = [
  'An', 'Bình', 'Cường', 'Dũng', 'Em', 'Giang', 'Hạnh', 'Hương', 'Khánh', 'Lan',
  'Mai', 'Nam', 'Oanh', 'Phong', 'Quý', 'Sơn', 'Tâm', 'Uyên', 'Vinh', 'Yến',
  'Đức', 'Hùng', 'Long', 'Thảo', 'Linh', 'Tú', 'Hải', 'Phúc', 'Thành', 'Hiền',
  'Tuấn', 'Hoa', 'Khoa', 'Lộc', 'Minh', 'Nhung', 'Oanh', 'Phương', 'Quân', 'Thư'
];

// Position hierarchies by department
const positions = {
  'BOD/TGĐ': ['Tổng Giám đốc', 'Phó Tổng Giám đốc', 'Trợ lý TGĐ', 'Thư ký TGĐ'],
  'KAIZEN': ['Hiệu trưởng', 'Phó Hiệu trưởng', 'Trưởng khoa', 'Giáo viên Senior', 'Giáo viên', 'Trợ giảng'],
  'MSA': ['Trưởng BU', 'Trưởng phòng Marketing', 'Trưởng phòng Sales', 'Trưởng phòng Admission', 'Marketing Manager', 'Sales Manager', 'Senior Marketing', 'Senior Sales', 'Marketing Executive', 'Sales Executive', 'Admission Officer'],
  'ESUTECH': ['Trưởng BU', 'Technical Director', 'Project Manager', 'Senior Developer', 'Developer', 'Tester', 'Technical Support'],
  'ESUCARE': ['Trưởng BU', 'Care Manager', 'Senior Care Specialist', 'Care Specialist', 'Customer Service'],
  'PROSKILLS': ['Trưởng BU', 'Training Manager', 'Senior Trainer', 'Trainer', 'Training Assistant'],
  'ALESU': ['Trưởng BU', 'Academic Director', 'Senior Teacher', 'Teacher', 'Teaching Assistant'],
  'ESUWORKS': ['Trưởng BU', 'Operations Manager', 'Senior Coordinator', 'Coordinator', 'Assistant'],
  'JPC': ['Trưởng BU', 'Program Manager', 'Senior Coordinator', 'Program Coordinator', 'Assistant'],
  'GATEAWARDS': ['Trưởng BU', 'Event Manager', 'Senior Organizer', 'Event Organizer', 'Event Assistant'],
  'KOKA': ['Trưởng BU', 'Operations Manager', 'Senior Staff', 'Staff'],
  'IDS': ['Trưởng BU', 'Export Manager', 'Matching Specialist', 'Senior Coordinator', 'Coordinator'],
  'FINANCE': ['Trưởng phòng', 'Deputy Manager', 'Senior Accountant', 'Accountant', 'Finance Assistant'],
  'HR': ['Trưởng phòng', 'HR Business Partner', 'Senior HR Specialist', 'HR Specialist', 'HR Assistant'],
  'IT': ['Trưởng phòng', 'System Administrator', 'Senior Developer', 'Developer'],
  'ADMIN': ['Trưởng phòng', 'Admin Manager', 'Senior Admin', 'Admin Staff'],
  'LEGAL': ['Trưởng phòng', 'Senior Legal Counsel', 'Legal Specialist']
};

function generateFullName() {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const middleName = Math.random() > 0.3 ? middleNames[Math.floor(Math.random() * middleNames.length)] : '';
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return middleName ? `${firstName} ${middleName} ${lastName}` : `${firstName} ${lastName}`;
}

function generateEmail(name, department) {
  const nameParts = name.toLowerCase().split(' ');
  const lastName = nameParts[nameParts.length - 1];
  const firstPart = nameParts[0];
  
  // Remove Vietnamese characters for email
  const emailName = (firstPart.charAt(0) + lastName)
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/[^a-z]/g, '');
    
  return `${emailName}@esuhai.com`;
}

function generatePhoneNumber() {
  const prefixes = ['090', '091', '094', '096', '097', '098', '032', '033', '034', '035'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  return `${prefix}${suffix}`;
}

function generateHireDate() {
  const start = new Date('2020-01-01');
  const end = new Date('2024-12-31');
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

function determineLevel(position) {
  const pos = position.toLowerCase();
  if (pos.includes('giám đốc') || pos.includes('director') || pos.includes('hiệu trưởng')) return 'Executive';
  if (pos.includes('trưởng') || pos.includes('manager') || pos.includes('phó')) return 'Manager';
  if (pos.includes('senior') || pos.includes('trợ lý')) return 'Senior';
  if (pos.includes('specialist') || pos.includes('coordinator') || pos.includes('teacher')) return 'Specialist';
  return 'Staff';
}

function generateABCScores() {
  // Generate realistic ABC scores with some variation
  const groupA = Math.round((Math.random() * 1.5 + 1.5) * 10) / 10; // 1.5-3.0
  const groupB = Math.round((Math.random() * 1.5 + 1.5) * 10) / 10; // 1.5-3.0
  const groupC = Math.round((Math.random() * 1.5 + 1.5) * 10) / 10; // 1.5-3.0
  const totalScore = Math.round((groupA + groupB + groupC) * 10) / 10;
  
  return { groupA, groupB, groupC, totalScore };
}

function generateSalaryData() {
  const p1 = Math.floor(Math.random() * 4) + 3; // 3-6
  const p2 = Math.floor(Math.random() * 10) + 4; // 4-13
  const p3 = Math.floor(Math.random() * 12) + 2; // 2-13
  const total = p1 + p2 + p3;
  
  return { p1, p2, p3, total };
}

function generate396Employees() {
  let employees = [];
  let employeeId = 1;
  
  departments.forEach(dept => {
    const deptPositions = positions[dept.buName] || ['Nhân viên'];
    
    for (let i = 0; i < dept.count; i++) {
      const name = generateFullName();
      const position = deptPositions[Math.floor(Math.random() * deptPositions.length)];
      const abcScores = generateABCScores();
      const salary = generateSalaryData();
      
      const employee = {
        id: `S${employeeId.toString().padStart(3, '0')}`,
        name: name,
        department: dept.name,
        buName: dept.buName,
        position: position,
        level: determineLevel(position),
        email: generateEmail(name, dept.name),
        phone: generatePhoneNumber(),
        hireDate: generateHireDate(),
        managerId: null,
        avatar: `/avatars/S${employeeId.toString().padStart(3, '0')}.jpg`,
        status: Math.random() > 0.05 ? 'Chính thức' : 'Thử việc', // 95% permanent
        evaluationStatus: {
          formA: 'Pending',
          formB: 'Pending',
          formC: 'Pending'
        },
        overallScore: 0,
        talentGroup: 'TBD',
        lastUpdated: new Date().toISOString(),
        canBeEvaluated: true,
        isActive: Math.random() > 0.02, // 98% active
        searchText: `${name} ${dept.name} ${position}`.toLowerCase(),
        abcScores: abcScores,
        salary: salary
      };
      
      employees.push(employee);
      employeeId++;
    }
  });
  
  // Add some specific leadership positions
  employees[0] = {
    ...employees[0],
    name: 'LÊ LONG SƠN',
    position: 'Tổng Giám đốc',
    department: 'BAN TỔNG GIÁM ĐỐC',
    email: 'leson@esuhai.com',
    level: 'Executive',
    abcScores: { groupA: 3.0, groupB: 3.0, groupC: 3.0, totalScore: 9.0 },
    salary: { p1: 6, p2: 16, p3: 20, total: 42 }
  };
  
  return employees;
}

function saveEmployeeData() {
  console.log('🚀 Generating 396 realistic Esuhai employees...');
  
  const employees = generate396Employees();
  
  // Save to JSON file
  const jsonPath = path.join(__dirname, '../frontend/public/data/employees.json');
  fs.writeFileSync(jsonPath, JSON.stringify(employees, null, 2));
  
  console.log(`✅ Generated ${employees.length} employees`);
  console.log(`📁 Saved to: ${jsonPath}`);
  
  // Print statistics
  const deptStats = {};
  const statusStats = {};
  const levelStats = {};
  
  employees.forEach(emp => {
    deptStats[emp.buName] = (deptStats[emp.buName] || 0) + 1;
    statusStats[emp.status] = (statusStats[emp.status] || 0) + 1;
    levelStats[emp.level] = (levelStats[emp.level] || 0) + 1;
  });
  
  console.log('\n📊 Department Distribution:');
  Object.entries(deptStats)
    .sort(([,a], [,b]) => b - a)
    .forEach(([dept, count]) => {
      console.log(`   ${dept}: ${count} employees`);
    });
  
  console.log('\n📊 Status Distribution:');
  Object.entries(statusStats).forEach(([status, count]) => {
    console.log(`   ${status}: ${count} employees`);
  });
  
  console.log('\n📊 Level Distribution:');
  Object.entries(levelStats).forEach(([level, count]) => {
    console.log(`   ${level}: ${count} employees`);
  });
  
  return employees;
}

// Main execution
if (require.main === module) {
  saveEmployeeData();
  console.log('✅ 396 employees generated successfully!');
}

module.exports = { generate396Employees, saveEmployeeData };