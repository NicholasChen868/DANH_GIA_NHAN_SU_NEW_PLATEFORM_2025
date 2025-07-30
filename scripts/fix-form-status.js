#!/usr/bin/env node

/**
 * FIX FORM STATUS TO MATCH ORIGINAL EXCEL DATA
 * Use actual form status from dim_users.xlsx instead of random generation
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 FIXING FORM STATUS TO MATCH EXCEL DATA');
console.log('==========================================\n');

function fixFormStatusFromExcel() {
  const employeesPath = path.join(__dirname, '../frontend/public/data/employees.json');
  const employees = JSON.parse(fs.readFileSync(employeesPath, 'utf8'));
  
  console.log(`📊 Processing ${employees.length} employees...`);
  
  let updated = 0;
  employees.forEach(employee => {
    if (employee._originalData) {
      const original = employee._originalData;
      
      // Map Excel form status to boolean
      const mapStatus = (status) => {
        if (!status) return false;
        return status.toLowerCase() === 'completed' || status.toLowerCase() === 'complete';
      };
      
      const newFormStatus = {
        formA: mapStatus(original.form_a_status),
        formB: mapStatus(original.form_b_status),
        formC: mapStatus(original.form_c_status)
      };
      
      // Update form status
      employee.formStatus = newFormStatus;
      employee.evaluationStatus = {
        formA: newFormStatus.formA ? 'Completed' : 'Pending',
        formB: newFormStatus.formB ? 'Completed' : 'Pending',
        formC: newFormStatus.formC ? 'Completed' : 'Pending'
      };
      employee.completedForms = Object.values(newFormStatus).filter(Boolean).length;
      employee.lastUpdated = new Date().toISOString();
      
      console.log(`✅ Updated ${employee.name}:`);
      console.log(`   Form A: ${original.form_a_status} → ${newFormStatus.formA ? 'Completed' : 'Pending'}`);
      console.log(`   Form B: ${original.form_b_status} → ${newFormStatus.formB ? 'Completed' : 'Pending'}`);
      console.log(`   Form C: ${original.form_c_status} → ${newFormStatus.formC ? 'Completed' : 'Pending'}`);
      console.log(`   Total completed: ${employee.completedForms}/3`);
      
      updated++;
    }
  });
  
  // Save updated data
  fs.writeFileSync(employeesPath, JSON.stringify(employees, null, 2));
  
  // Update statistics
  const statistics = {
    total: employees.length,
    active: employees.filter(emp => emp.status === 'Active').length,
    byDepartment: employees.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {}),
    formCompletion: {
      formA: employees.filter(emp => emp.formStatus.formA).length,
      formB: employees.filter(emp => emp.formStatus.formB).length,
      formC: employees.filter(emp => emp.formStatus.formC).length
    },
    completionRates: {
      formA: employees.length > 0 ? (employees.filter(emp => emp.formStatus.formA).length / employees.length * 100).toFixed(1) : '0.0',
      formB: employees.length > 0 ? (employees.filter(emp => emp.formStatus.formB).length / employees.length * 100).toFixed(1) : '0.0',
      formC: employees.length > 0 ? (employees.filter(emp => emp.formStatus.formC).length / employees.length * 100).toFixed(1) : '0.0'
    },
    lastUpdated: new Date().toISOString(),
    dataSource: 'dim_users.xlsx'
  };
  
  const statisticsPath = path.join(__dirname, '../frontend/public/data/statistics.json');
  fs.writeFileSync(statisticsPath, JSON.stringify(statistics, null, 2));
  
  console.log(`\n✅ Updated ${updated} employees with correct form status`);
  console.log('📊 Updated statistics:');
  console.log(`   Form A: ${statistics.completionRates.formA}%`);
  console.log(`   Form B: ${statistics.completionRates.formB}%`);
  console.log(`   Form C: ${statistics.completionRates.formC}%`);
}

fixFormStatusFromExcel();