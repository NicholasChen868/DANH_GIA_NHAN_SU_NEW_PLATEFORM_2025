const fs = require('fs');
const path = require('path');

// Add formCCount field to all employees
function addFormCCount() {
    const employeesPath = path.join(__dirname, '../frontend/public/data/employees.json');
    
    try {
        // Read current employees data
        const employeesData = JSON.parse(fs.readFileSync(employeesPath, 'utf8'));
        
        // Add formCCount and receivedVotes to each employee
        const updatedEmployees = employeesData.map(employee => {
            // Random count between 0-5 for demonstration
            // In real app, this would be calculated from actual Form C submissions
            const formCCount = employee.formStatus.formC ? 
                Math.floor(Math.random() * 4) + 1 : // 1-4 people if completed
                0; // 0 if not completed
            
            // Random received votes (how many times this person was evaluated by others)
            const receivedVotes = Math.floor(Math.random() * 8) + 1; // 1-8 votes received
            
            return {
                ...employee,
                formCCount: formCCount,
                receivedVotes: receivedVotes
            };
        });
        
        // Write updated data
        fs.writeFileSync(employeesPath, JSON.stringify(updatedEmployees, null, 2), 'utf8');
        
        console.log(`✅ Successfully added formCCount and receivedVotes to ${updatedEmployees.length} employees`);
        console.log(`📊 FormC Count Distribution:`);
        
        const formCDistribution = updatedEmployees.reduce((acc, emp) => {
            const count = emp.formCCount;
            acc[count] = (acc[count] || 0) + 1;
            return acc;
        }, {});
        
        Object.keys(formCDistribution).sort().forEach(count => {
            console.log(`   Đánh giá ${count} người: ${formCDistribution[count]} employees`);
        });
        
        console.log(`📊 Received Votes Distribution:`);
        const votesDistribution = updatedEmployees.reduce((acc, emp) => {
            const votes = emp.receivedVotes;
            acc[votes] = (acc[votes] || 0) + 1;
            return acc;
        }, {});
        
        Object.keys(votesDistribution).sort().forEach(votes => {
            console.log(`   Được ${votes} lượt: ${votesDistribution[votes]} employees`);
        });
        
    } catch (error) {
        console.error('❌ Error updating employees:', error);
    }
}

// Run the update
addFormCCount();