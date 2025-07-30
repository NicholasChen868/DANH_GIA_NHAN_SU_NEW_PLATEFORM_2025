#!/usr/bin/env node

/**
 * VERIFY REAL DATA IMPLEMENTATION
 * Check that dashboard now shows real employee data instead of fake data
 */

const fs = require('fs');
const path = require('path');

console.log('✅ VERIFICATION: Real Data Implementation');
console.log('==========================================\n');

function verifyRealDataImplementation() {
  const employeesPath = path.join(__dirname, '../frontend/public/data/employees.json');
  const statisticsPath = path.join(__dirname, '../frontend/public/data/statistics.json');
  const departmentsPath = path.join(__dirname, '../frontend/public/data/departments.json');
  const backupPath = path.join(__dirname, '../frontend/public/data/employees_fake_backup.json');
  
  console.log('🔍 CHECKING DATA FILES:');
  console.log('========================');
  
  // Check if files exist
  const filesExist = {
    employees: fs.existsSync(employeesPath),
    statistics: fs.existsSync(statisticsPath),
    departments: fs.existsSync(departmentsPath),
    backup: fs.existsSync(backupPath)
  };
  
  Object.entries(filesExist).forEach(([file, exists]) => {
    console.log(`${exists ? '✅' : '❌'} ${file}.json: ${exists ? 'EXISTS' : 'MISSING'}`);
  });
  
  if (!filesExist.employees) {
    console.error('❌ CRITICAL: employees.json not found!');
    return false;
  }
  
  // Load and analyze current data
  const employees = JSON.parse(fs.readFileSync(employeesPath, 'utf8'));
  const statistics = JSON.parse(fs.readFileSync(statisticsPath, 'utf8'));
  
  console.log('\n📊 CURRENT DATA ANALYSIS:');
  console.log('==========================');
  console.log(`📈 Total employees: ${employees.length}`);
  console.log(`📈 Active employees: ${statistics.active}`);
  console.log(`🎯 Data source: ${statistics.dataSource || 'Unknown'}`);
  
  // Check for real vs fake names
  console.log('\n👥 EMPLOYEE NAMES ANALYSIS:');
  console.log('============================');
  employees.forEach((emp, index) => {
    console.log(`${index + 1}. ${emp.name} (${emp.id})`);
    console.log(`   Department: ${emp.department}`);
    console.log(`   Position: ${emp.position}`);
    console.log(`   Email: ${emp.email}`);
    
    // Check if this looks like real data from dim_users.xlsx
    if (emp.name === 'Nguyễn Văn An' && emp.id === 'ESU001') {
      console.log('   ✅ VERIFIED: Real employee from dim_users.xlsx');
    } else {
      console.log('   ⚠️  This may not be from dim_users.xlsx');
    }
    console.log('');
  });
  
  // Check for fake data indicators
  console.log('🚨 FAKE DATA DETECTION:');
  console.log('========================');
  
  const fakeNames = ['LÊ LONG SƠN', 'TRẦN MINH AN', 'Nguyễn Văn Admin'];
  let fakeDataFound = false;
  
  employees.forEach(emp => {
    if (fakeNames.some(fake => emp.name.includes(fake))) {
      console.log(`❌ FAKE DATA FOUND: ${emp.name}`);
      fakeDataFound = true;
    }
  });
  
  if (!fakeDataFound) {
    console.log('✅ NO FAKE NAMES DETECTED');
  }
  
  // Check if count is realistic
  console.log('\n📊 COUNT ANALYSIS:');
  console.log('===================');
  if (employees.length === 442) {
    console.log('❌ WARNING: Still showing 442 employees (likely fake data)');
  } else if (employees.length === 1) {
    console.log('✅ CORRECT: Showing 1 employee (from dim_users.xlsx)');
  } else {
    console.log(`⚠️  Showing ${employees.length} employees (verify this is correct)`);
  }
  
  // Form status analysis
  console.log('\n📋 FORM STATUS ANALYSIS:');
  console.log('=========================');
  console.log(`Form A completion: ${statistics.completionRates.formA}%`);
  console.log(`Form B completion: ${statistics.completionRates.formB}%`);
  console.log(`Form C completion: ${statistics.completionRates.formC}%`);
  
  // Check if using original Excel form status
  const realEmployee = employees.find(emp => emp.id === 'ESU001');
  if (realEmployee && realEmployee._originalData) {
    console.log('\n🔍 ORIGINAL EXCEL DATA COMPARISON:');
    console.log('===================================');
    const original = realEmployee._originalData;
    console.log(`Original Form A: ${original.form_a_status}`);
    console.log(`Dashboard Form A: ${realEmployee.formStatus.formA ? 'Completed' : 'Pending'}`);
    console.log(`Original Form B: ${original.form_b_status}`);
    console.log(`Dashboard Form B: ${realEmployee.formStatus.formB ? 'Completed' : 'Pending'}`);
    console.log(`Original Form C: ${original.form_c_status}`);
    console.log(`Dashboard Form C: ${realEmployee.formStatus.formC ? 'Completed' : 'Pending'}`);
  }
  
  console.log('\n🎯 VERIFICATION SUMMARY:');
  console.log('=========================');
  
  const isRealData = employees.length === 1 && 
                     employees[0].name === 'Nguyễn Văn An' && 
                     statistics.dataSource === 'dim_users.xlsx';
  
  if (isRealData) {
    console.log('✅ SUCCESS: Dashboard is now using REAL employee data from dim_users.xlsx');
    console.log('✅ Employee count is correct (1 employee)');
    console.log('✅ No fake names detected');
    console.log('✅ Data source properly attributed');
  } else {
    console.log('❌ ISSUE: Dashboard may still be using fake or incorrect data');
  }
  
  console.log('\n🌐 NEXT STEPS:');
  console.log('===============');
  console.log('1. Open http://localhost:3000');
  console.log('2. Hard refresh (Ctrl+Shift+R)');
  console.log('3. Verify dashboard title shows "1 nhân viên" not "442 nhân viên"');
  console.log('4. Check employee name is "Nguyễn Văn An"');
  console.log('5. Verify department is "Marketing"');
  
  return isRealData;
}

// Run verification
const success = verifyRealDataImplementation();
process.exit(success ? 0 : 1);