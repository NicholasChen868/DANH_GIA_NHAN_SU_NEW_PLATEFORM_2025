# ESUHAI ABC MODEL - QUICK ACCESS LINKS
# Tệp này chứa các link nhanh để testing và development

## 📋 FORM LINKS CHÍNH

### Form A - Hồi ức cấp 3 & Hành trình phát triển cá nhân
- **URL Gốc:** https://forms.gle/Y6fYUHbRcMP2jfHH7
- **URL có sẵn dữ liệu test:** https://docs.google.com/forms/d/e/1FAIpQLSfhk-cfvPrDlpRONfmdDo6L6w1N5UhdgAZecmYLmZNDcXw9HQ/viewform?usp=pp_url&entry.1704172586=HOÀNG&entry.1184622690=S203&entry.1121817413=BAN+TỔNG+GIÁM+ĐỐC&entry.1727774632=BOD&entry.875025279=hoangkha@esuhai.com

### Form B - Khai báo năng lực toàn diện  
- **URL Gốc:** https://forms.gle/iMUPkrUWnxpdsJHu5
- **URL có sẵn dữ liệu test:** https://docs.google.com/forms/d/e/1FAIpQLSepXF4C3-dUrmoeBrW4e8v2re4DxsAyiboqc1yI-2VOvjVSiw/viewform?usp=pp_url&entry.1519666825=Trần+Hoàng+Kha&entry.570205598=hoangkha@esuhai.com&entry.870287758=S051&entry.2096138668=Nam&entry.1655662338=2025-06-29&entry.1894722077=HỒ+CHÍ+MINH&entry.712912742=Đại+học&entry.1741978684=TC+-+Tài+chính,+Kế+toán

## 🔧 TECHNICAL DETAILS

### Form A Entry IDs
- Tên: 1704172586
- Mã nhân viên: 1184622690  
- Chức vụ: 1121817413
- Phòng ban: 1727774632
- Email: 875025279

### Form B Entry IDs  
- Họ tên: 1519666825
- Email: 570205598
- Mã NV: 870287758
- Giới tính: 2096138668
- Ngày sinh: 1655662338
- Quê quán: 1894722077
- Trình độ: 712912742
- Bộ phận: 1741978684

## 📊 TESTING DATA

### Sample User Data for Testing
```json
{
  "name": "Trần Hoàng Kha",
  "email": "hoangkha@esuhai.com", 
  "code": "S051",
  "gender": "Nam",
  "dob": "2025-06-29",
  "location": "HỒ CHÍ MINH",
  "education": "Đại học",
  "department": "TC - Tài chính, Kế toán",
  "position": "BAN TỔNG GIÁM ĐỐC"
}
```

## 🎯 URL GENERATION PATTERNS

### Form A Pattern:
```
https://docs.google.com/forms/d/e/1FAIpQLSfhk-cfvPrDlpRONfmdDo6L6w1N5UhdgAZecmYLmZNDcXw9HQ/viewform?usp=pp_url
&entry.1704172586={NAME}
&entry.1184622690={CODE}
&entry.1121817413={POSITION}
&entry.1727774632={DEPARTMENT}
&entry.875025279={EMAIL}
```

### Form B Pattern:
```
https://docs.google.com/forms/d/e/1FAIpQLSepXF4C3-dUrmoeBrW4e8v2re4DxsAyiboqc1yI-2VOvjVSiw/viewform?usp=pp_url
&entry.1519666825={FULL_NAME}
&entry.570205598={EMAIL}
&entry.870287758={CODE}
&entry.2096138668={GENDER}
&entry.1655662338={DOB}
&entry.1894722077={LOCATION}
&entry.712912742={EDUCATION}
&entry.1741978684={DEPARTMENT}
```

## 🚀 QUICK COMMANDS

### JavaScript/Node.js
```javascript
const config = require('./config.js');
const formAUrl = config.generateFormUrl('formA', userData);
const formBUrl = config.generateFormUrl('formB', userData);
```

### Python
```python
from config import EsuhaiABCConfig
form_a_url = EsuhaiABCConfig.generate_form_url('A', user_data)
form_b_url = EsuhaiABCConfig.generate_form_url('B', user_data)
```

### cURL Testing
```bash
# Test Form A
curl -I "https://forms.gle/Y6fYUHbRcMP2jfHH7"

# Test Form B  
curl -I "https://forms.gle/iMUPkrUWnxpdsJHu5"
```

## 📁 FILE STRUCTURE
```
D:\DANH_GIA_NHAN_SU_NEWPLATEFORM_2025\
├── .env                    # Environment variables
├── config.js              # JavaScript configuration
├── config.py              # Python configuration  
├── package.json           # Node.js package info
├── FORM_LINKS.md          # This file
└── [other project files]
```

## 💡 NOTES FOR DEVELOPERS

1. **URL Encoding:** Luôn encode các tham số có dấu tiếng Việt
2. **Entry IDs:** Không thay đổi entry IDs khi update form
3. **Testing:** Sử dụng data mẫu để test trước khi deploy
4. **Security:** Không commit sensitive data vào git
5. **Backup:** Backup form responses định kỳ

## 🔄 UPDATE LOG

- **30/01/2025:** Tạo file config và environment  
- **30/01/2025:** Thêm JavaScript và Python config
- **30/01/2025:** Setup package.json và dependencies

---
*File này được tạo tự động bởi Claude AI - Esuhai ABC Model v2.0*
