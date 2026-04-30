import os

def create_md_files(base_path, folder_structure):
    """
    지정된 구조에 따라 폴더와 마크다운 파일을 생성하는 함수입니다.
    
    :param base_path: 파일들을 생성할 최상위 디렉토리 경로
    :param folder_structure: 생성할 폴더와 파일, 내용이 담긴 딕셔너리
    """
    # 최상위 폴더 생성 (없을 경우)
    os.makedirs(base_path, exist_ok=True)

    for folder_name, files in folder_structure.items():
        # 각 폴더의 전체 경로 설정
        folder_path = os.path.join(base_path, folder_name)
        
        # 폴더 생성 (exist_ok=True는 폴더가 이미 있어도 에러를 발생시키지 않음)
        os.makedirs(folder_path, exist_ok=True)
        
        for file_name, content in files.items():
            # 확장자가 .md로 끝나지 않으면 자동으로 붙여줌
            if not file_name.endswith('.md'):
                file_name += '.md'
                
            file_path = os.path.join(folder_path, file_name)
            
            # 파일 쓰기 모드('w')로 열어서 내용 작성 (한글 깨짐 방지를 위해 utf-8 인코딩 사용)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
                
            print(f"✅ 생성 완료: {file_path}")

# --- 실행 부분 ---

# 생성하고 싶은 폴더와 파일 구조를 딕셔너리 형태로 정의합니다.
my_structure = {
    "백엔드_문서": {
        "API_명세서.md": "# API 명세서\n\n여기에 API 관련 내용을 작성하세요.",
        "데이터베이스_구조": "## DB 스키마\n\n테이블 구조를 설명합니다." # .md를 안 붙여도 코드가 알아서 처리합니다.
    },
    "프론트엔드_문서": {
        "컴포넌트_가이드.md": "# UI 컴포넌트\n\n공통 컴포넌트 사용법입니다.",
        "상태관리.md": "## Redux/Zustand 상태 관리\n\n상태 관리 흐름도입니다."
    },
    "기타": {
        "회의록_260430.md": "# 주간 회의록\n\n- 안건 1\n- 안건 2"
    }
}

# 현재 경로에 '내_프로젝트_문서'라는 최상위 폴더를 만들고 그 안에 구조대로 생성합니다.
create_md_files("./내_프로젝트_문서", my_structure)