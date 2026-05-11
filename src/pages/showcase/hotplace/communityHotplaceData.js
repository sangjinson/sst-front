// 핫플거리 게시글 더미 데이터
export const hotplacePosts = [
  {
    id: 16,
    title: "서울 야경 명소 발견!",
    author: "서울시민",
    place: "서울 남산타워",
    regDt: "2026-04-29",
    viewCnt: 312,
    wishCnt: 45,
    commentCnt: 8,
    hashtags: ["야경", "서울", "핫플"],
    img: "https://picsum.photos/seed/hotplace-16/720/920",
    description: "해가 진 뒤에 더 예뻐지는 전망 포인트예요. 산책 코스로도 좋았습니다.",
    size: "tall",
  },
  {
    id: 15,
    title: "제주도 숨은 카페",
    author: "여행가J",
    place: "제주 애월 카페거리",
    regDt: "2026-04-28",
    viewCnt: 521,
    wishCnt: 88,
    commentCnt: 14,
    hashtags: ["제주", "카페", "바다뷰"],
    img: "https://picsum.photos/seed/hotplace-15/720/640",
    description: "창가 자리에서 바다가 바로 보여서 사진 찍기 좋은 곳이에요.",
    size: "wide",
  },
  {
    id: 14,
    title: "강릉 바다 힐링 여행",
    author: "파도사랑",
    place: "강릉 안목해변",
    regDt: "2026-04-27",
    viewCnt: 198,
    wishCnt: 23,
    commentCnt: 5,
    hashtags: ["강릉", "바다", "힐링"],
    img: "https://picsum.photos/seed/hotplace-14/720/900",
    description: "사람이 많지 않은 시간대에 가면 바다 소리까지 온전히 즐길 수 있어요.",
    size: "tall",
  },
  {
    id: 13,
    title: "부산 밀면 맛집 인증",
    author: "미식가",
    place: "부산 서면",
    regDt: "2026-04-26",
    viewCnt: 742,
    wishCnt: 120,
    commentCnt: 21,
    hashtags: ["부산", "맛집", "밀면"],
    img: "https://picsum.photos/seed/hotplace-13/720/720",
    description: "웨이팅은 있었지만 한입 먹자마자 기다린 보람이 느껴졌습니다.",
    size: "square",
  },
  {
    id: 12,
    title: "전주 한옥마을 산책",
    author: "한옥러버",
    place: "전주 한옥마을",
    regDt: "2026-04-25",
    viewCnt: 355,
    wishCnt: 56,
    commentCnt: 9,
    hashtags: ["전주", "한옥마을", "산책"],
    img: "https://picsum.photos/seed/hotplace-12/720/860",
    description: "골목마다 분위기가 달라서 천천히 걸을수록 더 재밌는 코스예요.",
    size: "tall",
  },
  {
    id: 11,
    title: "속초 중앙시장 먹거리",
    author: "먹방러",
    place: "속초 중앙시장",
    regDt: "2026-04-24",
    viewCnt: 410,
    wishCnt: 77,
    commentCnt: 11,
    hashtags: ["속초", "시장", "먹거리"],
    img: "https://picsum.photos/seed/hotplace-11/720/620",
    description: "짧은 일정에도 들르기 좋은 시장 코스입니다. 간식 종류가 정말 많아요.",
    size: "wide",
  },
  {
    id: 10,
    title: "가을 단풍 구경",
    author: "단풍맨",
    place: "내장산 국립공원",
    regDt: "2026-04-23",
    viewCnt: 167,
    wishCnt: 34,
    commentCnt: 3,
    hashtags: ["단풍", "가을", "등산"],
    img: "https://picsum.photos/seed/hotplace-10/720/930",
    description: "오후 햇빛이 들어올 때 색감이 가장 좋았어요.",
    size: "tall",
  },
  {
    id: 9,
    title: "인천 월미도 나들이",
    author: "바다아이",
    place: "인천 월미도",
    regDt: "2026-04-22",
    viewCnt: 94,
    wishCnt: 12,
    commentCnt: 2,
    hashtags: ["인천", "월미도", "나들이"],
    img: "https://picsum.photos/seed/hotplace-9/720/720",
    description: "바다와 놀이기구를 한 번에 즐기기 좋은 당일치기 장소입니다.",
    size: "square",
  },
  {
    id: 8,
    title: "경기도 화성 1일차",
    author: "경기도 청년",
    place: "경기도 화성",
    regDt: "2026-04-21",
    viewCnt: 226,
    wishCnt: 30,
    commentCnt: 6,
    hashtags: ["경기도", "화성", "당일치기"],
    img: "https://picsum.photos/seed/hotplace-8/720/840",
    description: "생각보다 볼 곳이 많아서 하루 코스로 꽉 채워 다녀왔어요.",
    size: "tall",
  },
];

// localStorage에서 유저가 작성한 게시글 불러오기
export const getUserPosts = () => {
  try {
    return JSON.parse(localStorage.getItem('hotplacePosts') || '[]');
  } catch {
    return [];
  }
};

// localStorage에 유저 게시글 저장
export const saveUserPost = (post) => {
  const posts = getUserPosts();
  posts.unshift(post);
  localStorage.setItem('hotplacePosts', JSON.stringify(posts));
};

// localStorage에서 유저 게시글 삭제
export const deleteUserPost = (id) => {
  const posts = getUserPosts().filter(p => p.id !== id);
  localStorage.setItem('hotplacePosts', JSON.stringify(posts));
};

// 더미 + 유저 게시글 합쳐서 반환
export const getAllPosts = () => {
  return [...getUserPosts(), ...hotplacePosts];
};

// 댓글 더미 데이터
export const hotplaceComments = [
  { id: 1, user: "5스틴", text: "여기 분위기 진짜 좋아 보여요!", date: "2026.04.22" },
  { id: 2, user: "여행가 영조", text: "다음 여행 코스에 넣어야겠네요.", date: "2026.04.23" },
];

// 경기도 지역 목록
export const gyeonggiRegions = [
  "수원시", "용인시", "성남시", "부천시", "화성시", "안산시", "남양주시", "안양시", "평택시",
  "시흥시", "파주시", "의정부시", "김포시", "광명시", "광주시", "군포시", "이천시", "오산시",
  "하남시", "양주시", "구리시", "안성시", "포천시", "의왕시", "양평군", "여주시", "동두천시",
  "가평군", "과천시", "연천군",
];