#!/usr/bin/env node

/**
 * DASHBOARD ADMIN UTILITY
 * Interactive tool for testing and modifying dashboard data
 */

const EmployeeDataManager = require('./modify-employee-data');
const BusinessUnitManager = require('./modify-business-units');
const fs = require('fs');
const path = require('path');

console.log('🎛️  ESUHAI DASHBOARD ADMIN UTILITY');
console.log('===================================\n');

class DashboardAdmin {
  
  static showMainMenu() {
    console.log('📋 MAIN MENU:');
    console.log('==============');
    console.log('1️⃣  Test Dashboard Features');
    console.log('2️⃣  Employee Data Management');
    console.log('3️⃣  Business Unit Management');
    console.log('4️⃣  Quick Data Modifications');
    console.log('5️⃣  Generate Sample Data');
    console.log('6️⃣  Backup & Restore');
    console.log('7️⃣  Dashboard Health Check');
    console.log('8️⃣  Exit');
    console.log('');
  }
  
  // Quick modifications for common tasks
  static quickModifications() {
    console.log('⚡ QUICK MODIFICATIONS:');
    console.log('=======================\n');
    
    console.log('Choose a quick modification:');
    console.log('');
    console.log('A. Mark all executives as completing all forms');
    console.log('B. Add 10 new employees to Marketing');
    console.log('C. Move all IT managers to a new Tech Leadership unit');
    console.log('D. Update form completion rates to 90%+');
    console.log('E. Create AI/Data Science department');
    console.log('F. Simulate end-of-month form submissions');
    console.log('');
    
    return {
      A: () => this.completeExecutiveForms(),
      B: () => this.addMarketingEmployees(),
      C: () => this.createTechLeadershipUnit(),
      D: () => this.boostFormCompletion(),
      E: () => this.createAIDepartment(),
      F: () => this.simulateFormSubmissions()
    };
  }
  
  static completeExecutiveForms() {
    console.log('🎯 Marking all executives as completing all forms...');
    
    const result = EmployeeDataManager.batchUpdateFormStatus(
      { level: 'Executive' },
      { formA: true, formB: true, formC: true }
    );
    
    EmployeeDataManager.saveChanges();
    console.log('✅ All executives now have completed forms!');
    return result;
  }
  
  static addMarketingEmployees() {
    console.log('🎯 Adding 10 new marketing employees...');
    
    const marketingNames = [
      'Nguyễn Thị Marketing 1', 'Trần Văn Marketing 2', 'Lê Thị Marketing 3',
      'Phạm Văn Marketing 4', 'Hoàng Thị Marketing 5', 'Vũ Văn Marketing 6',
      'Đặng Thị Marketing 7', 'Bùi Văn Marketing 8', 'Đỗ Thị Marketing 9',
      'Hồ Văn Marketing 10'
    ];
    
    let added = 0;
    marketingNames.forEach((name, index) => {
      EmployeeDataManager.addEmployee({
        name: name,
        department: 'Marketing, Sales & Admission',
        buName: 'MSA',
        buFullName: 'Marketing, Sales & Admission',
        position: 'Chuyên viên Marketing',
        level: 'Staff',
        email: `marketing${index + 1}@esuhai.com`,
        formStatus: {
          formA: Math.random() > 0.3,
          formB: Math.random() > 0.4,
          formC: Math.random() > 0.5
        }
      });
      added++;
    });
    
    EmployeeDataManager.saveChanges();
    console.log(`✅ Added ${added} marketing employees!`);
    return added;
  }
  
  static createTechLeadershipUnit() {
    console.log('🎯 Creating Tech Leadership unit and moving IT managers...');
    
    // Add new business unit
    BusinessUnitManager.addBusinessUnit({
      code: 'TL',
      name: 'Tech Leadership',
      fullName: 'Technology Leadership Team',
      type: 'management'
    });
    
    // Move IT managers
    const moved = BusinessUnitManager.moveEmployeesBetweenBUs('IT', 'TL', {
      position: 'Trưởng'
    });
    
    BusinessUnitManager.saveChanges();
    console.log(`✅ Created Tech Leadership unit and moved ${moved} managers!`);
    return moved;
  }
  
  static boostFormCompletion() {
    console.log('🎯 Boosting form completion rates to 90%+...');
    
    const employees = JSON.parse(fs.readFileSync(
      path.join(__dirname, '../frontend/public/data/employees.json'), 'utf8'
    ));
    
    let updated = 0;
    employees.forEach(emp => {
      // 90% chance for each form
      if (Math.random() > 0.1) emp.formStatus.formA = true;
      if (Math.random() > 0.1) emp.formStatus.formB = true; 
      if (Math.random() > 0.1) emp.formStatus.formC = true;
      
      emp.evaluationStatus = {
        formA: emp.formStatus.formA ? 'Completed' : 'Pending',
        formB: emp.formStatus.formB ? 'Completed' : 'Pending',
        formC: emp.formStatus.formC ? 'Completed' : 'Pending'
      };
      emp.completedForms = Object.values(emp.formStatus).filter(Boolean).length;
      emp.lastUpdated = new Date().toISOString();
      updated++;
    });
    
    // Save directly
    fs.writeFileSync(
      path.join(__dirname, '../frontend/public/data/employees.json'),
      JSON.stringify(employees, null, 2)
    );
    
    // Update statistics
    EmployeeDataManager.saveChanges();
    console.log(`✅ Boosted completion rates for ${updated} employees!`);
    return updated;
  }
  
  static createAIDepartment() {
    console.log('🎯 Creating AI/Data Science department...');
    
    // Add AI department
    BusinessUnitManager.addBusinessUnit({
      code: 'AI',
      name: 'Artificial Intelligence',
      fullName: 'AI & Data Science Division',
      type: 'technology'
    });
    
    // Move relevant IT employees
    const moved = BusinessUnitManager.moveEmployeesBetweenBUs('IT', 'AI', {
      position: 'Kỹ sư'
    });
    
    // Add some new AI specialists
    ['Data Scientist', 'AI Engineer', 'ML Engineer'].forEach((position, index) => {
      EmployeeDataManager.addEmployee({
        name: `AI Specialist ${index + 1}`,
        department: 'Artificial Intelligence',
        buName: 'AI',
        buFullName: 'AI & Data Science Division',
        position: position,
        level: 'Senior',
        email: `ai${index + 1}@esuhai.com`,
        formStatus: { formA: true, formB: true, formC: false }
      });
    });
    
    BusinessUnitManager.saveChanges();
    console.log(`✅ Created AI department, moved ${moved} employees, added 3 specialists!`);
    return moved + 3;
  }
  
  static simulateFormSubmissions() {
    console.log('🎯 Simulating end-of-month form submissions...');
    
    const employees = JSON.parse(fs.readFileSync(
      path.join(__dirname, '../frontend/public/data/employees.json'), 'utf8'
    ));
    
    let submissions = 0;
    employees.forEach(emp => {
      // 30% chance each incomplete form gets submitted
      if (!emp.formStatus.formA && Math.random() > 0.7) {
        emp.formStatus.formA = true;
        submissions++;
      }
      if (!emp.formStatus.formB && Math.random() > 0.7) {
        emp.formStatus.formB = true;
        submissions++;
      }
      if (!emp.formStatus.formC && Math.random() > 0.7) {
        emp.formStatus.formC = true;
        submissions++;
      }
      
      emp.evaluationStatus = {
        formA: emp.formStatus.formA ? 'Completed' : 'Pending',
        formB: emp.formStatus.formB ? 'Completed' : 'Pending',
        formC: emp.formStatus.formC ? 'Completed' : 'Pending'
      };
      emp.completedForms = Object.values(emp.formStatus).filter(Boolean).length;
      emp.lastUpdated = new Date().toISOString();
    });
    
    // Save
    fs.writeFileSync(
      path.join(__dirname, '../frontend/public/data/employees.json'),
      JSON.stringify(employees, null, 2)
    );
    
    EmployeeDataManager.saveChanges();
    console.log(`✅ Simulated ${submissions} new form submissions!`);
    return submissions;
  }
  
  // Backup and restore functionality
  static createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, '../backups');
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }
    
    const backupPath = path.join(backupDir, `dashboard-backup-${timestamp}`);
    fs.mkdirSync(backupPath);
    
    // Copy data files
    const filesToBackup = [
      '../frontend/public/data/employees.json',
      '../frontend/public/data/departments.json',
      '../frontend/public/data/statistics.json'
    ];
    
    filesToBackup.forEach(file => {
      const sourcePath = path.join(__dirname, file);
      const targetPath = path.join(backupPath, path.basename(file));
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, targetPath);
      }
    });
    
    console.log(`✅ Backup created: ${backupPath}`);
    return backupPath;
  }
  
  // Health check
  static healthCheck() {
    console.log('🏥 DASHBOARD HEALTH CHECK:');
    console.log('===========================\n');
    
    const employees = JSON.parse(fs.readFileSync(
      path.join(__dirname, '../frontend/public/data/employees.json'), 'utf8'
    ));
    const departments = JSON.parse(fs.readFileSync(
      path.join(__dirname, '../frontend/public/data/departments.json'), 'utf8'
    ));
    
    // Check data integrity
    console.log('📊 Data Integrity:');
    console.log(`   ✅ ${employees.length} employees loaded`);
    console.log(`   ✅ ${departments.length} business units loaded`);
    
    // Check required fields
    const requiredFields = ['id', 'name', 'department', 'formStatus'];
    let missingFields = 0;
    employees.forEach(emp => {
      requiredFields.forEach(field => {
        if (!(field in emp)) missingFields++;
      });
    });
    
    if (missingFields === 0) {
      console.log('   ✅ All employees have required fields');
    } else {
      console.log(`   ❌ ${missingFields} missing required fields`);
    }
    
    // Check form status consistency
    let inconsistentStatus = 0;
    employees.forEach(emp => {
      const calculatedCompleted = Object.values(emp.formStatus).filter(Boolean).length;
      if (emp.completedForms !== calculatedCompleted) {
        inconsistentStatus++;
      }
    });
    
    if (inconsistentStatus === 0) {
      console.log('   ✅ Form status counts are consistent');
    } else {
      console.log(`   ❌ ${inconsistentStatus} employees have inconsistent form counts`);
    }
    
    // Check business unit references
    const buCodes = new Set(departments.map(dept => dept.code));
    let orphanedEmployees = 0;
    employees.forEach(emp => {
      if (!buCodes.has(emp.buName)) {
        orphanedEmployees++;
      }
    });
    
    if (orphanedEmployees === 0) {
      console.log('   ✅ All employees belong to valid business units');
    } else {
      console.log(`   ❌ ${orphanedEmployees} employees have invalid business unit references`);
    }
    
    console.log('');
    
    // Performance metrics
    const fileSize = fs.statSync(path.join(__dirname, '../frontend/public/data/employees.json')).size;
    console.log('📈 Performance Metrics:');
    console.log(`   📁 Employee data file size: ${(fileSize / 1024).toFixed(1)} KB`);
    console.log(`   ⚡ Estimated load time: ${fileSize < 500000 ? 'Fast' : 'Moderate'}`);
    console.log(`   🎯 Recommended max: 500 KB (current: ${(fileSize / 1024).toFixed(1)} KB)`);
    
    return {
      employees: employees.length,
      departments: departments.length,
      missingFields,
      inconsistentStatus,
      orphanedEmployees,
      fileSize
    };
  }
}

// Main execution
console.log('🚀 DASHBOARD ADMIN READY!');
console.log('==========================\n');

console.log('Available commands:');
console.log('• node dashboard-admin.js health        - Run health check');
console.log('• node dashboard-admin.js backup        - Create data backup');
console.log('• node dashboard-admin.js quick-boost   - Boost form completion rates');
console.log('• node dashboard-admin.js add-marketing - Add 10 marketing employees');
console.log('• node dashboard-admin.js create-ai     - Create AI department');
console.log('');

// Handle command line arguments
const command = process.argv[2];

switch (command) {
  case 'health':
    DashboardAdmin.healthCheck();
    break;
  case 'backup':
    DashboardAdmin.createBackup();
    break;
  case 'quick-boost':
    DashboardAdmin.boostFormCompletion();
    break;
  case 'add-marketing':
    DashboardAdmin.addMarketingEmployees();
    break;
  case 'create-ai':
    DashboardAdmin.createAIDepartment();
    break;
  default:
    console.log('🎯 QUICK ACTIONS:');
    console.log('==================');
    const actions = DashboardAdmin.quickModifications();
    console.log('Run specific commands:');
    Object.keys(actions).forEach(key => {
      console.log(`• node dashboard-admin.js ${key.toLowerCase()}`);
    });
    console.log('');
    console.log('💡 Or use the interactive utility functions in your code:');
    console.log('const { DashboardAdmin } = require("./dashboard-admin");');
    console.log('DashboardAdmin.healthCheck();');
}

module.exports = DashboardAdmin;