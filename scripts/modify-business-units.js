#!/usr/bin/env node

/**
 * BUSINESS UNIT MODIFICATION UTILITY
 * Modify business units, departments, and organizational structure
 */

const fs = require('fs');
const path = require('path');

const employeesPath = path.join(__dirname, '../frontend/public/data/employees.json');
const departmentsPath = path.join(__dirname, '../frontend/public/data/departments.json');

console.log('🏢 BUSINESS UNIT MODIFICATION UTILITY');
console.log('======================================\n');

// Load current data
let employees = JSON.parse(fs.readFileSync(employeesPath, 'utf8'));
let departments = JSON.parse(fs.readFileSync(departmentsPath, 'utf8'));

console.log(`📊 Current: ${departments.length} business units, ${employees.length} employees\n`);

// Current business units
console.log('📋 CURRENT BUSINESS UNITS:');
console.log('===========================');
departments.forEach(dept => {
  const employeeCount = employees.filter(emp => emp.buName === dept.code).length;
  console.log(`${dept.code.padEnd(4)} | ${dept.name.padEnd(30)} | ${employeeCount.toString().padStart(3)} employees`);
});
console.log('');

class BusinessUnitManager {
  
  // 1. Add new business unit
  static addBusinessUnit(buData) {
    const newBU = {
      id: buData.id || `DEPT${String(departments.length + 1).padStart(3, '0')}`,
      code: buData.code || 'NEW',
      name: buData.name || 'New Department',
      fullName: buData.fullName || 'New Department Full Name',
      type: buData.type || 'business',
      headCount: 0,
      isActive: true
    };
    
    departments.push(newBU);
    console.log(`✅ Added business unit: ${newBU.name} (${newBU.code})`);
    return newBU;
  }
  
  // 2. Update existing business unit
  static updateBusinessUnit(buCode, updates) {
    const deptIndex = departments.findIndex(dept => dept.code === buCode);
    if (deptIndex === -1) {
      console.log(`❌ Business unit ${buCode} not found`);
      return null;
    }
    
    const oldData = { ...departments[deptIndex] };
    departments[deptIndex] = { ...departments[deptIndex], ...updates };
    
    // If code changed, update all employees
    if (updates.code && updates.code !== buCode) {
      const updatedEmployees = employees.filter(emp => emp.buName === buCode).length;
      employees.forEach(emp => {
        if (emp.buName === buCode) {
          emp.buName = updates.code;
        }
      });
      console.log(`✅ Updated ${updatedEmployees} employees with new BU code`);
    }
    
    console.log(`✅ Updated business unit: ${oldData.code} → ${departments[deptIndex].code}`);
    return departments[deptIndex];
  }
  
  // 3. Remove business unit (move employees first)
  static removeBusinessUnit(buCode, moveEmployeesToBU = null) {
    const deptIndex = departments.findIndex(dept => dept.code === buCode);
    if (deptIndex === -1) {
      console.log(`❌ Business unit ${buCode} not found`);
      return false;
    }
    
    const affectedEmployees = employees.filter(emp => emp.buName === buCode);
    
    if (affectedEmployees.length > 0) {
      if (!moveEmployeesToBU) {
        console.log(`❌ Cannot remove ${buCode}: ${affectedEmployees.length} employees still assigned`);
        console.log('   Use moveEmployeesToBU parameter to move them first');
        return false;
      }
      
      // Move employees to target BU
      const targetBU = departments.find(dept => dept.code === moveEmployeesToBU);
      if (!targetBU) {
        console.log(`❌ Target business unit ${moveEmployeesToBU} not found`);
        return false;
      }
      
      affectedEmployees.forEach(emp => {
        emp.buName = moveEmployeesToBU;
        emp.buFullName = targetBU.fullName;
        emp.department = targetBU.name; // Update department name too
      });
      
      console.log(`✅ Moved ${affectedEmployees.length} employees from ${buCode} to ${moveEmployeesToBU}`);
    }
    
    departments.splice(deptIndex, 1);
    console.log(`✅ Removed business unit: ${buCode}`);
    return true;
  }
  
  // 4. Reorganize department structure
  static reorganizeDepartments(reorganizationPlan) {
    console.log('🔄 Starting department reorganization...');
    
    reorganizationPlan.forEach(change => {
      switch (change.action) {
        case 'merge':
          this.mergeDepartments(change.source, change.target);
          break;
        case 'split':
          this.splitDepartment(change.source, change.newDepartments);
          break;
        case 'rename':
          this.updateBusinessUnit(change.code, { 
            name: change.newName, 
            fullName: change.newFullName 
          });
          break;
        case 'move_employees':
          this.moveEmployeesBetweenBUs(change.from, change.to, change.criteria);
          break;
      }
    });
    
    console.log('✅ Department reorganization complete');
  }
  
  // 5. Merge departments
  static mergeDepartments(sourceBUs, targetBU) {
    const target = departments.find(dept => dept.code === targetBU);
    if (!target) {
      console.log(`❌ Target department ${targetBU} not found`);
      return false;
    }
    
    sourceBUs.forEach(sourceBU => {
      const sourceEmployees = employees.filter(emp => emp.buName === sourceBU);
      sourceEmployees.forEach(emp => {
        emp.buName = targetBU;
        emp.buFullName = target.fullName;
        emp.department = target.name;
      });
      
      console.log(`✅ Merged ${sourceEmployees.length} employees from ${sourceBU} into ${targetBU}`);
      
      // Remove source department
      const sourceIndex = departments.findIndex(dept => dept.code === sourceBU);
      if (sourceIndex !== -1) {
        departments.splice(sourceIndex, 1);
      }
    });
    
    return true;
  }
  
  // 6. Move employees between BUs by criteria
  static moveEmployeesBetweenBUs(fromBU, toBU, criteria = {}) {
    const targetBU = departments.find(dept => dept.code === toBU);
    if (!targetBU) {
      console.log(`❌ Target department ${toBU} not found`);
      return 0;
    }
    
    let moved = 0;
    employees.forEach(emp => {
      if (emp.buName !== fromBU) return;
      
      // Check if employee matches criteria
      let matches = true;
      Object.keys(criteria).forEach(key => {
        if (criteria[key] && !emp[key]?.toLowerCase().includes(criteria[key].toLowerCase())) {
          matches = false;
        }
      });
      
      if (matches) {
        emp.buName = toBU;
        emp.buFullName = targetBU.fullName;
        emp.department = targetBU.name;
        moved++;
      }
    });
    
    console.log(`✅ Moved ${moved} employees from ${fromBU} to ${toBU}`);
    return moved;
  }
  
  // 7. Update headcount for all departments
  static updateHeadCounts() {
    departments.forEach(dept => {
      dept.headCount = employees.filter(emp => emp.buName === dept.code).length;
    });
    console.log('✅ Updated head counts for all departments');
  }
  
  // 8. Save changes
  static saveChanges() {
    this.updateHeadCounts();
    
    fs.writeFileSync(departmentsPath, JSON.stringify(departments, null, 2));
    fs.writeFileSync(employeesPath, JSON.stringify(employees, null, 2));
    
    console.log(`💾 Saved ${departments.length} business units`);
    console.log(`💾 Saved ${employees.length} employees with updated assignments`);
  }
  
  // 9. Generate organization chart data
  static generateOrgChart() {
    const orgChart = {
      totalEmployees: employees.length,
      businessUnits: departments.map(dept => ({
        code: dept.code,
        name: dept.name,
        type: dept.type,
        headCount: employees.filter(emp => emp.buName === dept.code).length,
        levels: {
          Executive: employees.filter(emp => emp.buName === dept.code && emp.level === 'Executive').length,
          Management: employees.filter(emp => emp.buName === dept.code && emp.level === 'Management').length,
          Senior: employees.filter(emp => emp.buName === dept.code && emp.level === 'Senior').length,
          Staff: employees.filter(emp => emp.buName === dept.code && emp.level === 'Staff').length
        }
      }))
    };
    
    return orgChart;
  }
}

// Example usage and scenarios
console.log('📚 BUSINESS UNIT MODIFICATION EXAMPLES:');
console.log('========================================\n');

console.log('1️⃣ ADD NEW BUSINESS UNIT:');
console.log('---------------------------');
console.log('```javascript');
console.log('BusinessUnitManager.addBusinessUnit({');
console.log('  code: "AI",');
console.log('  name: "Artificial Intelligence",');
console.log('  fullName: "AI Research & Development",');
console.log('  type: "technology"');
console.log('});');
console.log('```\n');

console.log('2️⃣ UPDATE EXISTING BUSINESS UNIT:');
console.log('-----------------------------------');
console.log('```javascript');
console.log('BusinessUnitManager.updateBusinessUnit("IT", {');
console.log('  name: "Information Technology & AI",');
console.log('  fullName: "Information Technology & Artificial Intelligence"');
console.log('});');
console.log('```\n');

console.log('3️⃣ MERGE DEPARTMENTS:');
console.log('----------------------');
console.log('```javascript');
console.log('// Merge MSA and IDS into a single Sales unit');
console.log('BusinessUnitManager.mergeDepartments(["MSA", "IDS"], "SALES");');
console.log('```\n');

console.log('4️⃣ MOVE EMPLOYEES BY CRITERIA:');
console.log('--------------------------------');
console.log('```javascript');
console.log('// Move all managers from IT to new Management BU');
console.log('BusinessUnitManager.moveEmployeesBetweenBUs("IT", "MGMT", {');
console.log('  position: "Trưởng"');
console.log('});');
console.log('```\n');

console.log('5️⃣ COMPREHENSIVE REORGANIZATION:');
console.log('----------------------------------');
console.log('```javascript');
console.log('const reorganizationPlan = [');
console.log('  {');
console.log('    action: "merge",');
console.log('    source: ["MSA", "IDS"],');
console.log('    target: "SALES"');
console.log('  },');
console.log('  {');
console.log('    action: "split",');
console.log('    source: "IT",');
console.log('    newDepartments: [');
console.log('      { code: "DEV", name: "Development" },');
console.log('      { code: "OPS", name: "Operations" }');
console.log('    ]');
console.log('  },');
console.log('  {');
console.log('    action: "rename",');
console.log('    code: "HR",');
console.log('    newName: "People & Culture",');
console.log('    newFullName: "People & Culture Department"');
console.log('  }');
console.log('];');
console.log('');
console.log('BusinessUnitManager.reorganizeDepartments(reorganizationPlan);');
console.log('```\n');

// Show current organization structure
const orgChart = BusinessUnitManager.generateOrgChart();
console.log('📊 CURRENT ORGANIZATION STRUCTURE:');
console.log('===================================');
console.log(`Total Employees: ${orgChart.totalEmployees}\n`);

console.log('Department Breakdown:');
orgChart.businessUnits
  .sort((a, b) => b.headCount - a.headCount)
  .slice(0, 10) // Top 10
  .forEach(bu => {
    console.log(`${bu.code.padEnd(4)} | ${bu.name.padEnd(30)} | ${bu.headCount.toString().padStart(3)} employees`);
    console.log(`     ├─ Executive: ${bu.levels.Executive.toString().padStart(2)}, Management: ${bu.levels.Management.toString().padStart(2)}, Senior: ${bu.levels.Senior.toString().padStart(2)}, Staff: ${bu.levels.Staff.toString().padStart(3)}`);
  });
console.log('');

console.log('🎯 COMMON REORGANIZATION SCENARIOS:');
console.log('====================================\n');

console.log('✅ Create new AI/Data Science department:');
console.log('```javascript');
console.log('BusinessUnitManager.addBusinessUnit({');
console.log('  code: "DS",');
console.log('  name: "Data Science & AI",');
console.log('  fullName: "Data Science & Artificial Intelligence",');
console.log('  type: "technology"');
console.log('});');
console.log('');
console.log('// Move relevant employees');
console.log('BusinessUnitManager.moveEmployeesBetweenBUs("IT", "DS", {');
console.log('  position: "Data"');
console.log('});');
console.log('```\n');

console.log('✅ Consolidate support functions:');
console.log('```javascript');
console.log('BusinessUnitManager.mergeDepartments(["HR", "ADM", "LEG"], "SUP");');
console.log('BusinessUnitManager.updateBusinessUnit("SUP", {');
console.log('  name: "Support Services",');
console.log('  fullName: "Support Services Division"');
console.log('});');
console.log('```\n');

console.log('✅ Split large department:');
console.log('```javascript');
console.log('// If MSA gets too big, split into separate units');
console.log('BusinessUnitManager.addBusinessUnit({');
console.log('  code: "MKT", name: "Marketing", fullName: "Marketing Department"');
console.log('});');
console.log('BusinessUnitManager.addBusinessUnit({');
console.log('  code: "SAL", name: "Sales", fullName: "Sales Department"');
console.log('});');
console.log('');
console.log('BusinessUnitManager.moveEmployeesBetweenBUs("MSA", "MKT", {');
console.log('  position: "Marketing"');
console.log('});');
console.log('BusinessUnitManager.moveEmployeesBetweenBUs("MSA", "SAL", {');
console.log('  position: "Sales"');
console.log('});');
console.log('```\n');

console.log('💡 TIPS:');
console.log('=========');
console.log('• Always backup data before major reorganizations');
console.log('• Use moveEmployeesBetweenBUs() for targeted moves');
console.log('• Update head counts after changes');
console.log('• Test filter functionality after BU changes');
console.log('• Consider employee impact when merging/splitting');
console.log('');

console.log('🔄 TO APPLY CHANGES:');
console.log('====================');
console.log('1. Make your modifications using the functions above');
console.log('2. Call BusinessUnitManager.saveChanges()');
console.log('3. Refresh the dashboard to see updates');
console.log('4. Test all filtering functionality');
console.log('');

// Export for use in other scripts
module.exports = BusinessUnitManager;