// localStorage에서 유저가 작성한 인생거리 게시글 불러오기
export const getUserLifePosts = () => {
  try {
    return JSON.parse(localStorage.getItem('lifePosts') || '[]');
  } catch {
    return [];
  }
};

export const saveUserLifePost = (post) => {
  const posts = getUserLifePosts();
  posts.unshift(post);
  localStorage.setItem('lifePosts', JSON.stringify(posts));
};

export const deleteUserLifePost = (id) => {
  const posts = getUserLifePosts().filter(p => p.id !== id);
  localStorage.setItem('lifePosts', JSON.stringify(posts));
};

export const getAllLifePosts = () => {
  return [...getUserLifePosts(), ...lifePostsDummy];
};

// 더미 데이터
export const lifePostsDummy = [
  {
    id: 1,
    title: '수원 당일치기 완벽 코스 🏯',
    author: '경기도민',
    region: '수원시',
    regDt: '2026-04-28',
    viewCnt: 842,
    wishCnt: 134,
    commentCnt: 23,
    companion: '가족',
    themes: ['문화·역사', '맛집'],
    hashtags: ['수원', '화성', '당일치기', '역사여행'],
    thumbnail: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=800&q=80',
    description: `수원 화성은 조선 정조 때 만들어진 성곽으로, 유네스코 세계문화유산에 등재된 곳이에요.

저는 오전 일찍 출발해서 화성행궁부터 시작했어요. 입장료는 어른 기준 1,500원으로 정말 저렴한 편이에요.

행궁을 둘러보고 나서 수원천을 따라 걷다 보면 팔달문이 나와요. 성벽 위를 걸으면서 수원 시내를 내려다보는 경치가 정말 멋졌어요.

점심은 수원 통닭거리에서 유명한 통닭을 먹었는데, 줄이 길었지만 기다릴 만한 맛이었어요!

오후에는 연무대에서 국궁 체험도 하고, 화홍문에서 사진도 찍었어요. 해질 무렵 성곽 위에서 보는 노을이 정말 아름다웠어요.`,
    course: [
      {
        order: 1,
        name: '화성행궁',
        address: '경기도 수원시 팔달구 행궁로 11',
        type: 'see',
        image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=400&q=80',
        desc: '조선 정조가 세운 행궁, 유네스코 세계문화유산',
      },
      {
        order: 2,
        name: '수원 통닭거리',
        address: '경기도 수원시 팔달구 정조로',
        type: 'food',
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80',
        desc: '수원 명물 왕갈비와 통닭이 유명한 먹거리 거리',
      },
      {
        order: 3,
        name: '연무대 국궁체험장',
        address: '경기도 수원시 장안구 연무동',
        type: 'play',
        image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80',
        desc: '전통 활쏘기 체험이 가능한 국궁 체험장',
      },
      {
        order: 4,
        name: '화홍문',
        address: '경기도 수원시 장안구 수원천로',
        type: 'see',
        image: 'https://images.unsplash.com/photo-1590393275627-0c46bc8ea23c?w=400&q=80',
        desc: '수원화성의 북수문, 야경이 아름다운 명소',
      },
    ],
  },
  {
    id: 2,
    title: '가평 1박2일 힐링 여행 🌿',
    author: '힐링러버',
    region: '가평군',
    regDt: '2026-04-25',
    viewCnt: 621,
    wishCnt: 98,
    commentCnt: 15,
    companion: '커플',
    themes: ['힐링', '액티비티'],
    hashtags: ['가평', '남이섬', '1박2일', '힐링'],
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    description: `가평은 서울에서 차로 1시간 거리에 있어서 당일치기나 1박2일 여행지로 딱이에요.

첫째 날은 남이섬에서 시작했어요. 배를 타고 들어가는 것부터 설레는 경험이었어요. 섬 안에서 자전거도 빌려서 곳곳을 돌아다녔는데, 메타세쿼이아 길이 정말 예쁘더라고요.

점심은 섬 안에 있는 식당에서 먹고, 오후에는 쁘띠프랑스로 이동했어요. 프랑스 풍의 건물들이 독특하고 사진 찍기 좋은 곳이에요.

숙소는 북한강 뷰가 보이는 펜션을 잡았는데, 아침에 일어나서 보는 강 뷰가 힐링 그 자체였어요.

둘째 날은 아침 일찍 자라섬을 산책하고, 카페에서 커피 한 잔 마시고 여유롭게 돌아왔어요.`,
    course: [
      {
        order: 1,
        name: '남이섬',
        address: '경기도 가평군 가평읍 북한강변로 1024',
        type: 'see',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
        desc: '메타세쿼이아 길이 유명한 북한강의 아름다운 섬',
      },
      {
        order: 2,
        name: '쁘띠프랑스',
        address: '경기도 가평군 청평면 호반로 1063',
        type: 'play',
        image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80',
        desc: '프랑스 풍의 테마파크, 사진 명소',
      },
      {
        order: 3,
        name: '북한강 뷰 펜션',
        address: '경기도 가평군 청평면 북한강변로',
        type: 'sleep',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80',
        desc: '북한강이 보이는 힐링 펜션',
      },
      {
        order: 4,
        name: '자라섬',
        address: '경기도 가평군 가평읍 달전리',
        type: 'see',
        image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=80',
        desc: '재즈 페스티벌로 유명한 북한강의 섬',
      },
    ],
  },
  {
    id: 3,
    title: '파주 예술 기행 🎨',
    author: '예술여행자',
    region: '파주시',
    regDt: '2026-04-20',
    viewCnt: 445,
    wishCnt: 76,
    commentCnt: 11,
    companion: '친구',
    themes: ['문화·역사', '카페'],
    hashtags: ['파주', '헤이리', '출판도시', '예술'],
    thumbnail: 'https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=800&q=80',
    description: `파주는 예술과 문화가 살아숨쉬는 도시예요. 헤이리 예술마을과 파주 출판도시를 하루에 다 둘러볼 수 있어요.

헤이리 예술마을은 건물 하나하나가 작품이에요. 독특한 건축물들과 갤러리, 카페들이 어우러진 공간이라 그냥 걷기만 해도 즐거워요.

점심은 헤이리 안에 있는 감성 카페에서 브런치로 해결했어요. 인테리어가 너무 예뻐서 한참 머물렀어요.

오후에는 파주 출판도시로 이동했어요. 아시아출판문화정보센터에서 책도 보고, 지혜의 숲에서 엄청난 양의 책들 사이를 거닐었어요.

저녁은 임진각 근처에서 먹고, 평화 누리 공원을 산책하면서 하루를 마무리했어요.`,
    course: [
      {
        order: 1,
        name: '헤이리 예술마을',
        address: '경기도 파주시 탄현면 헤이리마을길',
        type: 'see',
        image: 'https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=400&q=80',
        desc: '예술가들이 모여 만든 복합 문화예술 공간',
      },
      {
        order: 2,
        name: '파주 출판도시 지혜의 숲',
        address: '경기도 파주시 문발로 184',
        type: 'see',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
        desc: '50만권의 책이 있는 거대한 도서관',
      },
      {
        order: 3,
        name: '헤이리 브런치 카페',
        address: '경기도 파주시 탄현면 헤이리마을길',
        type: 'food',
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80',
        desc: '헤이리 마을 안의 감성 브런치 카페',
      },
      {
        order: 4,
        name: '평화 누리 공원',
        address: '경기도 파주시 탄현면 필승로 408',
        type: 'play',
        image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=80',
        desc: '임진각 옆 평화를 주제로 한 대형 공원',
      },
    ],
  },
];

// 댓글 더미 데이터
export const lifeComments = [
  { id: 1, user: '여행러버', text: '저도 이 코스로 가보고 싶어요!', date: '2026.04.29' },
  { id: 2, user: '경기도민', text: '수원 화성 정말 좋죠! 저도 자주 가요.', date: '2026.04.28' },
];

// 타입별 색상/라벨
export const TYPE_LABEL = { see: '볼거리', food: '먹거리', sleep: '잘거리', play: '놀거리' };
export const TYPE_COLOR = {
  see:   'bg-blue-100 text-blue-700',
  food:  'bg-orange-100 text-orange-700',
  sleep: 'bg-green-100 text-green-700',
  play:  'bg-purple-100 text-purple-700',
};

// 동행 유형 이모지
export const COMPANION_EMOJI = {
  '1인': '🙋',
  '반려': '🐾',
  '커플': '💑',
  '가족': '👨‍👩‍👧',
  '친구': '👫',
};

// 경기도 지역 목록
export const gyeonggiRegions = [
  "수원시", "용인시", "성남시", "부천시", "화성시", "안산시", "남양주시", "안양시", "평택시",
  "시흥시", "파주시", "의정부시", "김포시", "광명시", "광주시", "군포시", "이천시", "오산시",
  "하남시", "양주시", "구리시", "안성시", "포천시", "의왕시", "양평군", "여주시", "동두천시",
  "가평군", "과천시", "연천군",
];
