const fs = require('fs');
const path = require('path');

// Add formCCount field to all employees
function addFormCCount() {
    const employeesPath = path.join(__dirname, '../frontend/public/data/employees.json');
    
    try {
        // Read current employees data
        const employeesData = JSON.parse(fs.readFileSync(employeesPath, 'utf8'));
        
        // Add formCCount to each employee
        const updatedEmployees = employeesData.map(employee => {
            // Random count between 0-5 for demonstration
            // In real app, this would be calculated from actual Form C submissions
            const formCCount = employee.formStatus.formC ? 
                Math.floor(Math.random() * 4) + 1 : // 1-4 people if completed
                0; // 0 if not completed
            
            return {
                ...employee,
                formCCount: formCCount
            };
        });
        
        // Write updated data
        fs.writeFileSync(employeesPath, JSON.stringify(updatedEmployees, null, 2), 'utf8');
        
        console.log(`✅ Successfully added formCCount to ${updatedEmployees.length} employees`);
        console.log(`📊 Distribution:`);
        
        const distribution = updatedEmployees.reduce((acc, emp) => {
            const count = emp.formCCount;
            acc[count] = (acc[count] || 0) + 1;
            return acc;
        }, {});
        
        Object.keys(distribution).sort().forEach(count => {
            console.log(`   ${count} người: ${distribution[count]} employees`);
        });
        
    } catch (error) {
        console.error('❌ Error updating employees:', error);
    }
}

// Run the update
addFormCCount();