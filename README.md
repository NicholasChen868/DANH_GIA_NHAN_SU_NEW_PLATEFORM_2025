# 🎯 HỆ THỐNG ĐÁNH GIÁ NHÂN SỰ ESUHAI GROUP 2025

## 📋 Tổng Quan

Hệ thống đánh giá nhân sự toàn diện dựa trên mô hình ABC, tích hợp AI phân tích và dashboard tương tác cho 420+ nhân viên Esuhai Group.

### 🎯 Mục Tiêu
- Đánh giá toàn diện năng lực và tiềm năng nhân sự
- Tự động hóa quy trình thu thập và phân tích dữ liệu
- Cung cấp dashboard trực quan để đánh giá 360 độ
- Tích hợp với Google Forms cho trải nghiệm quen thuộc

### 📊 Các Thành Phần Chính
1. **Form A**: Hồi ức cấp 3 & Hành trình phát triển cá nhân
2. **Form B**: Khai báo năng lực chuyên môn
3. **Form C**: Đánh giá 360 độ từ đồng nghiệp

## 🚀 Cài Đặt & Khởi Chạy

### Yêu Cầu Hệ Thống
- Node.js >= 16.x
- MongoDB >= 5.0
- Google Cloud Platform account với APIs enabled:
  - Google Forms API
  - Google Sheets API
  - Google Drive API

### Cài Đặt

```bash
# Clone repository
git clone https://github.com/esuhai/danh-gia-nhan-su-2025.git
cd DANH_GIA_NHAN_SU_NEWPLATEFORM_2025

# Cài đặt dependencies cho backend
cd backend
npm install

# Cài đặt dependencies cho frontend
cd ../frontend
npm install

# Copy file môi trường
cp .env.example .env
# Cập nhật các biến môi trường trong .env
```

### Khởi Chạy Development

```bash
# Terminal 1: Chạy backend
cd backend
npm run dev

# Terminal 2: Chạy frontend
cd frontend
npm start
```

Truy cập: http://localhost:3000

## 🏗️ Kiến Trúc Hệ Thống

### Tech Stack
- **Frontend**: React.js, Material-UI, Axios
- **Backend**: Node.js, Express.js, MongoDB
- **Integration**: Google Forms API, Google Sheets API
- **Authentication**: JWT + Google OAuth2
- **Real-time**: Socket.io
- **Caching**: Redis

### Data Flow
```
User → React Dashboard → Express API → MongoDB
                      ↓
                Google Forms API → Pre-filled Forms
                      ↓
              User Submission → Google Sheets
                      ↓
                Data Processing → Analytics Dashboard
```

## 📖 Hướng Dẫn Sử Dụng

### Cho Nhân Viên
1. Đăng nhập hệ thống bằng email công ty
2. Hoàn thành Form A (Hồi ức cấp 3)
3. Truy cập Dashboard để đánh giá đồng nghiệp
4. Click vào nhân viên cần đánh giá → Form được điền sẵn thông tin

### Cho Quản Lý
1. Truy cập Admin Dashboard
2. Theo dõi tiến độ hoàn thành forms
3. Xem báo cáo phân tích real-time
4. Export dữ liệu cho HR planning

## 🔐 Bảo Mật

- Mã hóa end-to-end cho dữ liệu nhạy cảm
- Role-based access control (RBAC)
- Audit logs cho mọi hoạt động
- Compliance với quy định bảo mật dữ liệu cá nhân
- Regular security audits

## 👥 Team Development

- **Project Lead**: [Tên]
- **Frontend Developer**: [Tên]
- **Backend Developer**: [Tên]
- **Data Analyst**: [Tên]
- **UI/UX Designer**: [Tên]

## 📞 Liên Hệ

- Email: hr@esuhai.com
- Hotline: 1900-xxxx
- Technical Support: tech@esuhai.com

## 📝 License

This project is proprietary and confidential to Esuhai Group.
