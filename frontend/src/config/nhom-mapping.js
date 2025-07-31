// Mapping constants cho 19 nhóm chuẩn - Auto generated 2025-07-31T19:41:21.127Z
export const PHONG_TO_NHOM_MAPPING = {
    "ALESU_CNTT": "Alesu CNTT",
    "ALESU_TRUYỀN THÔNG": "Alesu Truyền Thông", 
    "BAN THƯ KÝ TRỢ LÝ": "Ban Thư Ký Trợ Lý",
    "BOD (BAN TỔNG GIÁM ĐỐC)": "BOD - Ban Tổng Giám Đốc",
    "ESUCARE": "EsuCare - Chăm sóc con người",
    "ESUTECH": "EsuTech - Kỹ sư & Outsourcing",
    "ESUWORKS": "EsuWorks - Tuyển dụng trong nước",
    "GATE AWARDS": "Gate Awards - Tư vạn du học cao cấp",
    "IDS": "IDS - International Dispatch Services",
    "JPC": "JPC - Japan Professional College",
    "KAIZEN": "Kaizen Yoshida School",
    "Kaizen": "Kaizen Yoshida School", 
    "KOKATEAM": "Kokateam Việt Nam",
    "MSA": "MSA - Marketing Sales Admission",
    "NHÂN SỰ": "Nhân Sự", 
    "PHÁP CHẾ": "Pháp Chế",
    "PROSKILLS": "ProSkills - Phát triển kỹ năng",
    "TÀI CHÍNH KẾ TOÁN": "Tài Chính Kế Toán",
    "TỔNG HỢP": "Tổng Hợp - Hành chính"
};

export const mapPhongToNhom = (phong) => {
    return PHONG_TO_NHOM_MAPPING[phong] || 'CHƯA MAPPING';
};

export const getAllPhongNames = () => {
    return Object.keys(PHONG_TO_NHOM_MAPPING);
};

export const getAllNhomNames = () => {
    return [...new Set(Object.values(PHONG_TO_NHOM_MAPPING))];
};
