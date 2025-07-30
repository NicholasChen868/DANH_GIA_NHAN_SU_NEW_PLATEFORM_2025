#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
📋 FORM B GENERATOR - MÔ HÌNH ABC ESUHAI GROUP
🎯 Auto generate toàn bộ câu hỏi Form B cho 420 nhân viên
✨ Created by: Claude AI Assistant
📅 Date: 30/07/2025
"""

import json
import csv
import pandas as pd
from datetime import datetime
import os

class FormBGenerator:
    def __init__(self):
        """Khởi tạo generator với cấu trúc 20 nhóm chuyên môn"""
        self.groups = {
            1: {"code": "BOD", "name": "Quản lý cao cấp (BOD, TGĐ)", "questions": 4},
            2: {"code": "TBU", "name": "Trưởng BU", "questions": 4}, 
            3: {"code": "TP", "name": "Trưởng phòng", "questions": 4},
            4: {"code": "TL", "name": "Team Leader/Supervisor", "questions": 4},
            5: {"code": "MSA", "name": "Marketing, Sales, Admission", "questions": 5},
            6: {"code": "IDS", "name": "Matching & Export Services", "questions": 4},
            7: {"code": "TC", "name": "Tài chính - Kế toán", "questions": 4},
            8: {"code": "NS", "name": "Nhân sự", "questions": 4},
            9: {"code": "IT", "name": "Công nghệ thông tin", "questions": 4},
            10: {"code": "HC", "name": "Hành chính - Tổng vụ", "questions": 4},
            11: {"code": "PC", "name": "Pháp chế", "questions": 4},
            12: {"code": "KZ", "name": "Kaizen Yoshida School", "questions": 4},
            13: {"code": "PS", "name": "ProSkills", "questions": 4},
            14: {"code": "EC", "name": "EsuCare", "questions": 4},
            15: {"code": "ET", "name": "EsuTech", "questions": 4},
            16: {"code": "KT", "name": "Koka-Team (Việt Nam)", "questions": 4},
            17: {"code": "EW", "name": "EsuWorks", "questions": 4},
            18: {"code": "AL", "name": "ALESU", "questions": 4},
            19: {"code": "JPC", "name": "JPC - Truyền thông & Vận hành", "questions": 5},
            20: {"code": "GA", "name": "GateAwards - Tư vấn Du học", "questions": 4}
        }
        
        self.output_folder = "output"
        self.ensure_output_folder()
        
    def ensure_output_folder(self):
        """Tạo folder output nếu chưa có"""
        if not os.path.exists(self.output_folder):
            os.makedirs(self.output_folder)
    
    def generate_section1_basic(self):
        """📋 SECTION 1: THÔNG TIN CƠ BẢN (13 câu)"""
        questions = [
            {
                "section": "1_basic",
                "question_id": "B1_01",
                "question_type": "short_text",
                "question": "Họ và tên",
                "required": True,
                "description": "Nhập họ tên đầy đủ của bạn"
            },
            {
                "section": "1_basic", 
                "question_id": "B1_02",
                "question_type": "short_text",
                "question": "Mã nhân viên",
                "required": True,
                "description": "Mã số nhân viên của bạn tại Esuhai"
            },
            {
                "section": "1_basic",
                "question_id": "B1_03", 
                "question_type": "multiple_choice",
                "question": "Giới tính",
                "required": True,
                "options": ["Nam", "Nữ", "Khác"]
            },
            {
                "section": "1_basic",
                "question_id": "B1_04",
                "question_type": "date",
                "question": "Ngày sinh",
                "required": True,
                "description": "Định dạng: DD/MM/YYYY"
            },
            {
                "section": "1_basic",
                "question_id": "B1_05",
                "question_type": "short_text",
                "question": "Quê quán",
                "required": False,
                "description": "Tỉnh/thành phố quê quán"
            },
            {
                "section": "1_basic",
                "question_id": "B1_06",
                "question_type": "multiple_choice",
                "question": "Trình độ học vấn cao nhất",
                "required": True,
                "options": ["Trung học", "Trung cấp/Cao đẳng", "Đại học", "Thạc sĩ", "Tiến sĩ", "Khác"]
            },
            {
                "section": "1_basic",
                "question_id": "B1_07",
                "question_type": "short_text", 
                "question": "Chuyên ngành đã học",
                "required": True,
                "description": "Ví dụ: Kinh tế đối ngoại, Công nghệ thông tin..."
            },
            {
                "section": "1_basic",
                "question_id": "B1_08",
                "question_type": "multiple_choice",
                "question": "Vị trí hiện tại tại Esuhai",
                "required": True,
                "options": [f"{group['code']} - {group['name']}" for group in self.groups.values()]
            },
            {
                "section": "1_basic",
                "question_id": "B1_09",
                "question_type": "date",
                "question": "Ngày bắt đầu làm việc tại Esuhai",
                "required": True,
                "description": "Định dạng: DD/MM/YYYY"
            },
            {
                "section": "1_basic",
                "question_id": "B1_10",
                "question_type": "linear_scale",
                "question": "Tiếng Anh - Khả năng giao tiếp tổng thể",
                "required": True,
                "scale_min": 1,
                "scale_max": 10,
                "description": "1 = Không biết, 10 = Thành thạo như người bản xứ"
            },
            {
                "section": "1_basic",
                "question_id": "B1_11", 
                "question_type": "linear_scale",
                "question": "Tiếng Nhật - Khả năng giao tiếp tổng thể",
                "required": True,
                "scale_min": 1,
                "scale_max": 10,
                "description": "1 = Không biết, 10 = Thành thạo như người bản xứ"
            },
            {
                "section": "1_basic",
                "question_id": "B1_12",
                "question_type": "multiple_choice",
                "question": "Chứng chỉ ngoại ngữ cao nhất",
                "required": False,
                "options": ["Không có", "TOEIC", "IELTS", "TOEFL", "JLPT", "NAT-TEST", "Khác"]
            },
            {
                "section": "1_basic",
                "question_id": "B1_13",
                "question_type": "short_text",
                "question": "Điểm số chứng chỉ (nếu có)",
                "required": False,
                "description": "Ví dụ: TOEIC 750, IELTS 6.5, JLPT N3..."
            }
        ]
        return questions
    
    def generate_section2_core_skills(self):
        """⚡ SECTION 2: KỸ NĂNG CỐT LÕI (10 câu) - Áp dụng cho tất cả"""
        skills = [
            {
                "skill": "Microsoft Office (Word, Excel, PowerPoint)",
                "description": "Mức độ thành thạo sử dụng bộ MS Office"
            },
            {
                "skill": "Giao tiếp và Thuyết trình",
                "description": "Khả năng trình bày ý kiến, thuyết phục người khác"
            },
            {
                "skill": "Làm việc nhóm",
                "description": "Khả năng phối hợp, hỗ trợ đồng nghiệp hiệu quả"
            },
            {
                "skill": "Quản lý thời gian",
                "description": "Khả năng ưu tiên công việc, đáp ứng deadline"
            },
            {
                "skill": "Giải quyết vấn đề",
                "description": "Tư duy phân tích, tìm giải pháp cho tình huống khó"
            },
            {
                "skill": "Học hỏi và Thích ứng",
                "description": "Khả năng tiếp thu kiến thức mới, thích ứng thay đổi"
            },
            {
                "skill": "Chăm sóc khách hàng",
                "description": "Kỹ năng tư vấn, hỗ trợ, tạo sự hài lòng cho khách"
            },
            {
                "skill": "Tư duy sáng tạo",
                "description": "Khả năng đưa ra ý tưởng mới, cách làm khác biệt"
            },
            {
                "skill": "Xử lý áp lực",
                "description": "Khả năng làm việc hiệu quả trong môi trường căng thẳng"
            },
            {
                "skill": "Trách nhiệm và Cam kết",
                "description": "Mức độ hoàn thành công việc đúng hạn, chất lượng"
            }
        ]
        
        questions = []
        for i, skill in enumerate(skills, 1):
            # Câu hỏi đánh giá mức độ
            questions.append({
                "section": "2_core",
                "question_id": f"B2_{i:02d}a",
                "question_type": "linear_scale",
                "question": f"Kỹ năng: {skill['skill']}",
                "required": True,
                "scale_min": 1,
                "scale_max": 10,
                "description": f"{skill['description']} (1 = Rất yếu, 10 = Xuất sắc)"
            })
            
            # Câu hỏi ví dụ minh chứng
            questions.append({
                "section": "2_core",
                "question_id": f"B2_{i:02d}b",
                "question_type": "paragraph",
                "question": f"Ví dụ minh chứng cho kỹ năng '{skill['skill']}'",
                "required": True,
                "description": "Nêu 1 ví dụ cụ thể trong công việc thể hiện kỹ năng này (50-100 từ)"
            })
        
        return questions
    
    def generate_all_questions(self):
        """Tạo toàn bộ câu hỏi Form B"""
        print("🚀 Bắt đầu generate Form B...")
        
        all_questions = []
        
        # Section 1: Basic Info
        print("📋 Generating Section 1: Basic Info...")
        section1 = self.generate_section1_basic()
        all_questions.extend(section1)
        
        # Section 2: Core Skills
        print("⚡ Generating Section 2: Core Skills...")
        section2 = self.generate_section2_core_skills()
        all_questions.extend(section2)
        
        return {
            "metadata": {
                "generated_at": datetime.now().isoformat(),
                "total_groups": len(self.groups),
                "sections": {
                    "basic_info": len(section1),
                    "core_skills": len(section2)
                }
            },
            "basic_questions": section1,
            "core_questions": section2
        }
    
    def export_to_csv(self, questions_data):
        """Export ra CSV để import vào Google Form"""
        print("📊 Exporting to CSV...")
        
        csv_rows = []
        
        # Header
        csv_rows.append([
            "Section", "Question_ID", "Question_Type", "Question_Text", 
            "Required", "Options", "Scale_Min", "Scale_Max", "Description"
        ])
        
        # Section 1: Basic
        for q in questions_data["basic_questions"]:
            options = "|".join(q.get("options", [])) if q.get("options") else ""
            csv_rows.append([
                q["section"],
                q["question_id"], 
                q["question_type"],
                q["question"],
                "Yes" if q["required"] else "No",
                options,
                q.get("scale_min", ""),
                q.get("scale_max", ""),
                q.get("description", "")
            ])
        
        # Section 2: Core Skills  
        for q in questions_data["core_questions"]:
            csv_rows.append([
                q["section"],
                q["question_id"],
                q["question_type"], 
                q["question"],
                "Yes" if q["required"] else "No",
                "",
                q.get("scale_min", ""),
                q.get("scale_max", ""),
                q.get("description", "")
            ])
        
        # Write to CSV
        csv_file = os.path.join(self.output_folder, "form_b_questions.csv")
        with open(csv_file, 'w', newline='', encoding='utf-8-sig') as f:
            writer = csv.writer(f)
            writer.writerows(csv_rows)
        
        print(f"✅ CSV exported to: {csv_file}")
        return csv_file
    
    def export_to_json(self, questions_data):
        """Export ra JSON để backup"""
        json_file = os.path.join(self.output_folder, "form_b_structure.json")
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(questions_data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ JSON backup saved to: {json_file}")
        return json_file
    
    def generate_summary_report(self, questions_data):
        """Tạo báo cáo tổng kết"""
        total_basic = len(questions_data["basic_questions"])
        total_core = len(questions_data["core_questions"])
        
        report = f"""
📊 BÁO CÁO TỔNG KẾT FORM B GENERATOR

🎯 TỔNG QUAN:
- Ngày tạo: {datetime.now().strftime('%d/%m/%Y %H:%M')}
- Tổng số nhóm chuyên môn: {len(self.groups)}
- Tổng số câu hỏi cơ bản: {total_basic}
- Tổng số câu hỏi kỹ năng cốt lõi: {total_core}

📋 CHI TIẾT:
- Section 1 - Thông tin cơ bản: {total_basic} câu
- Section 2 - Kỹ năng cốt lõi: {total_core} câu

💯 THỐNG KÊ TỔNG THỂ:
- Tổng câu hỏi: {total_basic + total_core}
- Thời gian dự kiến: 2-3 giờ/người
- Dữ liệu thu được: ~{total_basic + total_core} điểm/người

🚀 STATUS: READY FOR DEPLOYMENT!
"""
        
        report_file = os.path.join(self.output_folder, "generation_summary.txt")
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(report)
            
        print(f"📊 Summary report saved to: {report_file}")
        print("\n" + "="*50)
        print(report)
        print("="*50)
        
        return report_file

def main():
    """Main function để chạy generator"""
    print("🎉 FORM B GENERATOR - MÔ HÌNH ABC ESUHAI GROUP")
    print("="*60)
    
    # Khởi tạo generator
    generator = FormBGenerator()
    
    # Generate tất cả câu hỏi
    questions_data = generator.generate_all_questions()
    
    # Export files
    print("\n📁 Exporting files...")
    csv_file = generator.export_to_csv(questions_data)
    json_file = generator.export_to_json(questions_data)
    summary_file = generator.generate_summary_report(questions_data)
    
    print(f"\n🎉 HOÀN THÀNH! Files được tạo:")
    print(f"  📊 CSV for Google Form: {csv_file}")
    print(f"  💾 JSON backup: {json_file}")  
    print(f"  📊 Summary report: {summary_file}")
    print(f"\n🚀 Sẵn sàng triển khai cho 420 nhân viên!")

if __name__ == "__main__":
    main()
