#!/usr/bin/env node

/**
 * CREATE DIM_USERS.XLSX GENERATOR
 * Tạo file Excel master data cho 442 nhân viên Esuhai
 */

const XLSX = require('xlsx');
const path = require('path');

// Sample data structure - sẽ replace bằng real data
const sampleEmployees = [
  {
    employee_id: 'ESU001',
    full_name: 'Nguyễn Văn An',
    department: 'Marketing',
    bu_name: 'MSA',
    position: 'Chuyên viên Marketing',
    level: 'Senior',
    email: 'an.nguyen@esuhai.com',
    phone: '0901234567',
    hire_date: '2023-01-15',
    manager_id: 'ESU015',
    avatar_url: '/avatars/ESU001.jpg',
    status: 'Active',
    form_a_status: 'Pending',
    form_b_status: 'Pending',
    form_c_status: 'Pending',
    overall_score: 0,
    talent_group: 'TBD',
    last_updated: new Date().toISOString()
  },
  // Add more sample data...
];

const departments = [
  { dept_code: 'MKT', dept_name: 'Marketing', dept_head: 'ESU050', bu_code: 'MSA' },
  { dept_code: 'SAL', dept_name: 'Sales', dept_head: 'ESU051', bu_code: 'MSA' },
  { dept_code: 'ADM', dept_name: 'Admission', dept_head: 'ESU052', bu_code: 'MSA' },
  // Add all departments...
];

const buMapping = [
  { bu_code: 'MSA', bu_full_name: 'Marketing, Sales & Admission', bu_head: 'ESU025', form_type: 'MSA' },
  { bu_code: 'IDS', bu_full_name: 'International Development Services', bu_head: 'ESU026', form_type: 'IDS' },
  // Add all 20 BUs...
];

function createDimUsersExcel() {
  const workbook = XLSX.utils.book_new();
  
  // Sheet 1: EMPLOYEES
  const employeesWS = XLSX.utils.json_to_sheet(sampleEmployees);
  XLSX.utils.book_append_sheet(workbook, employeesWS, 'EMPLOYEES');
  
  // Sheet 2: DEPARTMENTS
  const departmentsWS = XLSX.utils.json_to_sheet(departments);
  XLSX.utils.book_append_sheet(workbook, departmentsWS, 'DEPARTMENTS');
  
  // Sheet 3: BU_MAPPING
  const buMappingWS = XLSX.utils.json_to_sheet(buMapping);
  XLSX.utils.book_append_sheet(workbook, buMappingWS, 'BU_MAPPING');
  
  // Save file
  const outputPath = path.join(__dirname, '../data/dim_users.xlsx');
  XLSX.writeFile(workbook, outputPath);
  
  console.log(`✅ Created dim_users.xlsx with ${sampleEmployees.length} employees`);
  console.log(`📁 File location: ${outputPath}`);
  
  return outputPath;
}

function convertToJSON() {
  const excelPath = path.join(__dirname, '../data/dim_users.xlsx');
  const workbook = XLSX.readFile(excelPath);
  const employees = XLSX.utils.sheet_to_json(workbook.Sheets['EMPLOYEES']);
  
  // Transform for React app
  const transformedData = employees.map(row => ({
    id: row.employee_id,
    name: row.full_name,
    department: row.department,
    buName: row.bu_name,
    position: row.position,
    level: row.level,
    email: row.email,
    phone: row.phone,
    hireDate: row.hire_date,
    managerId: row.manager_id,
    avatar: row.avatar_url || '/avatars/default.jpg',
    status: row.status || 'Active',
    evaluationStatus: {
      formA: row.form_a_status || 'Pending',
      formB: row.form_b_status || 'Pending',
      formC: row.form_c_status || 'Pending'
    },
    overallScore: row.overall_score || 0,
    talentGroup: row.talent_group || 'TBD',
    lastUpdated: row.last_updated || new Date().toISOString()
  }));
  
  // Save JSON for React app
  const jsonPath = path.join(__dirname, '../frontend/public/data/employees.json');
  require('fs').writeFileSync(jsonPath, JSON.stringify(transformedData, null, 2));
  
  console.log(`✅ Converted to JSON: ${transformedData.length} employees`);
  console.log(`📁 JSON location: ${jsonPath}`);
  
  return transformedData;
}

// Main execution
if (require.main === module) {
  console.log('🚀 Creating DIM_USERS.XLSX...');
  createDimUsersExcel();
  convertToJSON();
  console.log('✅ Setup complete! Ready for 442 employee integration.');
}

module.exports = { createDimUsersExcel, convertToJSON };
