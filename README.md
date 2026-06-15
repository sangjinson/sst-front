# 경기도 스마트 여행 플래너 — Frontend

> **팀명**: 머지크루  
> **팀원**: 김영훈, 김지태, 노송현, 소제우, 손상진, 한상인  
> **배포도메인**: https://sstour.cloud/

경기도 내 여행지 정보를 제공하고, AI가 동선 최적화된 여행 일정을 자동으로 생성해주는 웹 서비스의 **React 프론트엔드** 레포지토리입니다.

---

## 목차

- [프로젝트 소개](#프로젝트-소개)
- [기술 스택](#기술-스택)
- [화면 구성](#화면-구성)
- [주요 기능](#주요-기능)
- [프로젝트 구조](#프로젝트-구조)

---

## 프로젝트 소개

**경기도 스마트 여행 플래너**는 경기도 내 볼거리·먹거리·놀거리·잘거리 정보를 제공하며, 사용자가 지역·기간·테마를 선택하면 **GPT-4o 기반 AI가 동선 최적화된 여행 일정을 자동 생성**해주는 플랫폼입니다.

| 구분 | 내용 |
|------|------|
| 프로젝트명 | 경기도 스마트 여행 플래너 서비스 클라우드 배포 프로젝트 |
| 개발 기간 | 2025.12.29 ~ 2026.06.23 |
| 지원 브라우저 | Chrome / Edge / Safari / Firefox |

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| Language | JavaScript |
| Framework | React |
| 스타일링 | Tailwind CSS |
| 서버 상태 관리 | React Query |
| 지도 | Kakao Maps API |
| 소셜 로그인 | Kakao OAuth |

---

## 화면 구성

| 분류 | 폴더 경로 | 파일명 | URL |
|------|----------|--------|-----|
| 인증 | `src/pages/auth` | `LoginPage.jsx` | `/login` |
| 인증 | `src/pages/auth` | `SignupPage.jsx` | `/login/signup` |
| 인증 | `src/pages/auth` | `OAuthRedirectHandler.jsx` | `/oauth/redirect` |
| 인증 | `src/pages/auth` | `FindEmailPage.jsx` | `/find-email` |
| 인증 | `src/pages/auth` | `ResetPasswordPage.jsx` | `/reset-password` |
| 랜딩 | `src/pages/landing` | `LandingPage.jsx` | `/` |
| 메인 | `src/pages/main` | `MainPage.jsx` | `/:region` |
| 여행지 목록 | `src/pages/area` | `AreaListTemplate.jsx` | `/:region/:type/list` |
| 여행지 상세 | `src/pages/area` | `AreaViewTemplate.jsx` | `/:region/:type/view` |
| 핫플거리 목록 | `src/pages/showcase/hotplace` | `CommunityHotplace.jsx` | `/showcase/hotplace` |
| 핫플거리 상세 | `src/pages/showcase/hotplace` | `CommunityHotplaceDetail.jsx` | `/showcase/hotplace/view/:id` |
| 핫플거리 작성 | `src/pages/showcase/hotplace` | `CommunityHotplaceWrite.jsx` | `/showcase/hotplace/write` |
| 핫플거리 수정 | `src/pages/showcase/hotplace` | `CommunityHotplaceWrite.jsx` | `/showcase/hotplace/write/:id` |
| 인생거리 목록 | `src/pages/showcase/life` | `CommunityLife.jsx` | `/showcase/life` |
| 인생거리 상세 | `src/pages/showcase/life` | `CommunityLifeDetail.jsx` | `/showcase/life/view/:id` |
| 인생거리 작성 | `src/pages/showcase/life` | `CommunityLifeWrite.jsx` | `/showcase/life/write` |
| 인생거리 수정 | `src/pages/showcase/life` | `CommunityLifeWrite.jsx` | `/showcase/life/write/:id` |
| AI 일정 선택 | `src/pages/aiplan` | `AIPlanPage.jsx` | `/plan` |
| AI 일정 결과 | `src/pages/aiplan` | `AIPlanResultPage.jsx` | `/plan/result` |
| 마이페이지 | `src/pages/user` | `MyPage.jsx` | `/user/mypage` |
| 공지사항 | `src/pages/customersupport` | `Notice.jsx` | `/customersupport/notice` |
| FAQ | `src/pages/customersupport` | `Faq.jsx` | `/customersupport/faq` |
| 검색 | `src/pages/search` | `SearchPage.jsx` | `/search/:keyword` |
| 관리자 대시보드 | `src/pages/admin` | `Dashboard.jsx` | `/admin` |
| 관리자 회원 목록 | `src/pages/admin` | `AdminMemberList.jsx` | `/admin/members` |
| 관리자 회원 등록 | `src/pages/admin` | `AdminMemberInfoForm.jsx` | `/admin/members/create` |
| 관리자 회원 수정 | `src/pages/admin` | `AdminMemberEdit.jsx` | `/admin/members/edit/:id` |
| 관리자 관리자 목록 | `src/pages/admin` | `AdminManagerList.jsx` | `/admin/managers` |
| 관리자 관리자 등록 | `src/pages/admin` | `AdminManagerCreate.jsx` | `/admin/managers/create` |
| 관리자 장소 목록 | `src/pages/admin` | `AdminStreetListPage.jsx` | `/admin/area/:type` |
| 관리자 볼거리 수정 | `src/pages/admin` | `AdminSeeModify.jsx` | `/admin/area/see/:plcNo` |
| 관리자 먹거리 수정 | `src/pages/admin` | `AdminFoodModify.jsx` | `/admin/area/food/:plcNo` |
| 관리자 놀거리 수정 | `src/pages/admin` | `AdminPlayModify.jsx` | `/admin/area/play/:plcNo` |
| 관리자 잘거리 수정 | `src/pages/admin` | `AdminSleepModify.jsx` | `/admin/area/sleep/:plcNo` |
| 관리자 뽐낼거리 목록 | `src/pages/admin` | `AdminShowcaseList.jsx` | `/admin/showcase/:type` |
| 관리자 댓글 목록 | `src/pages/admin` | `AdminReplyList.jsx` | `/admin/:type` |
| 관리자 신고 관리 | `src/pages/admin` | `AdminReport.jsx` | `/admin/report` |
| 관리자 고객지원 | `src/pages/admin` | `AdminSupportManage.jsx` | `/admin/support/:type` |
| 관리자 공통코드 | `src/pages/admin` | `CommonCodeList.jsx` | `/admin/common-codes` |
| 404 | `src/pages/error` | `NotFoundPage.jsx` | `*` |
| 권한 없음 | `src/pages/error` | `Unauthorized.jsx` | `/unauthorized` |

---

## 주요 기능

### 계정 관리
- 이메일 + 비밀번호 로그인 / 카카오 소셜 로그인 (OAuth)
- Refresh Token 기반 자동 로그인 유지
- 이메일·닉네임 중복 확인
- 이메일 찾기 / 비밀번호 재설정

### 랜딩 & 메인 페이지
- 경기도 지역 키워드 검색 → `/search/{keyword}?region=RGN_NAME`
- 지역별 배너 이미지 슬라이더
- 볼거리·먹거리·놀거리·잘거리 카테고리 카드 리스트
- 현재 선택 지역 전역 상태 기반 네비게이션 동적 URL 바인딩

### 여행지 (볼거리·먹거리·놀거리·잘거리)
- 카테고리 필터 + 최신순·인기순 정렬
- 카드형 리스트 레이아웃
- 장소 상세: 이미지 슬라이더, 카카오 지도, 이용정보
- 리뷰 & 평점 등록·수정·삭제
- 찜하기 토글 (비회원 시 로그인 안내)
- 신고 기능

### AI 여행 일정 (내거리)
3단계 UI로 여행 조건 입력 후 GPT-4o 기반 일정 자동 생성

| 단계 | 내용 |
|------|------|
| Step 1 | 경기 남부·북부 탭 → 시·군 선택 |
| Step 2 | 당일·1박2일·2박3일 선택 + 날짜 직접 입력 |
| Step 3 | 테마 최대 3개 선택 (축제/행사·체험·식도락·역사·레저·테마파크) |
| 결과 | 일차별 타임라인 + 카카오 지도 마커 시각화 |

- 일정 저장 / 수정 / 날짜 수정 / 복사
- 드래그앤드롭으로 장소 순서 변경
- 일정 Soft Delete
- 일정 PDF 저장·인쇄

### 뽐낼거리 (커뮤니티)
- **핫플거리**: 방문 장소 사진 후기 (대표 이미지 필수)
- **인생거리**: 저장된 AI 일정 연계 여행 코스 공유
- 인기 해시태그 TOP 5 / 최신·인기순 정렬
- 좋아요 토글 / 댓글 CRUD / 신고

### 마이페이지
- 회원 정보 수정 / 프로필·배경 이미지 업로드
- 비밀번호 변경 (LOCAL 회원 전용)
- 회원 탈퇴
- 내 찜 목록 / 저장 AI 일정 / 작성 게시글 관리

### 관리자
- 통계 대시보드
- 회원·장소·게시글·댓글·리뷰·신고 관리
- 공지사항·FAQ 등록·수정·삭제
- 공통코드 CRUD

---

## 프로젝트 구조

```
src/
├── App.css                 # 전역 스타일시트
├── App.jsx                 # 라우터 엔트리 컴포넌트
├── index.css               # 테일윈드 및 전역 기본 스타일 정의
├── main.jsx                # React DOM 렌더링 엔트리
├── api/                    # 백엔드 서버와의 API 연결 계층
│   ├── adminCommentApi.js
│   ├── adminCommunityApi.js
│   ├── adminReviewApi.js
│   ├── aiAxios.js          # AI 전용 Axios 인스턴스
│   ├── authApi.js          # 인증 관련 API 서비스
│   ├── axios.js            # 기본 Axios 인스턴스 설정
│   └── reviewApi.js
├── assets/                 # 정적 리소스 파일
│   ├── hero.png, react.svg, vite.svg
│   ├── css/                # 스타일 리소스 (admin.css, attraction.css 등)
│   ├── fonts/              # 서비스 서체 (Paperlogy 폰트군 패키지 수록)
│   └── images/             # 로컬 이미지 리소스
├── components/             # 프레젠테이션 및 도메인 컴포넌트
│   ├── admin/              # 관리자 전용 공통 UI 컴포넌트
│   ├── card/               # 메인 페이지 및 리스트 카드군 컴포넌트
│   ├── common/             # 전역 공통 레이아웃/UI 컴포넌트
│   ├── Icon/               # 아이콘 컴포넌트 및 원본 SVG 자원
│   ├── modules/            # 도메인별 비즈니스 컴포넌트 그룹
│   │   ├── ActionButtons.jsx
│   │   ├── AreaActionButtons.jsx
│   │   ├── StarRating.jsx
│   │   ├── aiplan/         # AI 여행 코스 수립 단계 컴포넌트군
│   │   ├── airesult/       # AI 여행 계획 결과 화면 컴포넌트군
│   │   ├── anim/           # 인터랙티브 모션 컴포넌트 (EyesFollow)
│   │   ├── area/           # 관광지 정보(리스트/상세/필터) 컴포넌트군
│   │   ├── community/      # 핫플/인생거리 글 작성 및 피드 컴포넌트군
│   │   ├── customersupport/# 고객지원 전용 컴포넌트
│   │   ├── form/           # 폼 입력 컴포넌트 (ReqTextInput 등)
│   │   ├── GridCard/       # 그리드 레이아웃 카드 모듈
│   │   └── member/         # 프로필/커버 이미지 관리
│   ├── mypage/             # 마이페이지 기능별 탭 컴포넌트군
│   └── skeleton/           # 로딩용 스켈레톤 컴포넌트군
├── context/                # 전역 상태 관리 Context API
│   ├── AdminThemeContext.jsx # 관리자 테마 제어
│   ├── ConfigContext.jsx   # 서비스 전반의 시스템 설정값 공유
│   ├── SidebarContext.jsx  # 사이드바 상태 제어
│   └── ThemeContext.jsx    # 다크/라이트 모드 테마 제어
├── hooks/                  # 커스텀 훅 레이어
│   ├── useApi.js           # API 핸들링 공통 훅
│   ├── useAuth.js          # 로그인/인증 정보 접근 및 제어 훅
│   ├── useConfig.js        # 설정 관리 훅
│   ├── usePagination.js    # 공통 페이지네이션 훅
│   └── useWishlist.js      # 찜 목록 관리 훅
├── layouts/                # 레이아웃 템플릿
│   ├── AdminLayout.jsx     # 관리자 페이지 프레임 레이아웃
│   ├── AppHeader.jsx       # 사이드바를 관리하는 공통 상단 영역
│   ├── AppSidebar.jsx      # 네비게이션 서랍식 사이드바
│   ├── LandingLayout.jsx   # 첫 진입 랜딩용 레이아웃
│   ├── UserLayout.jsx      # 일반 사용자 페이지 프레임 레이아웃
│   └── user/               # 사용자 전용 헤더/푸터 컴포넌트
├── pages/                  # 라우팅 경로별 메인 페이지 뷰
│   ├── admin/              # 관리자 전용 관리 페이지 (회원, 댓글, 신고 등)
│   ├── aiplan/             # AI 일정 계획 및 결과 페이지
│   ├── area/               # 맛집/볼거리/숙소/놀거리 리스트 및 뷰
│   ├── auth/               # 로그인, 회원가입, OAuth 연동 처리 페이지
│   ├── customersupport/    # FAQ 및 공지사항 목록
│   ├── error/              # 에러 상황별 페이지 (ErrorScene, ServerError 등)
│   ├── landing/            # 랜딩 페이지
│   ├── main/               # 메인 페이지 (MainPage.jsx)
│   ├── search/             # 전역 검색 결과 페이지
│   ├── showcase/           # 사용자 추천 핫플/인생 코스 피드
│   └── user/               # 마이페이지 컨테이너
├── routes/                 # 라우팅 인프라
│   ├── AppRoutes.jsx       # 전역 페이지 라우팅 맵핑 정의
│   └── ProtectedRoute.jsx  # 권한(USER/ADMIN) 여부 검증 및 리다이렉트
└── utils/                  # 헬퍼 및 무상태 유틸리티 함수
    ├── axiosInstance.js
    ├── canvasUtils.js
    ├── common.js
    └── regionMap.js
```

---

> **관련 레포지토리**
> - [FastAPI (AI)](https://github.com/mojitt/sst-fastApi)
> - [Backend (Spring)](https://github.com/mojitt/sst-back)
