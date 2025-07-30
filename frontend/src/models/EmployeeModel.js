export const EMPLOYEE_DEPARTMENTS = {
  BOD: 'Ban Lãnh Đạo',
  BU_MSA: 'Marketing, Sales & Admission', 
  BU_IDS: 'Matching & Export Services',
  BU_KAIZEN: 'Kaizen Yoshida School',
  BU_PROSKILLS: 'ProSkills',
  BU_ESUCARE: 'EsuCare',
  BU_ESUTECH: 'EsuTech',
  BU_KOKA: 'Koka-Team Vietnam',
  BU_ESUWORKS: 'EsuWorks',
  BU_ALESU: 'ALESU',
  BU_JPC: 'JPC',
  BU_GATEAWARDS: 'GateAwards',
  FINANCE: 'Tài Chính - Kế Toán',
  HR: 'Nhân Sự',
  IT: 'Công Nghệ Thông Tin',
  ADMIN: 'Hành Chính - Tổng Vụ',
  LEGAL: 'Pháp Chế'
};

export const EMPLOYEE_POSITIONS = {
  CEO: 'Tổng Giám Đốc',
  DEPUTY_CEO: 'Phó Tổng Giám Đốc',
  BOD_MEMBER: 'Thành Viên HĐQT',
  BU_DIRECTOR: 'Trưởng BU',
  DEPARTMENT_MANAGER: 'Trưởng Phòng',
  TEAM_LEADER: 'Team Leader',
  SENIOR_SPECIALIST: 'Chuyên Viên Cấp Cao',
  SPECIALIST: 'Chuyên Viên',
  STAFF: 'Nhân Viên',
  INTERN: 'Thực Tập Sinh'
};

export const EMPLOYEE_GRADES = {
  P1: { min: 3, max: 8, description: 'Lương Cơ Bản' },
  P2: { min: 0, max: 16, description: 'Lương Hiệu Suất' },
  P3: { min: 0, max: 20, description: 'Thưởng Đặc Biệt' }
};

export const ABC_CATEGORIES = [
  { name: 'Siêu Sao', minScore: 9, color: '#10B981', bgColor: '#ECFDF5' },
  { name: 'Tiềm Năng Vàng', minScore: 8, color: '#F59E0B', bgColor: '#FFFBEB' },
  { name: 'Trụ Cột Vững', minScore: 7, color: '#3B82F6', bgColor: '#EFF6FF' },
  { name: 'Kim Cương Thô', minScore: 6, color: '#8B5CF6', bgColor: '#F3E8FF' },
  { name: 'Người Thực Thi', minScore: 5, color: '#06B6D4', bgColor: '#ECFEFF' },
  { name: 'Cần Phát Triển', minScore: 4, color: '#F97316', bgColor: '#FFF7ED' },
  { name: 'Rủi Ro Cao', minScore: 0, color: '#EF4444', bgColor: '#FEF2F2' }
];

export class Employee {
  constructor(data = {}) {
    this.id = data.id || `EMP${Date.now()}`;
    this.employeeCode = data.employeeCode || this.id;
    this.name = data.name || '';
    this.email = data.email || '';
    this.department = data.department || '';
    this.position = data.position || '';
    this.level = data.level || 'STAFF';
    this.joinDate = data.joinDate || new Date().toISOString().split('T')[0];
    this.phone = data.phone || '';
    this.avatar = data.avatar || this.generateAvatar();
    this.canBeEvaluated = data.canBeEvaluated !== false;
    this.isActive = data.isActive !== false;
    
    // ABC Model scores (if available)
    this.abcScores = {
      groupA: data.abcScores?.groupA || null, // Hồi ức cấp 3
      groupB: data.abcScores?.groupB || null, // Khai báo năng lực  
      groupC: data.abcScores?.groupC || null, // Đánh giá 360
      totalScore: data.abcScores?.totalScore || null
    };
    
    // Salary information (if available)
    this.salary = {
      p1: data.salary?.p1 || null,
      p2: data.salary?.p2 || null, 
      p3: data.salary?.p3 || null,
      total: data.salary?.total || null
    };
    
    // Generate search text for filtering
    this.searchText = this.generateSearchText();
  }
  
  generateAvatar() {
    // Generate avatar based on name initials
    const initials = this.name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&color=fff&size=64`;
  }
  
  generateSearchText() {
    return [
      this.name,
      this.email,
      this.department,
      this.position,
      this.employeeCode
    ].filter(Boolean).join(' ').toLowerCase();
  }
  
  getFullTitle() {
    return `${this.position} - ${this.department}`;
  }
  
  getABCCategory() {
    if (!this.abcScores.totalScore) return ABC_CATEGORIES[ABC_CATEGORIES.length - 1];
    
    const score = this.abcScores.totalScore;
    for (let category of ABC_CATEGORIES) {
      if (score >= category.minScore) {
        return category;
      }
    }
    
    return ABC_CATEGORIES[ABC_CATEGORIES.length - 1];
  }
  
  getABCCategoryName() {
    return this.getABCCategory().name;
  }
  
  getSalaryGrade() {
    if (!this.salary.total) return 'N/A';
    
    const total = this.salary.total;
    if (total >= 30) return 'Grade A';
    if (total >= 20) return 'Grade B';  
    if (total >= 15) return 'Grade C';
    if (total >= 10) return 'Grade D';
    return 'Grade E';
  }
  
  getYearsOfService() {
    const joinDate = new Date(this.joinDate);
    const now = new Date();
    const diffTime = Math.abs(now - joinDate);
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    return diffYears;
  }
  
  getExperienceLevel() {
    const years = this.getYearsOfService();
    if (years >= 5) return 'Senior';
    if (years >= 2) return 'Mid-level';
    return 'Junior';
  }
  
  // For Form C integration
  toFormCData() {
    return {
      name: this.name,
      email: this.email,
      department: this.department,
      position: this.position,
      employeeCode: this.employeeCode
    };
  }
  
  // Static methods for data processing
  static fromExcelRow(rowData, headers) {
    const data = {};
    
    headers.forEach((header, index) => {
      const normalizedHeader = Employee.normalizeHeader(header);
      if (normalizedHeader && rowData[index] !== undefined) {
        data[normalizedHeader] = rowData[index];
      }
    });
    
    return new Employee({
      id: data.id || data.employeeCode || `EMP${Date.now()}`,
      employeeCode: data.employeeCode || data.id || `ESU${Date.now()}`,
      name: data.name || data.fullName || '',
      email: data.email || data.emailAddress || '',
      department: Employee.mapDepartment(data.department || data.dept || ''),
      position: Employee.mapPosition(data.position || data.title || ''),
      joinDate: data.joinDate || data.startDate || new Date().toISOString().split('T')[0],
      phone: data.phone || data.phoneNumber || '',
      isActive: data.isActive !== false && data.status !== 'Inactive'
    });
  }
  
  static normalizeHeader(header) {
    if (!header) return null;
    
    const normalized = header.toString().toLowerCase().trim();
    
    const headerMap = {
      'họ và tên': 'name',
      'họ tên': 'name', 
      'full name': 'name',
      'tên': 'name',
      'email': 'email',
      'email address': 'email',
      'địa chỉ email': 'email',
      'phòng ban': 'department',
      'department': 'department',
      'dept': 'department',
      'bộ phận': 'department',
      'chức vụ': 'position',
      'position': 'position',
      'title': 'position',
      'vị trí': 'position',
      'mã nhân viên': 'employeeCode',
      'employee code': 'employeeCode',
      'employee id': 'id',
      'id': 'id',
      'số điện thoại': 'phone',
      'phone': 'phone',
      'điện thoại': 'phone',
      'ngày vào làm': 'joinDate',
      'join date': 'joinDate',
      'start date': 'joinDate',
      'trạng thái': 'status',
      'status': 'status'
    };
    
    return headerMap[normalized] || normalized.replace(/\s+/g, '');
  }
  
  static mapDepartment(dept) {
    if (!dept) return 'Khác';
    
    const deptStr = dept.toString().toLowerCase();
    
    if (deptStr.includes('marketing') || deptStr.includes('sales') || deptStr.includes('admission')) {
      return EMPLOYEE_DEPARTMENTS.BU_MSA;
    }
    if (deptStr.includes('kaizen') || deptStr.includes('yoshida')) {
      return EMPLOYEE_DEPARTMENTS.BU_KAIZEN;
    }
    if (deptStr.includes('proskills') || deptStr.includes('skill')) {
      return EMPLOYEE_DEPARTMENTS.BU_PROSKILLS;
    }
    if (deptStr.includes('esucare') || deptStr.includes('care')) {
      return EMPLOYEE_DEPARTMENTS.BU_ESUCARE;
    }
    if (deptStr.includes('esutech') || deptStr.includes('tech')) {
      return EMPLOYEE_DEPARTMENTS.BU_ESUTECH;
    }
    if (deptStr.includes('tài chính') || deptStr.includes('finance') || deptStr.includes('kế toán')) {
      return EMPLOYEE_DEPARTMENTS.FINANCE;
    }
    if (deptStr.includes('nhân sự') || deptStr.includes('hr') || deptStr.includes('human')) {
      return EMPLOYEE_DEPARTMENTS.HR;
    }
    if (deptStr.includes('it') || deptStr.includes('công nghệ')) {
      return EMPLOYEE_DEPARTMENTS.IT;
    }
    if (deptStr.includes('hành chính') || deptStr.includes('admin')) {
      return EMPLOYEE_DEPARTMENTS.ADMIN;
    }
    if (deptStr.includes('pháp') || deptStr.includes('legal')) {
      return EMPLOYEE_DEPARTMENTS.LEGAL;
    }
    
    return dept;
  }
  
  static mapPosition(position) {
    if (!position) return EMPLOYEE_POSITIONS.STAFF;
    
    const posStr = position.toString().toLowerCase();
    
    if (posStr.includes('ceo') || posStr.includes('tổng giám đốc')) {
      return EMPLOYEE_POSITIONS.CEO;
    }
    if (posStr.includes('phó tổng') || posStr.includes('deputy')) {
      return EMPLOYEE_POSITIONS.DEPUTY_CEO;
    }
    if (posStr.includes('trưởng bu') || posStr.includes('bu director')) {
      return EMPLOYEE_POSITIONS.BU_DIRECTOR;
    }
    if (posStr.includes('trưởng phòng') || posStr.includes('manager')) {
      return EMPLOYEE_POSITIONS.DEPARTMENT_MANAGER;
    }
    if (posStr.includes('team leader') || posStr.includes('leader')) {
      return EMPLOYEE_POSITIONS.TEAM_LEADER;
    }
    if (posStr.includes('senior') || posStr.includes('cấp cao')) {
      return EMPLOYEE_POSITIONS.SENIOR_SPECIALIST;
    }
    if (posStr.includes('chuyên viên') || posStr.includes('specialist')) {
      return EMPLOYEE_POSITIONS.SPECIALIST;
    }
    if (posStr.includes('thực tập') || posStr.includes('intern')) {
      return EMPLOYEE_POSITIONS.INTERN;
    }
    
    return EMPLOYEE_POSITIONS.STAFF;
  }
}