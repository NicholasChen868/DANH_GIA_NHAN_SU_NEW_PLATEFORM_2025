import { FORM_C_ID, ENTRY_IDS } from '../utils/constants.js';

export class GoogleFormService {
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateEmployee(employee) {
    if (!employee) {
      throw new Error('Thông tin nhân viên không hợp lệ');
    }

    if (!employee.email || !this.validateEmail(employee.email)) {
      throw new Error('Email nhân viên không hợp lệ hoặc thiếu');
    }

    if (!employee.name || !employee.name.trim()) {
      throw new Error('Tên nhân viên không được để trống');
    }

    return true;
  }

  generateFormCURL(employee) {
    try {
      this.validateEmployee(employee);

      const baseUrl = `https://docs.google.com/forms/d/e/1FAIpQLSfmOf---sF1s90IzEHIaMo-MVTIUX1k5kn2pCYKkhY-q-n6Mg/viewform`;
      
      const params = new URLSearchParams();
      params.append('usp', 'pp_url');
      
      // Prefill các trường với dữ liệu nhân viên
      params.append(ENTRY_IDS.evaluatedName, employee.name || '');
      params.append(ENTRY_IDS.evaluatedEmail, employee.email || '');
      params.append(ENTRY_IDS.evaluatedDept, employee.department || '');
      params.append(ENTRY_IDS.evaluatedRole, employee.role || '');
      params.append(ENTRY_IDS.evaluatedEmpId, employee.empId || '');

      const prefillUrl = `${baseUrl}?${params.toString()}`;
      
      return prefillUrl;
    } catch (error) {
      console.error('Lỗi tạo URL Form C:', error);
      throw error;
    }
  }

  openFormInNewTab(employee) {
    try {
      const url = this.generateFormCURL(employee);
      window.open(url, '_blank');
    } catch (error) {
      alert(`Không thể mở form đánh giá: ${error.message}`);
    }
  }
}