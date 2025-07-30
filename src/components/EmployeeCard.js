import { GoogleFormService } from '../services/googleFormService.js';

export class EmployeeCard {
  constructor(employee) {
    this.employee = employee;
    this.googleFormService = new GoogleFormService();
  }

  handleFormCEvaluation() {
    this.googleFormService.openFormInNewTab(this.employee);
  }

  render() {
    const { employee } = this;
    
    return `
      <div class="employee-card" style="
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 16px;
        margin: 12px;
        background: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        max-width: 350px;
      ">
        <div class="employee-info" style="margin-bottom: 16px;">
          <h3 style="margin: 0 0 8px 0; color: #333; font-size: 18px;">
            ${employee.name || 'N/A'}
          </h3>
          <p style="margin: 4px 0; color: #666; font-size: 14px;">
            <strong>Mã NV:</strong> ${employee.empId || 'N/A'}
          </p>
          <p style="margin: 4px 0; color: #666; font-size: 14px;">
            <strong>Email:</strong> ${employee.email || 'N/A'}
          </p>
          <p style="margin: 4px 0; color: #666; font-size: 14px;">
            <strong>Bộ phận:</strong> ${employee.department || 'N/A'}
          </p>
          <p style="margin: 4px 0; color: #666; font-size: 14px;">
            <strong>Chức vụ:</strong> ${employee.role || 'N/A'}
          </p>
        </div>
        
        <button 
          class="form-c-btn"
          onclick="window.employeeCards['${employee.empId}'].handleFormCEvaluation()"
          style="
            background: #007bff;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 12px 16px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            width: 100%;
            min-height: 44px;
            transition: background-color 0.2s;
          "
          onmouseover="this.style.background='#0056b3'"
          onmouseout="this.style.background='#007bff'"
          ontouchstart="this.style.background='#0056b3'"
          ontouchend="this.style.background='#007bff'"
        >
          📋 Đánh giá 360°
        </button>
      </div>
    `;
  }

  static renderAll(employees) {
    if (!window.employeeCards) {
      window.employeeCards = {};
    }

    return employees.map(employee => {
      const card = new EmployeeCard(employee);
      window.employeeCards[employee.empId] = card;
      return card.render();
    }).join('');
  }
}