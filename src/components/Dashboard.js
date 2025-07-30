import { EmployeeCard } from './EmployeeCard.js';

export class Dashboard {
  constructor(employees = []) {
    this.employees = employees;
  }

  setEmployees(employees) {
    this.employees = employees;
  }

  renderHeader() {
    return `
      <div class="dashboard-header" style="
        background: #f8f9fa;
        padding: 20px;
        border-bottom: 1px solid #dee2e6;
        margin-bottom: 20px;
      ">
        <h1 style="margin: 0; color: #333; text-align: center;">
          Đánh giá năng lực nhân sự - Form C (360°)
        </h1>
        <p style="margin: 10px 0 0 0; text-align: center; color: #666;">
          Chọn nhân viên để thực hiện đánh giá 360°
        </p>
      </div>
    `;
  }

  renderEmployeeGrid() {
    if (!this.employees || this.employees.length === 0) {
      return `
        <div style="text-align: center; padding: 40px; color: #666;">
          <p>Không có dữ liệu nhân viên</p>
        </div>
      `;
    }

    return `
      <div class="employee-grid" style="
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 16px;
        padding: 0 20px;
        max-width: 1200px;
        margin: 0 auto;
      ">
        ${EmployeeCard.renderAll(this.employees)}
      </div>
    `;
  }

  render() {
    return `
      <div class="dashboard">
        ${this.renderHeader()}
        ${this.renderEmployeeGrid()}
      </div>
    `;
  }

  mount(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = this.render();
    } else {
      console.error(`Container with id '${containerId}' not found`);
    }
  }
}