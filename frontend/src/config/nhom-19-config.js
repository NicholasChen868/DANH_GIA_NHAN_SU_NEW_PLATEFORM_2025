// Cấu hình 19 nhóm chuẩn - Auto generated 2025-07-31T19:41:21.124Z
export const NHOM_19_CONFIG = {
  "KINH_DOANH_TU_VAN": {
    "title": "🎯 Kinh Doanh Tư Vấn Tuyến Đầu",
    "description": "Tiếp xúc khách hàng, tạo doanh thu, kỹ năng thuyết phục",
    "groups": [
      {
        "id": 1,
        "name": "MSA - Marketing Sales Admission",
        "shortName": "MSA",
        "count": 52,
        "target": 60
      },
      {
        "id": 5,
        "name": "Kokateam Việt Nam",
        "shortName": "Kokateam VN",
        "count": 28,
        "target": 28
      },
      {
        "id": 10,
        "name": "EsuWorks - Tuyển dụng trong nước",
        "shortName": "EsuWorks",
        "count": 10,
        "target": 7
      },
      {
        "id": 11,
        "name": "Gate Awards - Tư vạn du học cao cấp",
        "shortName": "Gate Awards",
        "count": 7,
        "target": 7
      }
    ]
  },
  "DAO_TAO_GIAO_DUC": {
    "title": "📚 Đào Tạo Giáo Dục",
    "description": "Giảng dạy trực tiếp, phát triển năng lực học viên",
    "groups": [
      {
        "id": 3,
        "name": "Kaizen Yoshida School",
        "shortName": "Kaizen",
        "count": 121,
        "target": 104
      },
      {
        "id": 4,
        "name": "JPC - Japan Professional College",
        "shortName": "JPC",
        "count": 3,
        "target": 5
      },
      {
        "id": 7,
        "name": "ProSkills - Phát triển kỹ năng",
        "shortName": "ProSkills",
        "count": 15,
        "target": 14
      },
      {
        "id": 9,
        "name": "EsuCare - Chăm sóc con người",
        "shortName": "EsuCare",
        "count": 2,
        "target": 2
      }
    ]
  },
  "DICH_VU_VAN_HANH": {
    "title": "⚙️ Dịch Vụ Vận Hành",
    "description": "Xử lý hồ sơ, hỗ trợ sau bán, thực hiện quy trình",
    "groups": [
      {
        "id": 2,
        "name": "IDS - International Dispatch Services",
        "shortName": "IDS",
        "count": 24,
        "target": 24
      },
      {
        "id": 8,
        "name": "EsuTech - Kỹ sư & Outsourcing",
        "shortName": "EsuTech",
        "count": 33,
        "target": 30
      },
      {
        "id": 12,
        "name": "Nhân Sự",
        "shortName": "HR",
        "count": 10,
        "target": 7
      },
      {
        "id": 15,
        "name": "Tổng Hợp - Hành chính",
        "shortName": "Tổng Hợp",
        "count": 34,
        "target": 30
      }
    ]
  },
  "HO_TRO_CHUYEN_MON": {
    "title": "🔧 Hỗ Trợ Chuyên Môn",
    "description": "Tư vấn chuyên sâu, kiểm soát rủi ro, đảm bảo tuân thủ",
    "groups": [
      {
        "id": 13,
        "name": "Pháp Chế",
        "shortName": "Legal",
        "count": 7,
        "target": 7
      },
      {
        "id": 14,
        "name": "Tài Chính Kế Toán",
        "shortName": "Finance",
        "count": 9,
        "target": 8
      },
      {
        "id": 16,
        "name": "Alesu Truyền Thông",
        "shortName": "Media",
        "count": 15,
        "target": 12
      },
      {
        "id": 17,
        "name": "Alesu CNTT",
        "shortName": "IT",
        "count": 13,
        "target": 10
      }
    ]
  },
  "QUAN_LY_DIEU_HANH": {
    "title": "👑 Quản Lý Điều Hành",
    "description": "Lãnh đạo chiến lược, ra quyết định, đại diện đối ngoại",
    "groups": [
      {
        "id": 18,
        "name": "Ban Thư Ký Trợ Lý",
        "shortName": "Assistant",
        "count": 6,
        "target": 6
      },
      {
        "id": 19,
        "name": "BOD - Ban Tổng Giám Đốc",
        "shortName": "BOD",
        "count": 7,
        "target": 9
      }
    ]
  }
};

export const getAllNhom = () => {
    return Object.values(NHOM_19_CONFIG).flatMap(cum => cum.groups);
};

export const getNhomByCum = (cumKey) => {
    return NHOM_19_CONFIG[cumKey]?.groups || [];
};

export const getTotalEmployees = () => {
    return Object.values(NHOM_19_CONFIG)
        .flatMap(cum => cum.groups)
        .reduce((total, group) => total + group.count, 0);
};

export const getTotalByStatus = () => {
    const total = getTotalEmployees();
    const target = Object.values(NHOM_19_CONFIG)
        .flatMap(cum => cum.groups)
        .reduce((total, group) => total + group.target, 0);
    
    return { actual: total, target, variance: total - target };
};

export const getCumColors = () => {
    return {
        'KINH_DOANH_TU_VAN': '#3B82F6',
        'DAO_TAO_GIAO_DUC': '#10B981', 
        'DICH_VU_VAN_HANH': '#F59E0B',
        'HO_TRO_CHUYEN_MON': '#8B5CF6',
        'QUAN_LY_DIEU_HANH': '#EF4444'
    };
};

export const getNhomByName = (nhomName) => {
    const allGroups = getAllNhom();
    return allGroups.find(group => group.name === nhomName);
};

export const getCumByNhom = (nhomName) => {
    for (const [cumKey, cumData] of Object.entries(NHOM_19_CONFIG)) {
        if (cumData.groups.some(group => group.name === nhomName)) {
            return { key: cumKey, ...cumData };
        }
    }
    return null;
};
