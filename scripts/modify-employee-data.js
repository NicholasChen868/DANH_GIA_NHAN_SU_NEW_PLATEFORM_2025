#!/usr/bin/env node

/**
 * EMPLOYEE DATA MODIFICATION UTILITY
 * Easily modify employee data, add new employees, update form status, etc.
 */

const fs = require('fs');
const path = require('path');

const employeesPath = path.join(__dirname, '../frontend/public/data/employees.json');
const departmentsPath = path.join(__dirname, '../frontend/public/data/departments.json');
const statisticsPath = path.join(__dirname, '../frontend/public/data/statistics.json');

console.log('🔧 EMPLOYEE DATA MODIFICATION UTILITY');
console.log('======================================\n');

// Load current data
let employees = JSON.parse(fs.readFileSync(employeesPath, 'utf8'));
let departments = JSON.parse(fs.readFileSync(departmentsPath, 'utf8'));

console.log(`📊 Current Data: ${employees.length} employees loaded\n`);

// Utility Functions
class EmployeeDataManager {
  
  // 1. Add a new employee
  static addEmployee(employeeData) {
    const newEmployee = {
      id: employeeData.id || `ESU${String(employees.length + 1).padStart(3, '0')}`,
      name: employeeData.name || 'Nhân Viên Mới',
      department: employeeData.department || 'Công Nghệ Thông Tin',
      buName: employeeData.buName || 'IT',
      buFullName: employeeData.buFullName || 'Information Technology',
      position: employeeData.position || 'Nhân viên',
      level: employeeData.level || 'Staff',
      email: employeeData.email || `newemployee@esuhai.com`,
      phone: employeeData.phone || '0900000000',
      hireDate: employeeData.hireDate || new Date().toISOString().split('T')[0],
      managerId: employeeData.managerId || null,
      avatar: employeeData.avatar || `/avatars/default.jpg`,
      status: employeeData.status || 'Active',
      formStatus: employeeData.formStatus || {
        formA: false,
        formB: false,
        formC: false
      },
      evaluationStatus: {
        formA: employeeData.formStatus?.formA ? 'Completed' : 'Pending',
        formB: employeeData.formStatus?.formB ? 'Completed' : 'Pending',
        formC: employeeData.formStatus?.formC ? 'Completed' : 'Pending'
      },
      completedForms: Object.values(employeeData.formStatus || {}).filter(Boolean).length,
      overallScore: 0,
      talentGroup: 'TBD',
      canBeEvaluated: true,
      lastUpdated: new Date().toISOString()
    };
    
    employees.push(newEmployee);
    console.log(`✅ Added employee: ${newEmployee.name} (${newEmployee.id})`);
    return newEmployee;
  }
  
  // 2. Update existing employee
  static updateEmployee(employeeId, updates) {
    const employeeIndex = employees.findIndex(emp => emp.id === employeeId);
    if (employeeIndex === -1) {
      console.log(`❌ Employee ${employeeId} not found`);
      return null;
    }
    
    const employee = employees[employeeIndex];
    
    // Update basic fields
    Object.keys(updates).forEach(key => {
      if (key !== 'formStatus') {
        employee[key] = updates[key];
      }
    });
    
    // Handle form status updates
    if (updates.formStatus) {
      employee.formStatus = { ...employee.formStatus, ...updates.formStatus };
      employee.evaluationStatus = {
        formA: employee.formStatus.formA ? 'Completed' : 'Pending',
        formB: employee.formStatus.formB ? 'Completed' : 'Pending',
        formC: employee.formStatus.formC ? 'Completed' : 'Pending'
      };
      employee.completedForms = Object.values(employee.formStatus).filter(Boolean).length;
    }
    
    employee.lastUpdated = new Date().toISOString();
    employees[employeeIndex] = employee;
    
    console.log(`✅ Updated employee: ${employee.name} (${employee.id})`);
    return employee;
  }
  
  // 3. Batch update form status
  static batchUpdateFormStatus(criteria, formUpdates) {
    let updated = 0;
    
    employees.forEach((employee, index) => {
      let matches = true;
      
      // Check if employee matches criteria
      Object.keys(criteria).forEach(key => {
        if (employee[key] !== criteria[key]) {
          matches = false;
        }
      });
      
      if (matches) {
        employee.formStatus = { ...employee.formStatus, ...formUpdates };
        employee.evaluationStatus = {
          formA: employee.formStatus.formA ? 'Completed' : 'Pending',
          formB: employee.formStatus.formB ? 'Completed' : 'Pending',
          formC: employee.formStatus.formC ? 'Completed' : 'Pending'
        };
        employee.completedForms = Object.values(employee.formStatus).filter(Boolean).length;
        employee.lastUpdated = new Date().toISOString();
        employees[index] = employee;
        updated++;
      }
    });
    
    console.log(`✅ Updated ${updated} employees matching criteria`);
    return updated;
  }
  
  // 4. Change department/business unit
  static changeDepartment(employeeId, newDepartment, newBU = null) {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) {
      console.log(`❌ Employee ${employeeId} not found`);
      return null;
    }
    
    const oldDept = employee.department;
    employee.department = newDepartment;
    
    if (newBU) {
      employee.buName = newBU.code;
      employee.buFullName = newBU.fullName;
    }
    
    employee.lastUpdated = new Date().toISOString();
    
    console.log(`✅ ${employee.name}: ${oldDept} → ${newDepartment}`);
    return employee;
  }
  
  // 5. Save all changes
  static saveChanges() {
    // Recalculate statistics
    const stats = this.calculateStatistics();
    
    // Save files
    fs.writeFileSync(employeesPath, JSON.stringify(employees, null, 2));
    fs.writeFileSync(statisticsPath, JSON.stringify(stats, null, 2));
    
    console.log(`💾 Saved ${employees.length} employees to database`);
    console.log(`📊 Updated statistics saved`);
  }
  
  // 6. Calculate statistics
  static calculateStatistics() {
    const total = employees.length;
    const active = employees.filter(emp => emp.status === 'Active').length;
    
    const byDepartment = employees.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {});
    
    const formCompletion = {
      formA: employees.filter(emp => emp.formStatus.formA).length,
      formB: employees.filter(emp => emp.formStatus.formB).length,
      formC: employees.filter(emp => emp.formStatus.formC).length
    };
    
    const completionRates = {
      formA: (formCompletion.formA / total * 100).toFixed(1),
      formB: (formCompletion.formB / total * 100).toFixed(1),
      formC: (formCompletion.formC / total * 100).toFixed(1)
    };
    
    return {
      total,
      active,
      byDepartment,
      formCompletion,
      completionRates
    };
  }
  
  // 7. Find employees by criteria
  static findEmployees(criteria) {
    return employees.filter(employee => {
      return Object.keys(criteria).every(key => {
        if (typeof criteria[key] === 'string') {
          return employee[key]?.toLowerCase().includes(criteria[key].toLowerCase());
        }
        return employee[key] === criteria[key];
      });
    });
  }
}

// Example usage demonstrations
console.log('📚 MODIFICATION EXAMPLES:');
console.log('=========================\n');

console.log('1️⃣ ADD NEW EMPLOYEE:');
console.log('---------------------');
console.log('```javascript');
console.log('EmployeeDataManager.addEmployee({');
console.log('  name: "Nguyễn Văn Nam",');
console.log('  department: "Marketing, Sales & Admission",');
console.log('  buName: "MSA",');
console.log('  position: "Chuyên viên Marketing",');
console.log('  level: "Staff",');
console.log('  email: "nam.nguyen@esuhai.com",');
console.log('  formStatus: { formA: true, formB: false, formC: false }');
console.log('});');
console.log('```\n');

console.log('2️⃣ UPDATE EMPLOYEE FORM STATUS:');
console.log('--------------------------------');
console.log('```javascript');
console.log('EmployeeDataManager.updateEmployee("ESU001", {');
console.log('  formStatus: { formA: true, formB: true, formC: true }');
console.log('});');
console.log('```\n');

console.log('3️⃣ BATCH UPDATE BY DEPARTMENT:');
console.log('-------------------------------');
console.log('```javascript');
console.log('EmployeeDataManager.batchUpdateFormStatus(');
console.log('  { department: "Công Nghệ Thông Tin" },');
console.log('  { formA: true }  // Mark all IT employees as completing Form A');
console.log(');');
console.log('```\n');

console.log('4️⃣ CHANGE DEPARTMENT:');
console.log('----------------------');
console.log('```javascript');
console.log('EmployeeDataManager.changeDepartment("ESU001", "Nhân Sự", {');
console.log('  code: "HR",');
console.log('  fullName: "Human Resources"');
console.log('});');
console.log('```\n');

console.log('5️⃣ FIND EMPLOYEES:');
console.log('-------------------');
console.log('```javascript');
console.log('// Find all managers');
console.log('const managers = EmployeeDataManager.findEmployees({');
console.log('  position: "Trưởng"');
console.log('});');
console.log('');
console.log('// Find incomplete employees');
console.log('const incomplete = employees.filter(emp => emp.completedForms < 3);');
console.log('```\n');

console.log('6️⃣ SAVE CHANGES:');
console.log('-----------------');
console.log('```javascript');
console.log('EmployeeDataManager.saveChanges();');
console.log('```\n');

// Quick stats
const currentStats = EmployeeDataManager.calculateStatistics();
console.log('📈 CURRENT STATISTICS:');
console.log('======================');
console.log(`Total Employees: ${currentStats.total}`);
console.log(`Active: ${currentStats.active}`);
console.log(`Form A: ${currentStats.formCompletion.formA} (${currentStats.completionRates.formA}%)`);
console.log(`Form B: ${currentStats.formCompletion.formB} (${currentStats.completionRates.formB}%)`);
console.log(`Form C: ${currentStats.formCompletion.formC} (${currentStats.completionRates.formC}%)`);
console.log('');

console.log('🎯 COMMON MODIFICATION TASKS:');
console.log('==============================');
console.log('');

console.log('✅ To add 5 new employees to Marketing:');
console.log('```javascript');
console.log('for (let i = 1; i <= 5; i++) {');
console.log('  EmployeeDataManager.addEmployee({');
console.log('    name: `Nhân Viên Marketing ${i}`,');
console.log('    department: "Marketing, Sales & Admission",');
console.log('    buName: "MSA",');
console.log('    position: "Chuyên viên Marketing"');
console.log('  });');
console.log('}');
console.log('EmployeeDataManager.saveChanges();');
console.log('```\n');

console.log('✅ To mark all executives as completing all forms:');
console.log('```javascript');
console.log('EmployeeDataManager.batchUpdateFormStatus(');
console.log('  { level: "Executive" },');
console.log('  { formA: true, formB: true, formC: true }');
console.log(');');
console.log('EmployeeDataManager.saveChanges();');
console.log('```\n');

console.log('✅ To move someone to a different department:');
console.log('```javascript');
console.log('EmployeeDataManager.changeDepartment("ESU010", "Tài Chính", {');
console.log('  code: "FIN",');
console.log('  fullName: "Finance"');
console.log('});');
console.log('EmployeeDataManager.saveChanges();');
console.log('```\n');

console.log('💡 TIPS:');
console.log('=========');
console.log('• Always call saveChanges() after modifications');
console.log('• Backup your data before major changes');
console.log('• Use findEmployees() to preview changes first');
console.log('• The dashboard will automatically refresh data');
console.log('• Form status changes update completion statistics');
console.log('');

console.log('🔄 NEXT: Business Unit Modification Guide');
console.log('==========================================');

// Export the class for use in other scripts
module.exports = EmployeeDataManager;