import * as XLSX from 'xlsx';
import { Employee, EMPLOYEE_DEPARTMENTS, EMPLOYEE_POSITIONS } from '../models/EmployeeModel';

class EmployeeDataService {
  constructor() {
    this.employees = [];
    this.isLoading = false;
    this.lastUpdated = null;
    this.cache = new Map();
    this.searchIndex = new Map();
  }

  async loadEmployeeData() {
    this.isLoading = true;
    
    try {
      // Try to load from Excel file first
      const realData = await this.loadFromExcel();
      if (realData && realData.length > 0) {
        console.log(`✅ Loaded ${realData.length} employees from Excel`);
        this.employees = realData;
        this.buildSearchIndex();
        this.lastUpdated = new Date();
        this.isLoading = false;
        return this.employees;
      }
    } catch (error) {
      console.warn('📂 Excel loading failed, using mock data:', error.message);
    }
    
    // Fallback to comprehensive mock data
    console.log('🎭 Using comprehensive Esuhai mock data');
    this.employees = this.generateEsuhaiMockData();
    this.buildSearchIndex();
    this.lastUpdated = new Date();
    this.isLoading = false;
    
    return this.employees;
  }
  
  async loadFromExcel() {
    try {
      // Try to read the Excel file from public directory
      const response = await fetch('/data/dim_users.xlsx');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Excel file not found`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON with headers
      const rawData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
        blankrows: false
      });
      
      if (rawData.length < 2) {
        throw new Error('No data rows found in Excel file');
      }
      
      const headers = rawData[0];
      const dataRows = rawData.slice(1);
      
      console.log(`📊 Processing ${dataRows.length} rows from Excel...`);
      
      // Map Excel data to Employee objects
      const employees = dataRows.map((row, index) => {
        try {
          return Employee.fromExcelRow(row, headers);
        } catch (error) {
          console.warn(`⚠️ Error processing row ${index + 2}:`, error.message);
          return null;
        }
      }).filter(Boolean);
      
      console.log(`✅ Successfully processed ${employees.length} employees`);
      return employees;
      
    } catch (error) {
      console.error('❌ Excel loading error:', error);
      throw error;
    }
  }
  
  generateEsuhaiMockData() {
    // Comprehensive mock data based on Esuhai organization structure
    const mockEmployees = [
      // BOD Level
      {
        name: 'Phạm Hoàng Thầy',
        position: EMPLOYEE_POSITIONS.CEO,
        department: EMPLOYEE_DEPARTMENTS.BOD,
        email: 'thay@esuhai.com',
        abcScores: { groupA: 3.2, groupB: 3.1, groupC: 3.2, totalScore: 9.5 },
        salary: { p1: 8, p2: 16, p3: 20, total: 44 },
        joinDate: '2015-01-01'
      },
      {
        name: 'Nguyễn Thị Phượng',
        position: EMPLOYEE_POSITIONS.DEPUTY_CEO,
        department: EMPLOYEE_DEPARTMENTS.BOD,
        email: 'phuong@esuhai.com',
        abcScores: { groupA: 3.1, groupB: 3.0, groupC: 3.1, totalScore: 9.2 },
        salary: { p1: 7, p2: 15, p3: 18, total: 40 },
        joinDate: '2016-03-15'
      },
      
      // BU Directors
      {
        name: 'Trần Văn Kha',
        position: EMPLOYEE_POSITIONS.BU_DIRECTOR,
        department: EMPLOYEE_DEPARTMENTS.BU_MSA,
        email: 'kha@esuhai.com',
        abcScores: { groupA: 2.9, groupB: 2.9, groupC: 3.0, totalScore: 8.8 },
        salary: { p1: 6, p2: 14, p3: 15, total: 35 },
        joinDate: '2017-06-01'
      },
      {
        name: 'Lê Thị Mai',
        position: EMPLOYEE_POSITIONS.BU_DIRECTOR,
        department: EMPLOYEE_DEPARTMENTS.BU_KAIZEN,
        email: 'mai@esuhai.com',
        abcScores: { groupA: 2.8, groupB: 2.8, groupC: 2.9, totalScore: 8.5 },
        salary: { p1: 6, p2: 13, p3: 13, total: 32 },
        joinDate: '2018-02-10'
      },
      {
        name: 'Hoàng Minh Tuấn',
        position: EMPLOYEE_POSITIONS.BU_DIRECTOR,
        department: EMPLOYEE_DEPARTMENTS.BU_ESUTECH,
        email: 'tuan.hoang@esuhai.com',
        abcScores: { groupA: 2.9, groupB: 2.7, groupC: 2.8, totalScore: 8.4 },
        salary: { p1: 6, p2: 12, p3: 14, total: 32 },
        joinDate: '2018-08-20'
      },
      
      // Marketing & Sales Team (BU MSA)
      {
        name: 'Nguyễn Hoàng Nam',
        position: EMPLOYEE_POSITIONS.TEAM_LEADER,
        department: EMPLOYEE_DEPARTMENTS.BU_MSA,
        email: 'nam.nguyen@esuhai.com',
        abcScores: { groupA: 2.6, groupB: 2.5, groupC: 2.7, totalScore: 7.8 },
        salary: { p1: 5, p2: 10, p3: 10, total: 25 },
        joinDate: '2019-04-15'
      },
      {
        name: 'Phạm Thị Hoa',
        position: EMPLOYEE_POSITIONS.SENIOR_SPECIALIST,
        department: EMPLOYEE_DEPARTMENTS.BU_MSA,
        email: 'hoa.pham@esuhai.com',
        abcScores: { groupA: 2.5, groupB: 2.5, groupC: 2.5, totalScore: 7.5 },
        salary: { p1: 5, p2: 9, p3: 8, total: 22 },
        joinDate: '2020-01-20'
      },
      {
        name: 'Trần Minh Đức',
        position: EMPLOYEE_POSITIONS.SPECIALIST,
        department: EMPLOYEE_DEPARTMENTS.BU_MSA,
        email: 'duc.tran@esuhai.com',
        abcScores: { groupA: 2.4, groupB: 2.4, groupC: 2.4, totalScore: 7.2 },
        salary: { p1: 4, p2: 8, p3: 6, total: 18 },
        joinDate: '2021-03-10'
      },
      {
        name: 'Lê Thị Hương',
        position: EMPLOYEE_POSITIONS.STAFF,
        department: EMPLOYEE_DEPARTMENTS.BU_MSA,
        email: 'huong.le@esuhai.com',
        abcScores: { groupA: 2.2, groupB: 2.1, groupC: 2.3, totalScore: 6.6 },
        salary: { p1: 4, p2: 6, p3: 4, total: 14 },
        joinDate: '2022-07-01'
      },
      
      // Kaizen Yoshida School
      {
        name: 'Yamamoto Sensei',
        position: EMPLOYEE_POSITIONS.SENIOR_SPECIALIST,
        department: EMPLOYEE_DEPARTMENTS.BU_KAIZEN,
        email: 'yamamoto@esuhai.com',
        abcScores: { groupA: 3.0, groupB: 2.9, groupC: 3.0, totalScore: 8.9 },
        salary: { p1: 6, p2: 12, p3: 12, total: 30 },
        joinDate: '2017-09-01'
      },
      {
        name: 'Nguyễn Thị Lan',
        position: EMPLOYEE_POSITIONS.SPECIALIST,
        department: EMPLOYEE_DEPARTMENTS.BU_KAIZEN,
        email: 'lan.nguyen@esuhai.com',
        abcScores: { groupA: 2.6, groupB: 2.6, groupC: 2.6, totalScore: 7.8 },
        salary: { p1: 4, p2: 8, p3: 8, total: 20 },
        joinDate: '2020-09-15'
      },
      {
        name: 'Tanaka San',
        position: EMPLOYEE_POSITIONS.SPECIALIST,
        department: EMPLOYEE_DEPARTMENTS.BU_KAIZEN,
        email: 'tanaka@esuhai.com',
        abcScores: { groupA: 2.5, groupB: 2.4, groupC: 2.6, totalScore: 7.5 },
        salary: { p1: 4, p2: 7, p3: 7, total: 18 },
        joinDate: '2021-01-10'
      },
      
      // ProSkills Team
      {
        name: 'Lý Hoàng Anh',
        position: EMPLOYEE_POSITIONS.TEAM_LEADER,
        department: EMPLOYEE_DEPARTMENTS.BU_PROSKILLS,
        email: 'anh.ly@esuhai.com',
        abcScores: { groupA: 2.7, groupB: 2.7, groupC: 2.7, totalScore: 8.1 },
        salary: { p1: 5, p2: 10, p3: 11, total: 26 },
        joinDate: '2019-08-01'
      },
      {
        name: 'Đặng Văn Minh',
        position: EMPLOYEE_POSITIONS.SPECIALIST,
        department: EMPLOYEE_DEPARTMENTS.BU_PROSKILLS,
        email: 'minh.dang@esuhai.com',
        abcScores: { groupA: 2.5, groupB: 2.4, groupC: 2.5, totalScore: 7.4 },
        salary: { p1: 4, p2: 8, p3: 7, total: 19 },
        joinDate: '2021-05-20'
      },
      
      // EsuCare Team
      {
        name: 'Nguyễn Thị Cẩm',
        position: EMPLOYEE_POSITIONS.TEAM_LEADER,
        department: EMPLOYEE_DEPARTMENTS.BU_ESUCARE,
        email: 'cam.nguyen@esuhai.com',
        abcScores: { groupA: 2.8, groupB: 2.7, groupC: 2.8, totalScore: 8.3 },
        salary: { p1: 5, p2: 11, p3: 11, total: 27 },
        joinDate: '2019-11-10'
      },
      {
        name: 'Phạm Thị Thảo',
        position: EMPLOYEE_POSITIONS.SPECIALIST,
        department: EMPLOYEE_DEPARTMENTS.BU_ESUCARE,
        email: 'thao.pham@esuhai.com',
        abcScores: { groupA: 2.5, groupB: 2.5, groupC: 2.6, totalScore: 7.6 },
        salary: { p1: 4, p2: 9, p3: 8, total: 21 },
        joinDate: '2020-12-01'
      },
      
      // EsuTech Team
      {
        name: 'Nguyễn Công Vinh',
        position: EMPLOYEE_POSITIONS.TEAM_LEADER,
        department: EMPLOYEE_DEPARTMENTS.BU_ESUTECH,
        email: 'vinh.nguyen@esuhai.com',
        abcScores: { groupA: 2.8, groupB: 2.8, groupC: 2.8, totalScore: 8.4 },
        salary: { p1: 5, p2: 11, p3: 12, total: 28 },
        joinDate: '2019-06-15'
      },
      {
        name: 'Trần Quốc Tuấn',
        position: EMPLOYEE_POSITIONS.SPECIALIST,
        department: EMPLOYEE_DEPARTMENTS.BU_ESUTECH,
        email: 'tuan.tran@esuhai.com',
        abcScores: { groupA: 2.6, groupB: 2.5, groupC: 2.6, totalScore: 7.7 },
        salary: { p1: 4, p2: 9, p3: 10, total: 23 },
        joinDate: '2020-10-05'
      },
      
      // Support Functions
      {
        name: 'Vũ Thị Hồng',
        position: EMPLOYEE_POSITIONS.DEPARTMENT_MANAGER,
        department: EMPLOYEE_DEPARTMENTS.HR,
        email: 'hong.vu@esuhai.com',
        abcScores: { groupA: 2.7, groupB: 2.7, groupC: 2.8, totalScore: 8.2 },
        salary: { p1: 6, p2: 11, p3: 12, total: 29 },
        joinDate: '2018-05-01'
      },
      {
        name: 'Lê Văn Tài',
        position: EMPLOYEE_POSITIONS.DEPARTMENT_MANAGER,
        department: EMPLOYEE_DEPARTMENTS.FINANCE,
        email: 'tai.le@esuhai.com',
        abcScores: { groupA: 2.7, groupB: 2.6, groupC: 2.7, totalScore: 8.0 },
        salary: { p1: 6, p2: 12, p3: 13, total: 31 },
        joinDate: '2018-01-15'
      },
      {
        name: 'Phạm Minh Tuấn',
        position: EMPLOYEE_POSITIONS.DEPARTMENT_MANAGER,
        department: EMPLOYEE_DEPARTMENTS.IT,
        email: 'tuan.pham@esuhai.com',
        abcScores: { groupA: 2.9, groupB: 2.8, groupC: 2.9, totalScore: 8.6 },
        salary: { p1: 6, p2: 13, p3: 14, total: 33 },
        joinDate: '2017-12-01'
      },
      {
        name: 'Nguyễn Thị Bích',
        position: EMPLOYEE_POSITIONS.TEAM_LEADER,
        department: EMPLOYEE_DEPARTMENTS.ADMIN,
        email: 'bich.nguyen@esuhai.com',
        abcScores: { groupA: 2.4, groupB: 2.4, groupC: 2.5, totalScore: 7.3 },
        salary: { p1: 5, p2: 9, p3: 10, total: 24 },
        joinDate: '2020-03-20'
      },
      {
        name: 'Trần Thị Nga',
        position: EMPLOYEE_POSITIONS.SPECIALIST,
        department: EMPLOYEE_DEPARTMENTS.LEGAL,
        email: 'nga.tran@esuhai.com',
        abcScores: { groupA: 2.7, groupB: 2.7, groupC: 2.7, totalScore: 8.1 },
        salary: { p1: 5, p2: 10, p3: 11, total: 26 },
        joinDate: '2019-09-10'
      }
    ];
    
    // Add more staff members across departments
    const departments = Object.values(EMPLOYEE_DEPARTMENTS);
    const additionalStaff = Array.from({ length: 20 }, (_, i) => {
      const deptIndex = i % departments.length;
      const baseScore = 4.5 + Math.random() * 3; // Random score between 4.5-7.5
      
      return {
        name: `Nhân Viên ${i + 21}`,
        position: Math.random() > 0.7 ? EMPLOYEE_POSITIONS.SPECIALIST : EMPLOYEE_POSITIONS.STAFF,
        department: departments[deptIndex],
        email: `nhanvien${i + 21}@esuhai.com`,
        abcScores: { 
          groupA: Math.round((baseScore / 3) * 10) / 10,
          groupB: Math.round((baseScore / 3) * 10) / 10,
          groupC: Math.round((baseScore / 3) * 10) / 10,
          totalScore: Math.round(baseScore * 10) / 10
        },
        salary: { 
          p1: 3 + Math.floor(Math.random() * 2),
          p2: 4 + Math.floor(Math.random() * 6),
          p3: 2 + Math.floor(Math.random() * 8),
          total: 12 + Math.floor(Math.random() * 8)
        },
        joinDate: this.randomJoinDate()
      };
    });
    
    const allEmployees = [...mockEmployees, ...additionalStaff];
    
    return allEmployees.map((data, index) => new Employee({
      ...data,
      id: `EMP${(index + 1).toString().padStart(3, '0')}`,
      employeeCode: `ESU${(index + 1).toString().padStart(4, '0')}`,
      phone: this.generatePhoneNumber(),
      canBeEvaluated: true,
      isActive: Math.random() > 0.05 // 95% active employees
    }));
  }
  
  buildSearchIndex() {
    this.searchIndex.clear();
    this.employees.forEach(employee => {
      // Multiple index keys for flexible lookup
      if (employee.id) this.searchIndex.set(employee.id, employee);
      if (employee.email) this.searchIndex.set(employee.email, employee);
      if (employee.employeeCode) this.searchIndex.set(employee.employeeCode, employee);
    });
  }
  
  randomJoinDate() {
    const start = new Date('2018-01-01');
    const end = new Date('2023-12-31');
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
  }
  
  generatePhoneNumber() {
    const prefixes = ['090', '091', '094', '096', '097', '098', '032', '033', '034', '035', '036', '037', '038', '039'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
    return `${prefix}${suffix}`;
  }
  
  // Search and filter methods
  searchEmployees(query) {
    if (!query || query.trim() === '') {
      return this.employees;
    }
    
    const searchTerm = query.toLowerCase().trim();
    return this.employees.filter(emp => 
      emp.searchText.includes(searchTerm)
    );
  }
  
  filterByDepartment(department) {
    if (!department || department === 'all') {
      return this.employees;
    }
    return this.employees.filter(emp => emp.department === department);
  }
  
  filterByABCCategory(category) {
    if (!category || category === 'all') {
      return this.employees;
    }
    return this.employees.filter(emp => emp.getABCCategoryName() === category);
  }
  
  filterByPosition(position) {
    if (!position || position === 'all') {
      return this.employees;
    }
    return this.employees.filter(emp => emp.position === position);
  }
  
  getEmployeeById(id) {
    return this.searchIndex.get(id) || this.employees.find(emp => emp.id === id);
  }
  
  getStatistics() {
    const total = this.employees.length;
    const active = this.employees.filter(emp => emp.isActive).length;
    
    const byDepartment = {};
    const byPosition = {};
    const byABCCategory = {};
    const salaryDistribution = { total: 0, average: 0, grades: {} };
    
    let totalSalary = 0;
    let salaryCount = 0;
    
    this.employees.forEach(emp => {
      // Department stats
      byDepartment[emp.department] = (byDepartment[emp.department] || 0) + 1;
      
      // Position stats  
      byPosition[emp.position] = (byPosition[emp.position] || 0) + 1;
      
      // ABC Category stats
      const category = emp.getABCCategoryName();
      byABCCategory[category] = (byABCCategory[category] || 0) + 1;
      
      // Salary stats
      if (emp.salary.total) {
        totalSalary += emp.salary.total;
        salaryCount++;
        
        const grade = emp.getSalaryGrade();
        salaryDistribution.grades[grade] = (salaryDistribution.grades[grade] || 0) + 1;
      }
    });
    
    salaryDistribution.total = totalSalary;
    salaryDistribution.average = salaryCount > 0 ? Math.round((totalSalary / salaryCount) * 10) / 10 : 0;
    
    return {
      total,
      active,
      inactive: total - active,
      byDepartment,
      byPosition,
      byABCCategory,
      salaryDistribution,
      lastUpdated: this.lastUpdated
    };
  }
  
  // For Form C integration - maintain compatibility
  getEvaluableEmployees(currentUserId) {
    return this.employees.filter(employee => {
      // Exclude current user if self-evaluation disabled
      if (employee.id === currentUserId) {
        return false; // Assuming self-evaluation is disabled
      }
      
      // Check if employee can be evaluated
      return employee.canBeEvaluated && employee.isActive;
    });
  }
}

export default new EmployeeDataService();