"""
ESUHAI ABC MODEL - Python Configuration
Cấu hình cho các scripts Python và data analysis
"""

import os
from dataclasses import dataclass
from typing import Dict, List, Optional

@dataclass
class FormConfig:
    url: str
    prefill_url: str
    entry_ids: Dict[str, str]

@dataclass
class ABCModelConfig:
    version: str = "2.0"
    total_employees: int = 420
    total_groups: int = 20
    implementation_timeline: int = 14
    
    # Trọng số đánh giá
    form_a_weight: float = 0.30
    form_b_weight: float = 0.40
    form_c_weight: float = 0.30
    
    # Ngưỡng chất lượng
    min_completion_rate: float = 0.95
    data_validation_threshold: float = 0.85
    cross_check_sample_size: int = 50

class EsuhaiABCConfig:
    """Cấu hình chính cho hệ thống ABC Model"""
    
    # Form A Configuration
    FORM_A = FormConfig(
        url="https://forms.gle/Y6fYUHbRcMP2jfHH7",
        prefill_url="https://docs.google.com/forms/d/e/1FAIpQLSfhk-cfvPrDlpRONfmdDo6L6w1N5UhdgAZecmYLmZNDcXw9HQ/viewform",
        entry_ids={
            "name": "1704172586",
            "code": "1184622690",
            "position": "1121817413", 
            "department": "1727774632",
            "email": "875025279"
        }
    )
    
    # Form B Configuration
    FORM_B = FormConfig(
        url="https://forms.gle/iMUPkrUWnxpdsJHu5",
        prefill_url="https://docs.google.com/forms/d/e/1FAIpQLSepXF4C3-dUrmoeBrW4e8v2re4DxsAyiboqc1yI-2VOvjVSiw/viewform",
        entry_ids={
            "name": "1519666825",
            "email": "570205598", 
            "code": "870287758",
            "gender": "2096138668",
            "dob": "1655662338",
            "location": "1894722077",
            "education": "712912742",
            "department": "1741978684"
        }
    )
    
    # ABC Model Configuration
    ABC_MODEL = ABCModelConfig()
    
    # Business Units Mapping
    BUSINESS_UNITS = {
        "MSA": "Marketing, Sales, Admission",
        "IDS": "Matching & Export Services",
        "ESUTECH": "Tư vấn Kỹ sư", 
        "ESUCARE": "Chăm sóc sức khỏe",
        "ESUWORKS": "Headhunting & Placement",
        "ALESU": "Sáng tạo & Hạ tầng Số",
        "JPC": "Truyền thông & Vận hành",
        "GATEAWARDS": "Tư vấn Du học"
    }
    
    # Departments Mapping
    DEPARTMENTS = {
        "BOD": "Ban Tổng Giám đốc",
        "TC": "Tài chính - Kế toán", 
        "NS": "Nhân sự",
        "IT": "Công nghệ thông tin",
        "HC": "Hành chính - Tổng vụ",
        "PC": "Pháp chế",
        "KZ": "Đào tạo Tiếng Nhật",
        "PS": "Đào tạo Kỹ năng"
    }
    
    # Data Processing Settings
    DATA_PROCESSING = {
        "batch_size": 50,
        "timeout": 300,  # seconds
        "retry_attempts": 3,
        "export_formats": ["PDF", "EXCEL", "JSON"],
        "dashboard_refresh_interval": 300  # seconds
    }
    
    # Security Settings
    SECURITY = {
        "data_encryption": True,
        "personal_data_anonymization": True, 
        "data_retention_period": "3_YEARS",
        "access_levels": {
            "admin": "FULL",
            "manager": "DEPARTMENT",
            "employee": "SELF_ONLY"
        }
    }
    
    @classmethod
    def generate_form_url(cls, form_type: str, user_data: Dict[str, str]) -> Optional[str]:
        """Generate prefilled form URL for user"""
        form_config = getattr(cls, f"FORM_{form_type.upper()}", None)
        if not form_config:
            return None
            
        url = f"{form_config.prefill_url}?usp=pp_url"
        
        for key, value in user_data.items():
            if key in form_config.entry_ids:
                entry_id = form_config.entry_ids[key]
                url += f"&entry.{entry_id}={value}"
                
        return url
    
    @classmethod 
    def validate_user_data(cls, user_data: Dict[str, str]) -> bool:
        """Validate required user data fields"""
        required_fields = ["name", "email", "code"]
        return all(
            field in user_data and user_data[field].strip()
            for field in required_fields
        )
    
    @classmethod
    def get_department_name(cls, dept_code: str) -> str:
        """Get full department name from code"""
        return cls.DEPARTMENTS.get(dept_code, dept_code)
    
    @classmethod
    def get_business_unit_name(cls, bu_code: str) -> str:
        """Get full business unit name from code"""
        return cls.BUSINESS_UNITS.get(bu_code, bu_code)

# For backward compatibility and easy imports
FORM_A_URL = EsuhaiABCConfig.FORM_A.url
FORM_B_URL = EsuhaiABCConfig.FORM_B.url
ABC_MODEL_VERSION = EsuhaiABCConfig.ABC_MODEL.version
TOTAL_EMPLOYEES = EsuhaiABCConfig.ABC_MODEL.total_employees

# Environment-specific settings
DEBUG = os.getenv("DEBUG", "False").lower() == "true"
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///abc_model.db")

if __name__ == "__main__":
    # Test configuration
    print("=== ESUHAI ABC MODEL CONFIGURATION TEST ===")
    print(f"Form A URL: {FORM_A_URL}")
    print(f"Form B URL: {FORM_B_URL}")
    print(f"ABC Model Version: {ABC_MODEL_VERSION}")
    print(f"Total Employees: {TOTAL_EMPLOYEES}")
    
    # Test URL generation
    test_user = {
        "name": "Nguyễn Văn Test",
        "email": "test@esuhai.com",
        "code": "T001"
    }
    
    form_a_url = EsuhaiABCConfig.generate_form_url("A", test_user)
    print(f"\nGenerated Form A URL: {form_a_url}")
    
    print("\n=== CONFIGURATION TEST COMPLETED ===")
