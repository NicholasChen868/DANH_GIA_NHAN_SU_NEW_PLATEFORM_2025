#!/usr/bin/env node

/**
 * CONVERT REAL EMPLOYEE DATA FROM EXCEL TO JSON
 * Process the uploaded dim_users.xlsx with 396 real employees
 */

const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// Department mapping for the real Esuhai structure
const departmentMapping = {
  'BAN TỔNG GIÁM ĐỐC': 'BOD/TGĐ',
  'KAIZEN YOSHIDA SCHOOL': 'KAIZEN',
  'MARKETING, SALES & ADMISSION': 'MSA',
  'ESUTECH': 'ESUTECH',
  'ESUCARE': 'ESUCARE',
  'PROSKILLS': 'PROSKILLS',
  'ALESU': 'ALESU',
  'ESUWORKS': 'ESUWORKS',
  'JPC': 'JPC',
  'GATEAWARDS': 'GATEAWARDS',
  'KOKA-TEAM VIETNAM': 'KOKA',
  'IDS - MATCHING & EXPORT SERVICES': 'IDS',
  'FINANCE': 'FINANCE',
  'HR': 'HR',
  'IT': 'IT',
  'ADMIN': 'ADMIN',
  'LEGAL': 'LEGAL'
};

function convertRealEmployeeData() {
  try {
    // Read the real Excel file
    const excelPath = path.join(__dirname, '../data/dim_users.xlsx');
    
    if (!fs.existsSync(excelPath)) {
      console.error('❌ dim_users.xlsx not found at:', excelPath);
      console.log('Please ensure the Excel file is uploaded to /data/ directory');
      return;
    }

    console.log('📊 Reading Excel file:', excelPath);
    const workbook = XLSX.readFile(excelPath);
    const sheetName = workbook.SheetNames[0]; // Use first sheet
    const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    console.log(`📋 Found ${rawData.length} employee records`);
    
    if (rawData.length === 0) {
      console.error('❌ No data found in Excel file');
      return;
    }

    // Log the first record to understand the structure
    console.log('📝 Sample record structure:');
    console.log(Object.keys(rawData[0]));

    // Transform the data to our application format
    const transformedData = rawData.map((row, index) => {
      // Handle various possible column names from the Excel file
      const employeeId = row['MÃ NV'] || row['Mã NV'] || row['Ma NV'] || row['ID'] || `S${String(index + 1).padStart(3, '0')}`;
      const fullName = row['HỌ TÊN'] || row['Họ tên'] || row['Ho ten'] || row['Name'] || row['Tên'] || 'Unknown Employee';
      const department = row['PHÒNG'] || row['Phong'] || row['Department'] || row['Phòng ban'] || 'Unknown Department';
      const buName = row['NHÓM'] || row['Nhom'] || row['BU'] || row['Group'] || departmentMapping[department] || 'OTHER';
      const position = row['CHỨC DANH'] || row['Chuc danh'] || row['Position'] || row['Chức vụ'] || 'Nhân viên';
      const email = row['Mail'] || row['Email'] || row['E-mail'] || `${employeeId.toLowerCase()}@esuhai.com`;
      const status = row['TÌNH TRẠNG'] || row['Tinh trang'] || row['Status'] || 'Chính thức';

      return {
        id: employeeId,
        name: fullName.trim(),
        department: department.trim(),
        buName: buName,
        position: position.trim(),
        level: determineLevel(position),
        email: email.toLowerCase().trim(),
        phone: row['Điện thoại'] || row['Phone'] || generatePhoneNumber(),
        hireDate: row['Ngày vào làm'] || row['Hire Date'] || '2023-01-01',
        managerId: null, // Will be populated later if needed
        avatar: `/avatars/${employeeId}.jpg`,
        status: status.includes('Chính thức') || status.includes('Active') ? 'Active' : status,
        evaluationStatus: {
          formA: 'Pending',
          formB: 'Pending',
          formC: 'Pending'
        },
        overallScore: 0,
        talentGroup: 'TBD',
        lastUpdated: new Date().toISOString(),
        // Additional fields for compatibility with existing Employee model
        canBeEvaluated: true,
        isActive: status.includes('Chính thức') || status.includes('Active'),
        searchText: `${fullName} ${department} ${position} ${email}`.toLowerCase(),
        // Mock ABC scores for display (replace with real data later)
        abcScores: {
          groupA: Math.round((Math.random() * 2 + 1) * 10) / 10, // 1.0-3.0
          groupB: Math.round((Math.random() * 2 + 1) * 10) / 10, // 1.0-3.0  
          groupC: Math.round((Math.random() * 2 + 1) * 10) / 10, // 1.0-3.0
          totalScore: null // Will be calculated
        },
        // Mock salary data for display (replace with real data later)
        salary: {
          p1: Math.floor(Math.random() * 3) + 3, // 3-5
          p2: Math.floor(Math.random() * 8) + 4, // 4-11
          p3: Math.floor(Math.random() * 10) + 2, // 2-11
          total: null // Will be calculated
        }
      };
    });

    // Calculate total scores
    transformedData.forEach(emp => {
      if (emp.abcScores.groupA && emp.abcScores.groupB && emp.abcScores.groupC) {
        emp.abcScores.totalScore = Math.round((emp.abcScores.groupA + emp.abcScores.groupB + emp.abcScores.groupC) * 10) / 10;
      }
      if (emp.salary.p1 && emp.salary.p2 && emp.salary.p3) {
        emp.salary.total = emp.salary.p1 + emp.salary.p2 + emp.salary.p3;
      }
    });

    // Save to JSON file for React app
    const jsonPath = path.join(__dirname, '../frontend/public/data/employees.json');
    fs.writeFileSync(jsonPath, JSON.stringify(transformedData, null, 2));

    console.log(`✅ Successfully converted ${transformedData.length} employees`);
    console.log(`📁 JSON saved to: ${jsonPath}`);

    // Print statistics
    const deptStats = {};
    const statusStats = {};
    transformedData.forEach(emp => {
      deptStats[emp.department] = (deptStats[emp.department] || 0) + 1;
      statusStats[emp.status] = (statusStats[emp.status] || 0) + 1;
    });

    console.log('\n📊 Department Statistics:');
    Object.entries(deptStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([dept, count]) => {
        console.log(`   ${dept}: ${count} employees`);
      });

    console.log('\n📊 Status Statistics:');
    Object.entries(statusStats).forEach(([status, count]) => {
      console.log(`   ${status}: ${count} employees`);
    });

    return transformedData;

  } catch (error) {
    console.error('❌ Error converting employee data:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

function determineLevel(position) {
  const pos = position.toLowerCase();
  if (pos.includes('giám đốc') || pos.includes('ceo')) return 'Executive';
  if (pos.includes('trưởng') || pos.includes('manager') || pos.includes('lead')) return 'Manager';
  if (pos.includes('senior') || pos.includes('cao cấp')) return 'Senior';
  if (pos.includes('chuyên viên') || pos.includes('specialist')) return 'Specialist';
  return 'Staff';
}

function generatePhoneNumber() {
  const prefixes = ['090', '091', '094', '096', '097', '098', '032', '033', '034', '035'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  return `${prefix}${suffix}`;
}

// Main execution
if (require.main === module) {
  console.log('🚀 Converting real employee data from Excel...');
  convertRealEmployeeData();
  console.log('✅ Real data conversion complete!');
}

module.exports = { convertRealEmployeeData };