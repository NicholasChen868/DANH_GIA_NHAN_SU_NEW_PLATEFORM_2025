/**
 * Dashboard ABC Analysis - Hệ thống phân tích nhân sự Esuhai Group
 * Version: 2.0
 * Date: 29/07/2025
 * Author: ClaudeK for Esuhai Group
 */

// ==================== CONFIGURATION ====================
const CONFIG = {
    // Cấu hình chung
    totalEmployees: 420,
    departments: [
        'BOD/TGĐ', 'Trưởng BU', 'Trưởng Phòng', 'Team Leader',
        'MSA', 'IDS', 'Tài Chính', 'Nhân Sự', 'IT', 'Hành Chính',
        'Pháp Chế', 'KaizenYoshida', 'ProSkills', 'EsuCare', 
        'EsuTech', 'Koka-Team', 'EsuWorks', 'ALESU', 'JPC', 'GateAwards'
    ],
    
    // Thang điểm
    scoreRange: {
        min: 1,
        max: 10
    },
    
    // Trọng số đánh giá
    weights: {
        groupA: 0.25, // Hồi ức cấp 3
        groupB: 0.35, // Khai báo năng lực
        groupC: 0.30, // Đánh giá 360
        groupD: 0.10  // Xác thực & kiểm tra chéo
    },
    
    // Phân loại nhân tài
    talentCategories: {
        superstar: { min: 8, label: 'Siêu Sao', color: '#FFD700' },
        goldenPotential: { min: 7, max: 8, label: 'Tiềm Năng Vàng', color: '#FFA500' },
        solidPillar: { min: 6.5, max: 7, label: 'Trụ Cột Vững', color: '#4169E1' },
        roughDiamond: { min: 5.5, max: 6.5, label: 'Kim Cương Thô', color: '#9370DB' },
        performer: { min: 5, max: 5.5, label: 'Người Thực Thi', color: '#32CD32' },
        developing: { min: 4, max: 5, label: 'Cần Phát Triển', color: '#FFA07A' },
        risk: { max: 4, label: 'Rủi Ro Cao', color: '#DC143C' }
    }
};

// ==================== DATA STRUCTURES ====================
class Employee {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.department = data.department;
        this.position = data.position;
        this.joinDate = data.joinDate;
        
        // Điểm từ các nhóm đánh giá
        this.scores = {
            groupA: data.groupA || null, // Hồi ức cấp 3
            groupB: data.groupB || null, // Khai báo năng lực
            groupC: data.groupC || null, // Đánh giá 360
            groupD: data.groupD || null  // Xác thực
        };
        
        // Chi tiết đánh giá
        this.details = {
            leadership: 0,
            technical: 0,
            communication: 0,
            teamwork: 0,
            creativity: 0,
            adaptability: 0,
            responsibility: 0,
            growth: 0
        };
        
        // Tính điểm tổng hợp
        this.calculateTotalScore();
        this.categorize();
    }
    
    calculateTotalScore() {
        const { weights } = CONFIG;
        let total = 0;
        let validScores = 0;
        
        Object.keys(weights).forEach(group => {
            if (this.scores[group] !== null) {
                total += this.scores[group] * weights[group];
                validScores += weights[group];
            }
        });
        
        this.totalScore = validScores > 0 ? total / validScores : 0;
    }
    
    categorize() {
        const { talentCategories } = CONFIG;
        
        for (const [key, category] of Object.entries(talentCategories)) {
            if (category.min && this.totalScore >= category.min) {
                if (!category.max || this.totalScore < category.max) {
                    this.category = key;
                    this.categoryLabel = category.label;
                    this.categoryColor = category.color;
                    break;
                }
            } else if (!category.min && this.totalScore < category.max) {
                this.category = key;
                this.categoryLabel = category.label;
                this.categoryColor = category.color;
                break;
            }
        }
    }
    
    // Tính toán radar chart data
    getRadarData() {
        return [
            { axis: 'Lãnh đạo', value: this.details.leadership },
            { axis: 'Chuyên môn', value: this.details.technical },
            { axis: 'Giao tiếp', value: this.details.communication },
            { axis: 'Làm việc nhóm', value: this.details.teamwork },
            { axis: 'Sáng tạo', value: this.details.creativity },
            { axis: 'Thích ứng', value: this.details.adaptability },
            { axis: 'Trách nhiệm', value: this.details.responsibility },
            { axis: 'Phát triển', value: this.details.growth }
        ];
    }
}

// ==================== DATA PROCESSING ====================
class ABCAnalyzer {
    constructor() {
        this.employees = [];
        this.departments = new Map();
        this.categories = new Map();
    }
    
    // Load dữ liệu từ các nguồn
    async loadData() {
        try {
            // Load dữ liệu Nhóm A (Hồi ức cấp 3)
            const groupAData = await this.loadGroupAData();
            
            // Load dữ liệu Nhóm B (Khai báo năng lực)
            const groupBData = await this.loadGroupBData();
            
            // Load dữ liệu Nhóm C (Đánh giá 360)
            const groupCData = await this.loadGroupCData();
            
            // Merge và xử lý dữ liệu
            this.mergeData(groupAData, groupBData, groupCData);
            
            // Phân loại theo phòng ban và category
            this.categorizeEmployees();
            
        } catch (error) {
            console.error('Lỗi khi load dữ liệu:', error);
        }
    }
    
    async loadGroupAData() {
        // Giả lập load dữ liệu từ file hoặc API
        // Trong thực tế sẽ đọc từ file Excel hoặc database
        return new Promise(resolve => {
            setTimeout(() => {
                const data = [];
                for (let i = 1; i <= CONFIG.totalEmployees; i++) {
                    data.push({
                        employeeId: i,
                        score: Math.random() * 4 + 6, // Random 6-10
                        details: {
                            leadership: Math.random() * 10,
                            growth: Math.random() * 10,
                            adaptability: Math.random() * 10
                        }
                    });
                }
                resolve(data);
            }, 500);
        });
    }
    
    async loadGroupBData() {
        return new Promise(resolve => {
            setTimeout(() => {
                const data = [];
                for (let i = 1; i <= CONFIG.totalEmployees; i++) {
                    data.push({
                        employeeId: i,
                        score: Math.random() * 5 + 5, // Random 5-10
                        details: {
                            technical: Math.random() * 10,
                            communication: Math.random() * 10,
                            creativity: Math.random() * 10
                        }
                    });
                }
                resolve(data);
            }, 500);
        });
    }
    
    async loadGroupCData() {
        return new Promise(resolve => {
            setTimeout(() => {
                const data = [];
                for (let i = 1; i <= CONFIG.totalEmployees; i++) {
                    data.push({
                        employeeId: i,
                        score: Math.random() * 4 + 6, // Random 6-10
                        details: {
                            teamwork: Math.random() * 10,
                            responsibility: Math.random() * 10
                        }
                    });
                }
                resolve(data);
            }, 500);
        });
    }
    
    mergeData(groupA, groupB, groupC) {
        const employeeMap = new Map();
        
        // Tạo danh sách nhân viên mẫu
        for (let i = 1; i <= CONFIG.totalEmployees; i++) {
            const deptIndex = Math.floor(Math.random() * CONFIG.departments.length);
            const employee = new Employee({
                id: i,
                name: `Nhân viên ${i}`,
                department: CONFIG.departments[deptIndex],
                position: this.getRandomPosition(CONFIG.departments[deptIndex]),
                joinDate: this.getRandomJoinDate(),
                groupA: groupA.find(a => a.employeeId === i)?.score || null,
                groupB: groupB.find(b => b.employeeId === i)?.score || null,
                groupC: groupC.find(c => c.employeeId === i)?.score || null,
                groupD: Math.random() * 2 + 8 // Random 8-10 cho validation
            });
            
            // Merge chi tiết từ các nhóm
            const detailsA = groupA.find(a => a.employeeId === i)?.details || {};
            const detailsB = groupB.find(b => b.employeeId === i)?.details || {};
            const detailsC = groupC.find(c => c.employeeId === i)?.details || {};
            
            Object.assign(employee.details, detailsA, detailsB, detailsC);
            
            this.employees.push(employee);
            employeeMap.set(i, employee);
        }
    }
    
    getRandomPosition(department) {
        const positions = {
            'BOD/TGĐ': ['CEO', 'COO', 'CFO', 'CTO'],
            'Trưởng BU': ['BU Head', 'BU Manager'],
            'Trưởng Phòng': ['Department Manager', 'Department Head'],
            'Team Leader': ['Team Leader', 'Supervisor'],
            'MSA': ['Marketing Executive', 'Sales Executive', 'Admission Officer'],
            'IT': ['Developer', 'System Admin', 'IT Support'],
            'Nhân Sự': ['HR Executive', 'Recruiter', 'Training Specialist']
        };
        
        const deptPositions = positions[department] || ['Staff', 'Executive', 'Specialist'];
        return deptPositions[Math.floor(Math.random() * deptPositions.length)];
    }
    
    getRandomJoinDate() {
        const start = new Date(2015, 0, 1);
        const end = new Date();
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }
    
    categorizeEmployees() {
        // Phân loại theo phòng ban
        this.employees.forEach(emp => {
            if (!this.departments.has(emp.department)) {
                this.departments.set(emp.department, []);
            }
            this.departments.get(emp.department).push(emp);
            
            // Phân loại theo category
            if (!this.categories.has(emp.category)) {
                this.categories.set(emp.category, []);
            }
            this.categories.get(emp.category).push(emp);
        });
    }
    
    // Các phương thức phân tích
    getDepartmentStats() {
        const stats = [];
        this.departments.forEach((employees, dept) => {
            const avgScore = employees.reduce((sum, emp) => sum + emp.totalScore, 0) / employees.length;
            stats.push({
                department: dept,
                count: employees.length,
                avgScore: avgScore,
                categories: this.getCategoryDistribution(employees)
            });
        });
        return stats.sort((a, b) => b.avgScore - a.avgScore);
    }
    
    getCategoryDistribution(employees = this.employees) {
        const distribution = {};
        employees.forEach(emp => {
            distribution[emp.category] = (distribution[emp.category] || 0) + 1;
        });
        return distribution;
    }
    
    getTopPerformers(limit = 10) {
        return [...this.employees]
            .sort((a, b) => b.totalScore - a.totalScore)
            .slice(0, limit);
    }
    
    getRiskEmployees(limit = 10) {
        return this.employees
            .filter(emp => emp.category === 'risk')
            .sort((a, b) => a.totalScore - b.totalScore)
            .slice(0, limit);
    }
    
    getTalentPipeline() {
        const pipeline = {
            readyForPromotion: [],
            highPotential: [],
            needsDevelopment: [],
            criticalRetention: []
        };
        
        this.employees.forEach(emp => {
            if (emp.category === 'superstar' || emp.category === 'goldenPotential') {
                pipeline.readyForPromotion.push(emp);
            }
            if (emp.category === 'roughDiamond') {
                pipeline.highPotential.push(emp);
            }
            if (emp.category === 'developing') {
                pipeline.needsDevelopment.push(emp);
            }
            if (emp.category === 'solidPillar' && emp.totalScore > 7.5) {
                pipeline.criticalRetention.push(emp);
            }
        });
        
        return pipeline;
    }
}

// ==================== VISUALIZATION ====================
class DashboardVisualizer {
    constructor(analyzer) {
        this.analyzer = analyzer;
        this.charts = {};
    }
    
    initCharts() {
        // 1. Biểu đồ phân bố nhân tài (Pie Chart)
        this.createTalentDistributionChart();
        
        // 2. Biểu đồ điểm trung bình theo phòng ban (Bar Chart)
        this.createDepartmentScoreChart();
        
        // 3. Ma trận 9-box (Scatter Plot)
        this.create9BoxMatrix();
        
        // 4. Radar Chart cho top performers
        this.createTopPerformersRadar();
        
        // 5. Heatmap phân bố nhân tài theo phòng ban
        this.createTalentHeatmap();
        
        // 6. Timeline phát triển nhân sự
        this.createDevelopmentTimeline();
    }
    
    createTalentDistributionChart() {
        const distribution = this.analyzer.getCategoryDistribution();
        const data = Object.entries(distribution).map(([category, count]) => ({
            name: CONFIG.talentCategories[category].label,
            value: count,
            color: CONFIG.talentCategories[category].color
        }));
        
        // Sử dụng Chart.js hoặc D3.js để vẽ biểu đồ
        const ctx = document.getElementById('talentDistributionChart');
        if (ctx) {
            this.charts.talentDistribution = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: data.map(d => d.name),
                    datasets: [{
                        data: data.map(d => d.value),
                        backgroundColor: data.map(d => d.color),
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                padding: 20,
                                font: { size: 14 }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const label = context.label || '';
                                    const value = context.parsed || 0;
                                    const percentage = ((value / CONFIG.totalEmployees) * 100).toFixed(1);
                                    return `${label}: ${value} người (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        }
    }
    
    createDepartmentScoreChart() {
        const stats = this.analyzer.getDepartmentStats();
        const ctx = document.getElementById('departmentScoreChart');
        
        if (ctx) {
            this.charts.departmentScore = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: stats.map(s => s.department),
                    datasets: [{
                        label: 'Điểm trung bình',
                        data: stats.map(s => s.avgScore),
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 10,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                afterLabel: (context) => {
                                    const dept = stats[context.dataIndex];
                                    return `Số lượng: ${dept.count} người`;
                                }
                            }
                        }
                    }
                }
            });
        }
    }
    
    create9BoxMatrix() {
        const employees = this.analyzer.employees;
        const ctx = document.getElementById('9boxMatrix');
        
        if (ctx) {
            // Tính performance và potential cho mỗi nhân viên
            const data = employees.map(emp => ({
                x: emp.scores.groupC || 5, // Performance (từ đánh giá 360)
                y: emp.scores.groupA || 5, // Potential (từ hồi ức cấp 3)
                r: 5,
                employee: emp
            }));
            
            this.charts.nineBox = new Chart(ctx, {
                type: 'scatter',
                data: {
                    datasets: [{
                        label: 'Nhân viên',
                        data: data,
                        backgroundColor: data.map(d => d.employee.categoryColor),
                        borderColor: data.map(d => d.employee.categoryColor),
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Hiệu suất hiện tại'
                            },
                            min: 0,
                            max: 10,
                            ticks: { stepSize: 1 }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Tiềm năng phát triển'
                            },
                            min: 0,
                            max: 10,
                            ticks: { stepSize: 1 }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const emp = context.raw.employee;
                                    return [
                                        `${emp.name}`,
                                        `Phòng: ${emp.department}`,
                                        `Phân loại: ${emp.categoryLabel}`,
                                        `Điểm tổng: ${emp.totalScore.toFixed(2)}`
                                    ];
                                }
                            }
                        }
                    }
                }
            });
        }
    }
    
    createTopPerformersRadar() {
        const topPerformers = this.analyzer.getTopPerformers(5);
        const ctx = document.getElementById('topPerformersRadar');
        
        if (ctx) {
            const datasets = topPerformers.map((emp, index) => ({
                label: emp.name,
                data: emp.getRadarData().map(d => d.value),
                backgroundColor: `rgba(${index * 50}, ${100 + index * 30}, ${200 - index * 40}, 0.2)`,
                borderColor: `rgba(${index * 50}, ${100 + index * 30}, ${200 - index * 40}, 1)`,
                pointBackgroundColor: `rgba(${index * 50}, ${100 + index * 30}, ${200 - index * 40}, 1)`,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: `rgba(${index * 50}, ${100 + index * 30}, ${200 - index * 40}, 1)`
            }));
            
            this.charts.topPerformersRadar = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['Lãnh đạo', 'Chuyên môn', 'Giao tiếp', 'Làm việc nhóm', 
                            'Sáng tạo', 'Thích ứng', 'Trách nhiệm', 'Phát triển'],
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            angleLines: { display: true },
                            suggestedMin: 0,
                            suggestedMax: 10,
                            ticks: { stepSize: 2 }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                padding: 10,
                                font: { size: 12 }
                            }
                        }
                    }
                }
            });
        }
    }
    
    createTalentHeatmap() {
        const deptStats = this.analyzer.getDepartmentStats();
        const categories = Object.keys(CONFIG.talentCategories);
        
        // Tạo ma trận dữ liệu cho heatmap
        const heatmapData = [];
        deptStats.forEach((dept, deptIndex) => {
            categories.forEach((cat, catIndex) => {
                const count = dept.categories[cat] || 0;
                heatmapData.push({
                    x: catIndex,
                    y: deptIndex,
                    value: count
                });
            });
        });
        
        // Vẽ heatmap bằng D3.js hoặc library khác
        this.renderHeatmap(heatmapData, deptStats, categories);
    }
    
    renderHeatmap(data, departments, categories) {
        // Implementation cho heatmap
        // Có thể sử dụng D3.js hoặc Plotly.js
        const container = document.getElementById('talentHeatmap');
        if (!container) return;
        
        // Giả lập render heatmap
        container.innerHTML = `
            <div class="heatmap-container">
                <h3>Phân bố nhân tài theo phòng ban</h3>
                <div class="heatmap-grid">
                    ${this.generateHeatmapHTML(data, departments, categories)}
                </div>
            </div>
        `;
    }
    
    generateHeatmapHTML(data, departments, categories) {
        // Tạo HTML cho heatmap
        let html = '<table class="heatmap-table">';
        
        // Header
        html += '<tr><th></th>';
        categories.forEach(cat => {
            html += `<th>${CONFIG.talentCategories[cat].label}</th>`;
        });
        html += '</tr>';
        
        // Rows
        departments.forEach((dept, deptIndex) => {
            html += `<tr><td>${dept.department}</td>`;
            categories.forEach((cat, catIndex) => {
                const value = data.find(d => d.x === catIndex && d.y === deptIndex)?.value || 0;
                const intensity = value / 10; // Normalize
                html += `<td style="background-color: rgba(54, 162, 235, ${intensity})">${value}</td>`;
            });
            html += '</tr>';
        });
        
        html += '</table>';
        return html;
    }
    
    createDevelopmentTimeline() {
        const pipeline = this.analyzer.getTalentPipeline();
        const container = document.getElementById('developmentTimeline');
        
        if (container) {
            let html = '<div class="timeline-container">';
            html += '<h3>Lộ trình phát triển nhân tài</h3>';
            
            // Ready for promotion
            html += '<div class="timeline-section">';
            html += `<h4>Sẵn sàng thăng tiến (${pipeline.readyForPromotion.length} người)</h4>`;
            html += '<div class="employee-cards">';
            pipeline.readyForPromotion.slice(0, 5).forEach(emp => {
                html += this.createEmployeeCard(emp);
            });
            html += '</div></div>';
            
            // High potential
            html += '<div class="timeline-section">';
            html += `<h4>Tiềm năng cao (${pipeline.highPotential.length} người)</h4>`;
            html += '<div class="employee-cards">';
            pipeline.highPotential.slice(0, 5).forEach(emp => {
                html += this.createEmployeeCard(emp);
            });
            html += '</div></div>';
            
            html += '</div>';
            container.innerHTML = html;
        }
    }
    
    createEmployeeCard(employee) {
        return `
            <div class="employee-card" style="border-left: 4px solid ${employee.categoryColor}">
                <h5>${employee.name}</h5>
                <p>${employee.department} - ${employee.position}</p>
                <p>Điểm: ${employee.totalScore.toFixed(2)}</p>
                <span class="category-badge" style="background-color: ${employee.categoryColor}">
                    ${employee.categoryLabel}
                </span>
            </div>
        `;
    }
    
    // Update dashboard với dữ liệu realtime
    updateDashboard() {
        // Update summary statistics
        this.updateSummaryStats();
        
        // Update alerts
        this.updateAlerts();
        
        // Refresh charts if needed
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.update) {
                chart.update();
            }
        });
    }
    
    updateSummaryStats() {
        const stats = {
            totalEmployees: this.analyzer.employees.length,
            avgScore: this.analyzer.employees.reduce((sum, emp) => sum + emp.totalScore, 0) / this.analyzer.employees.length,
            topPerformers: this.analyzer.employees.filter(emp => emp.totalScore >= 8).length,
            riskEmployees: this.analyzer.employees.filter(emp => emp.category === 'risk').length
        };
        
        // Update DOM
        document.getElementById('totalEmployees').textContent = stats.totalEmployees;
        document.getElementById('avgScore').textContent = stats.avgScore.toFixed(2);
        document.getElementById('topPerformers').textContent = stats.topPerformers;
        document.getElementById('riskEmployees').textContent = stats.riskEmployees;
    }
    
    updateAlerts() {
        const alerts = [];
        
        // Check for departments with low average scores
        const deptStats = this.analyzer.getDepartmentStats();
        deptStats.forEach(dept => {
            if (dept.avgScore < 5) {
                alerts.push({
                    type: 'warning',
                    message: `Phòng ${dept.department} có điểm trung bình thấp (${dept.avgScore.toFixed(2)})`
                });
            }
        });
        
        // Check for high risk employees
        const riskCount = this.analyzer.getRiskEmployees().length;
        if (riskCount > 20) {
            alerts.push({
                type: 'danger',
                message: `Có ${riskCount} nhân viên trong nhóm rủi ro cao cần được hỗ trợ khẩn cấp`
            });
        }
        
        // Display alerts
        const alertContainer = document.getElementById('alertContainer');
        if (alertContainer) {
            alertContainer.innerHTML = alerts.map(alert => `
                <div class="alert alert-${alert.type}">
                    ${alert.message}
                </div>
            `).join('');
        }
    }
}

// ==================== MAIN APPLICATION ====================
class ABCDashboard {
    constructor() {
        this.analyzer = new ABCAnalyzer();
        this.visualizer = null;
        this.filters = {
            department: 'all',
            category: 'all',
            scoreRange: [0, 10]
        };
    }
    
    async init() {
        console.log('Initializing ABC Dashboard...');
        
        // Show loading indicator
        this.showLoading(true);
        
        try {
            // Load data
            await this.analyzer.loadData();
            console.log(`Loaded data for ${this.analyzer.employees.length} employees`);
            
            // Initialize visualizer
            this.visualizer = new DashboardVisualizer(this.analyzer);
            
            // Setup UI
            this.setupUI();
            
            // Create initial charts
            this.visualizer.initCharts();
            
            // Update dashboard
            this.visualizer.updateDashboard();
            
            // Hide loading
            this.showLoading(false);
            
            console.log('Dashboard initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize dashboard:', error);
            this.showError('Không thể tải dữ liệu. Vui lòng thử lại.');
        }
    }
    
    setupUI() {
        // Setup filter controls
        this.setupFilters();
        
        // Setup export buttons
        this.setupExportButtons();
        
        // Setup refresh button
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refresh());
        }
        
        // Setup search functionality
        this.setupSearch();
    }
    
    setupFilters() {
        // Department filter
        const deptFilter = document.getElementById('departmentFilter');
        if (deptFilter) {
            // Populate options
            deptFilter.innerHTML = '<option value="all">Tất cả phòng ban</option>';
            CONFIG.departments.forEach(dept => {
                deptFilter.innerHTML += `<option value="${dept}">${dept}</option>`;
            });
            
            // Add event listener
            deptFilter.addEventListener('change', (e) => {
                this.filters.department = e.target.value;
                this.applyFilters();
            });
        }
        
        // Category filter
        const catFilter = document.getElementById('categoryFilter');
        if (catFilter) {
            catFilter.innerHTML = '<option value="all">Tất cả phân loại</option>';
            Object.entries(CONFIG.talentCategories).forEach(([key, cat]) => {
                catFilter.innerHTML += `<option value="${key}">${cat.label}</option>`;
            });
            
            catFilter.addEventListener('change', (e) => {
                this.filters.category = e.target.value;
                this.applyFilters();
            });
        }
        
        // Score range slider
        const scoreSlider = document.getElementById('scoreRange');
        if (scoreSlider) {
            scoreSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.filters.scoreRange = [value, 10];
                document.getElementById('scoreRangeValue').textContent = `${value} - 10`;
                this.applyFilters();
            });
        }
    }
    
    setupExportButtons() {
        // Export to Excel
        const exportExcelBtn = document.getElementById('exportExcel');
        if (exportExcelBtn) {
            exportExcelBtn.addEventListener('click', () => this.exportToExcel());
        }
        
        // Export to PDF
        const exportPdfBtn = document.getElementById('exportPdf');
        if (exportPdfBtn) {
            exportPdfBtn.addEventListener('click', () => this.exportToPdf());
        }
        
        // Export individual reports
        const exportReportsBtn = document.getElementById('exportReports');
        if (exportReportsBtn) {
            exportReportsBtn.addEventListener('click', () => this.exportIndividualReports());
        }
    }
    
    setupSearch() {
        const searchInput = document.getElementById('employeeSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                this.searchEmployees(query);
            });
        }
    }
    
    applyFilters() {
        // Filter employees based on current filters
        let filtered = this.analyzer.employees;
        
        if (this.filters.department !== 'all') {
            filtered = filtered.filter(emp => emp.department === this.filters.department);
        }
        
        if (this.filters.category !== 'all') {
            filtered = filtered.filter(emp => emp.category === this.filters.category);
        }
        
        filtered = filtered.filter(emp => 
            emp.totalScore >= this.filters.scoreRange[0] && 
            emp.totalScore <= this.filters.scoreRange[1]
        );
        
        // Update displays with filtered data
        this.updateEmployeeList(filtered);
        
        // Update summary for filtered data
        this.updateFilteredSummary(filtered);
    }
    
    updateEmployeeList(employees) {
        const container = document.getElementById('employeeList');
        if (!container) return;
        
        let html = '<div class="employee-list">';
        employees.slice(0, 50).forEach(emp => {
            html += `
                <div class="employee-item" onclick="dashboard.showEmployeeDetail(${emp.id})">
                    <div class="employee-info">
                        <h4>${emp.name}</h4>
                        <p>${emp.department} - ${emp.position}</p>
                    </div>
                    <div class="employee-score">
                        <span class="score">${emp.totalScore.toFixed(2)}</span>
                        <span class="category" style="color: ${emp.categoryColor}">
                            ${emp.categoryLabel}
                        </span>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        
        container.innerHTML = html;
    }
    
    updateFilteredSummary(employees) {
        const summary = {
            total: employees.length,
            avgScore: employees.reduce((sum, emp) => sum + emp.totalScore, 0) / employees.length || 0
        };
        
        const summaryEl = document.getElementById('filteredSummary');
        if (summaryEl) {
            summaryEl.innerHTML = `
                Hiển thị ${summary.total} nhân viên - 
                Điểm trung bình: ${summary.avgScore.toFixed(2)}
            `;
        }
    }
    
    searchEmployees(query) {
        if (!query) {
            this.applyFilters();
            return;
        }
        
        const results = this.analyzer.employees.filter(emp => 
            emp.name.toLowerCase().includes(query) ||
            emp.department.toLowerCase().includes(query) ||
            emp.position.toLowerCase().includes(query)
        );
        
        this.updateEmployeeList(results);
        this.updateFilteredSummary(results);
    }
    
    showEmployeeDetail(employeeId) {
        const employee = this.analyzer.employees.find(emp => emp.id === employeeId);
        if (!employee) return;
        
        // Create modal or detail view
        const modal = document.getElementById('employeeDetailModal');
        if (modal) {
            // Populate modal with employee details
            modal.innerHTML = this.generateEmployeeDetailHTML(employee);
            
            // Show modal
            modal.style.display = 'block';
            
            // Create individual radar chart
            this.createIndividualRadarChart(employee);
        }
    }
    
    generateEmployeeDetailHTML(employee) {
        return `
            <div class="modal-content">
                <span class="close" onclick="dashboard.closeModal()">&times;</span>
                <div class="employee-detail-header">
                    <h2>${employee.name}</h2>
                    <span class="category-badge large" style="background-color: ${employee.categoryColor}">
                        ${employee.categoryLabel}
                    </span>
                </div>
                
                <div class="employee-detail-content">
                    <div class="info-section">
                        <h3>Thông tin cơ bản</h3>
                        <p><strong>Phòng ban:</strong> ${employee.department}</p>
                        <p><strong>Vị trí:</strong> ${employee.position}</p>
                        <p><strong>Ngày vào làm:</strong> ${employee.joinDate.toLocaleDateString('vi-VN')}</p>
                    </div>
                    
                    <div class="score-section">
                        <h3>Điểm đánh giá</h3>
                        <div class="score-breakdown">
                            <div class="score-item">
                                <span>Nhóm A (Hồi ức):</span>
                                <span>${employee.scores.groupA?.toFixed(2) || 'N/A'}</span>
                            </div>
                            <div class="score-item">
                                <span>Nhóm B (Năng lực):</span>
                                <span>${employee.scores.groupB?.toFixed(2) || 'N/A'}</span>
                            </div>
                            <div class="score-item">
                                <span>Nhóm C (360°):</span>
                                <span>${employee.scores.groupC?.toFixed(2) || 'N/A'}</span>
                            </div>
                            <div class="score-item">
                                <span>Nhóm D (Xác thực):</span>
                                <span>${employee.scores.groupD?.toFixed(2) || 'N/A'}</span>
                            </div>
                            <div class="score-item total">
                                <span>Điểm tổng hợp:</span>
                                <span>${employee.totalScore.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="radar-section">
                        <h3>Biểu đồ năng lực</h3>
                        <canvas id="individualRadarChart" width="400" height="400"></canvas>
                    </div>
                    
                    <div class="recommendation-section">
                        <h3>Đề xuất phát triển</h3>
                        ${this.generateRecommendations(employee)}
                    </div>
                </div>
            </div>
        `;
    }
    
    createIndividualRadarChart(employee) {
        const ctx = document.getElementById('individualRadarChart');
        if (!ctx) return;
        
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Lãnh đạo', 'Chuyên môn', 'Giao tiếp', 'Làm việc nhóm', 
                        'Sáng tạo', 'Thích ứng', 'Trách nhiệm', 'Phát triển'],
                datasets: [{
                    label: employee.name,
                    data: employee.getRadarData().map(d => d.value),
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
                }]
            },
            options: {
                scales: {
                    r: {
                        angleLines: { display: true },
                        suggestedMin: 0,
                        suggestedMax: 10,
                        ticks: { stepSize: 2 }
                    }
                }
            }
        });
    }
    
    generateRecommendations(employee) {
        let recommendations = '<ul>';
        
        // Based on category
        switch(employee.category) {
            case 'superstar':
                recommendations += '<li>Chuẩn bị cho vị trí lãnh đạo cao hơn</li>';
                recommendations += '<li>Tham gia các dự án chiến lược</li>';
                recommendations += '<li>Mentor cho nhân viên tiềm năng</li>';
                break;
            case 'goldenPotential':
                recommendations += '<li>Đào tạo kỹ năng lãnh đạo nâng cao</li>';
                recommendations += '<li>Giao thêm trách nhiệm quản lý</li>';
                recommendations += '<li>Rotate qua các phòng ban để mở rộng kinh nghiệm</li>';
                break;
            case 'roughDiamond':
                recommendations += '<li>Coaching 1-1 với mentor phù hợp</li>';
                recommendations += '<li>Đào tạo kỹ năng còn thiếu</li>';
                recommendations += '<li>Tạo cơ hội thể hiện năng lực</li>';
                break;
            case 'developing':
                recommendations += '<li>Xây dựng kế hoạch phát triển cá nhân chi tiết</li>';
                recommendations += '<li>Đào tạo kỹ năng cơ bản</li>';
                recommendations += '<li>Theo dõi tiến độ hàng tháng</li>';
                break;
            case 'risk':
                recommendations += '<li>Đánh giá lại sự phù hợp với vị trí</li>';
                recommendations += '<li>Hỗ trợ khẩn cấp hoặc chuyển đổi vị trí</li>';
                recommendations += '<li>Xây dựng kế hoạch cải thiện với deadline rõ ràng</li>';
                break;
        }
        
        // Based on weak points
        const weakPoints = Object.entries(employee.details)
            .filter(([_, value]) => value < 5)
            .map(([skill, _]) => skill);
        
        if (weakPoints.length > 0) {
            recommendations += '<li>Cải thiện các kỹ năng yếu: ' + 
                weakPoints.map(s => this.translateSkill(s)).join(', ') + '</li>';
        }
        
        recommendations += '</ul>';
        return recommendations;
    }
    
    translateSkill(skill) {
        const translations = {
            leadership: 'Lãnh đạo',
            technical: 'Chuyên môn',
            communication: 'Giao tiếp',
            teamwork: 'Làm việc nhóm',
            creativity: 'Sáng tạo',
            adaptability: 'Thích ứng',
            responsibility: 'Trách nhiệm',
            growth: 'Phát triển'
        };
        return translations[skill] || skill;
    }
    
    closeModal() {
        const modal = document.getElementById('employeeDetailModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    async exportToExcel() {
        console.log('Exporting to Excel...');
        
        // Prepare data for export
        const data = this.analyzer.employees.map(emp => ({
            'Mã NV': emp.id,
            'Họ tên': emp.name,
            'Phòng ban': emp.department,
            'Vị trí': emp.position,
            'Ngày vào làm': emp.joinDate.toLocaleDateString('vi-VN'),
            'Điểm Nhóm A': emp.scores.groupA?.toFixed(2) || '',
            'Điểm Nhóm B': emp.scores.groupB?.toFixed(2) || '',
            'Điểm Nhóm C': emp.scores.groupC?.toFixed(2) || '',
            'Điểm Nhóm D': emp.scores.groupD?.toFixed(2) || '',
            'Điểm tổng hợp': emp.totalScore.toFixed(2),
            'Phân loại': emp.categoryLabel,
            'Lãnh đạo': emp.details.leadership.toFixed(2),
            'Chuyên môn': emp.details.technical.toFixed(2),
            'Giao tiếp': emp.details.communication.toFixed(2),
            'Làm việc nhóm': emp.details.teamwork.toFixed(2),
            'Sáng tạo': emp.details.creativity.toFixed(2),
            'Thích ứng': emp.details.adaptability.toFixed(2),
            'Trách nhiệm': emp.details.responsibility.toFixed(2),
            'Phát triển': emp.details.growth.toFixed(2)
        }));
        
        // Use SheetJS or similar library to export
        // This is a placeholder - implement with actual Excel export library
        console.log('Excel data prepared:', data.length, 'rows');
        
        // Create download
        this.downloadFile('ABC_Analysis_Report.xlsx', 'Excel file would be generated here');
    }
    
    async exportToPdf() {
        console.log('Exporting to PDF...');
        
        // Generate PDF report
        // This would use a library like jsPDF or similar
        
        const pdfContent = `
            ESUHAI GROUP - BÁO CÁO PHÂN TÍCH NHÂN SỰ ABC
            ============================================
            
            Ngày báo cáo: ${new Date().toLocaleDateString('vi-VN')}
            Tổng số nhân viên: ${this.analyzer.employees.length}
            
            TỔNG QUAN:
            - Điểm trung bình toàn công ty: ${(this.analyzer.employees.reduce((sum, emp) => sum + emp.totalScore, 0) / this.analyzer.employees.length).toFixed(2)}
            - Số nhân viên xuất sắc: ${this.analyzer.employees.filter(emp => emp.totalScore >= 8).length}
            - Số nhân viên cần hỗ trợ: ${this.analyzer.employees.filter(emp => emp.category === 'risk').length}
            
            PHÂN BỐ THEO PHÂN LOẠI:
            ${Object.entries(this.analyzer.getCategoryDistribution())
                .map(([cat, count]) => `- ${CONFIG.talentCategories[cat].label}: ${count} người`)
                .join('\n')}
        `;
        
        this.downloadFile('ABC_Analysis_Report.pdf', pdfContent);
    }
    
    async exportIndividualReports() {
        console.log('Generating individual reports...');
        
        // Generate a report for each employee
        const reports = this.analyzer.employees.map(emp => this.generateIndividualReport(emp));
        
        // In real implementation, this would create a ZIP file with all reports
        console.log(`Generated ${reports.length} individual reports`);
        
        this.downloadFile('Individual_Reports.zip', 'Individual reports would be generated here');
    }
    
    generateIndividualReport(employee) {
        return `
            BÁO CÁO CÁ NHÂN - MÔ HÌNH ABC
            ==============================
            
            THÔNG TIN CÁ NHÂN:
            Họ tên: ${employee.name}
            Mã NV: ${employee.id}
            Phòng ban: ${employee.department}
            Vị trí: ${employee.position}
            Ngày vào làm: ${employee.joinDate.toLocaleDateString('vi-VN')}
            
            KẾT QUẢ ĐÁNH GIÁ:
            Điểm tổng hợp: ${employee.totalScore.toFixed(2)}/10
            Phân loại: ${employee.categoryLabel}
            
            CHI TIẾT ĐIỂM:
            - Nhóm A (Hồi ức cấp 3): ${employee.scores.groupA?.toFixed(2) || 'N/A'}
            - Nhóm B (Khai báo năng lực): ${employee.scores.groupB?.toFixed(2) || 'N/A'}
            - Nhóm C (Đánh giá 360°): ${employee.scores.groupC?.toFixed(2) || 'N/A'}
            - Nhóm D (Xác thực): ${employee.scores.groupD?.toFixed(2) || 'N/A'}
            
            PHÂN TÍCH NĂNG LỰC:
            ${Object.entries(employee.details)
                .map(([skill, value]) => `- ${this.translateSkill(skill)}: ${value.toFixed(2)}/10`)
                .join('\n')}
            
            ĐỀ XUẤT PHÁT TRIỂN:
            ${this.generateTextRecommendations(employee)}
        `;
    }
    
    generateTextRecommendations(employee) {
        // Similar to generateRecommendations but in text format
        let recommendations = [];
        
        switch(employee.category) {
            case 'superstar':
                recommendations = [
                    '1. Chuẩn bị cho vị trí lãnh đạo cao hơn',
                    '2. Tham gia các dự án chiến lược quan trọng',
                    '3. Đảm nhận vai trò mentor cho nhân viên tiềm năng'
                ];
                break;
            // ... other cases
        }
        
        return recommendations.join('\n');
    }
    
    downloadFile(filename, content) {
        // Create blob and download
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
    
    async refresh() {
        console.log('Refreshing dashboard...');
        this.showLoading(true);
        
        try {
            // Reload data
            await this.analyzer.loadData();
            
            // Update all visualizations
            this.visualizer.updateDashboard();
            
            // Apply current filters
            this.applyFilters();
            
            this.showLoading(false);
            console.log('Dashboard refreshed successfully');
            
        } catch (error) {
            console.error('Failed to refresh dashboard:', error);
            this.showError('Không thể làm mới dữ liệu');
        }
    }
    
    showLoading(show) {
        const loader = document.getElementById('loadingIndicator');
        if (loader) {
            loader.style.display = show ? 'block' : 'none';
        }
    }
    
    showError(message) {
        const errorContainer = document.getElementById('errorContainer');
        if (errorContainer) {
            errorContainer.innerHTML = `
                <div class="error-message">
                    <span>${message}</span>
                    <button onclick="dashboard.clearError()">×</button>
                </div>
            `;
            errorContainer.style.display = 'block';
        }
    }
    
    clearError() {
        const errorContainer = document.getElementById('errorContainer');
        if (errorContainer) {
            errorContainer.style.display = 'none';
        }
    }
}

// ==================== INITIALIZATION ====================
// Create global dashboard instance
let dashboard;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, initializing ABC Dashboard...');
    
    // Create dashboard instance
    dashboard = new ABCDashboard();
    
    // Initialize dashboard
    await dashboard.init();
});

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ABCDashboard,
        ABCAnalyzer,
        DashboardVisualizer,
        Employee,
        CONFIG
    };
}
