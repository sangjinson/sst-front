const seeData = {
  수원: [
    {
      id: 1,
      title: '수원 화성',
      tag: '지역명소',
      hashtags: ['유네스코', '성곽', '야경'],
      likes: 120,
      date: '2024-05-01',
      image: 'https://picsum.photos/id/1011/800/600',
      desc: '조선 정조가 축성한 세계문화유산',
      location: '수원시 팔달구'
    },
    {
      id: 2,
      title: '화성행궁',
      tag: '지역명소',
      hashtags: ['궁궐', '전통', '체험'],
      likes: 98,
      date: '2024-05-03',
      image: 'https://picsum.photos/id/1015/800/600',
      desc: '정조가 머물던 임시 궁궐',
      location: '수원시 팔달구'
    },
    {
      id: 3,
      title: '광교호수공원',
      tag: '공원',
      hashtags: ['산책', '데이트', '야경'],
      likes: 200,
      date: '2024-05-02',
      image: 'https://picsum.photos/id/1016/800/600',
      desc: '도심 속 힐링 호수 공원',
      location: '수원시 영통구'
    },
    {
      id: 4,
      title: '만석공원',
      tag: '공원',
      hashtags: ['피크닉', '산책', '자연'],
      likes: 150,
      date: '2024-04-29',
      image: 'https://picsum.photos/id/1020/800/600',
      desc: '조용한 힐링 공원',
      location: '수원시 장안구'
    },
    {
      id: 5,
      title: '서호공원',
      tag: '공원',
      hashtags: ['노을', '산책', '사진'],
      likes: 80,
      date: '2024-04-25',
      image: 'https://picsum.photos/id/1024/800/600',
      desc: '노을이 아름다운 호수 공원',
      location: '수원시 권선구'
    },
    {
      id: 6,
      title: '수원박물관',
      tag: '박물관',
      hashtags: ['역사', '전시', '문화'],
      likes: 60,
      date: '2024-05-04',
      image: 'https://picsum.photos/id/1027/800/600',
      desc: '수원의 역사와 문화를 한눈에',
      location: '수원시 영통구'
    },
    {
      id: 7,
      title: '삼성이노베이션뮤지엄',
      tag: '박물관',
      hashtags: ['기술', '전시', '체험'],
      likes: 170,
      date: '2024-05-06',
      image: 'https://picsum.photos/id/1031/800/600',
      desc: '삼성의 기술 발전을 볼 수 있는 공간',
      location: '수원시 영통구'
    },
    {
      id: 8,
      title: '슬기샘도서관',
      tag: '도서관',
      hashtags: ['공부', '열람실', '조용'],
      likes: 30,
      date: '2024-05-01',
      image: 'https://picsum.photos/id/1035/800/600',
      desc: '조용하게 공부하기 좋은 도서관',
      location: '수원시 장안구'
    },
    {
      id: 9,
      title: '광교중앙도서관',
      tag: '도서관',
      hashtags: ['열람실', '뷰맛집', '공부'],
      likes: 55,
      date: '2024-05-02',
      image: 'https://picsum.photos/id/1039/800/600',
      desc: '뷰가 좋은 현대식 도서관',
      location: '수원시 영통구'
    },
    {
      id: 10,
      title: '행리단길',
      tag: '지역명소',
      hashtags: ['카페', '데이트', '맛집'],
      likes: 220,
      date: '2024-05-07',
      image: 'https://picsum.photos/id/1043/800/600',
      desc: '감성 카페와 맛집 거리',
      location: '수원시 팔달구'
    },
    {
      id: 11,
      title: '팔달산',
      tag: '지역명소',
      hashtags: ['등산', '전망', '산책'],
      likes: 140,
      date: '2024-05-03',
      image: 'https://picsum.photos/id/1050/800/600',
      desc: '수원을 한눈에 볼 수 있는 명산',
      location: '수원시 팔달구'
    },
    {
      id: 12,
      title: '효원공원',
      tag: '공원',
      hashtags: ['중국정원', '산책', '힐링'],
      likes: 95,
      date: '2024-05-02',
      image: 'https://picsum.photos/id/1060/800/600',
      desc: '중국식 정원이 있는 공원',
      location: '수원시 팔달구'
    }
  ]
};

const DEFAULT_REVIEWS = [
  { user: '문화산책러', rating: 5, comment: '가볍게 둘러보기 좋았어요.' },
  { user: '주말여행자', rating: 4, comment: '사진 찍기 좋고 접근성도 괜찮았습니다.' },
  { user: '동네탐험가', rating: 4, comment: '근처에 들른다면 추천하고 싶은 장소예요.' },
];

const REGION_COORDS = {
  수원시: { lat: 37.2636, lng: 127.0286 },
};

const normalizeRegionKey = (region = '수원') => region.replace(/[시군]$/, '') || '수원';

const toRegionLabel = (region = '수원') => {
  const key = normalizeRegionKey(region);
  return /[시군]$/.test(region) ? region : `${key}시`;
};

const getDefaultCoords = (region, index = 0) => {
  const base = REGION_COORDS[toRegionLabel(region)] || REGION_COORDS.수원시;
  return {
    lat: Number((base.lat + index * 0.003).toFixed(4)),
    lng: Number((base.lng + index * 0.003).toFixed(4)),
  };
};

const normalizeSeeItem = (item, region, index = 0) => {
  const regionLabel = toRegionLabel(region);
  const coords = getDefaultCoords(regionLabel, index);

  return {
    ...item,
    name: item.name || item.title,
    category: item.category || item.tag,
    region: item.region || regionLabel,
    rating: item.rating ?? 0,
    reviewCount: item.reviewCount ?? item.likes ?? 0,
    price: item.price || '현장 확인',
    address: item.address || item.location || regionLabel,
    phone: item.phone || '031-290-3600',
    hours: item.hours || '09:00 - 18:00',
    description: item.description || item.desc,
    tags: item.tags || item.hashtags || [],
    lat: item.lat ?? coords.lat,
    lng: item.lng ?? coords.lng,
    reviews: item.reviews || DEFAULT_REVIEWS,
  };
};

const defaultSeeTemplates = [
  {
    title: '역사문화관',
    tag: '박물관',
    hashtags: ['역사', '전시', '문화'],
    likes: 84,
    date: '2024-05-08',
    image: 'https://picsum.photos/id/1027/800/600',
    desc: '지역의 역사와 문화를 한눈에 볼 수 있는 전시 공간'
  },
  {
    title: '중앙도서관',
    tag: '도서관',
    hashtags: ['열람실', '공부', '조용'],
    likes: 67,
    date: '2024-05-07',
    image: 'https://picsum.photos/id/1035/800/600',
    desc: '책과 휴식을 함께 즐길 수 있는 지역 대표 도서관'
  },
  {
    title: '시민공원',
    tag: '공원',
    hashtags: ['산책', '피크닉', '힐링'],
    likes: 142,
    date: '2024-05-06',
    image: 'https://picsum.photos/id/1016/800/600',
    desc: '가볍게 산책하고 쉬어가기 좋은 도심 속 공원'
  },
  {
    title: '대표 명소거리',
    tag: '지역명소',
    hashtags: ['카페', '사진', '데이트'],
    likes: 175,
    date: '2024-05-05',
    image: 'https://picsum.photos/id/1043/800/600',
    desc: '지역 분위기를 느낄 수 있는 감성 거리'
  },
  {
    title: '생태공원',
    tag: '공원',
    hashtags: ['자연', '산책', '가족'],
    likes: 121,
    date: '2024-05-04',
    image: 'https://picsum.photos/id/1020/800/600',
    desc: '자연과 함께 여유로운 시간을 보내기 좋은 공원'
  },
  {
    title: '미술전시관',
    tag: '박물관',
    hashtags: ['예술', '전시', '실내'],
    likes: 93,
    date: '2024-05-03',
    image: 'https://picsum.photos/id/1031/800/600',
    desc: '다양한 전시와 작품을 만날 수 있는 문화 공간'
  },
  {
    title: '문화광장',
    tag: '지역명소',
    hashtags: ['공연', '축제', '야경'],
    likes: 156,
    date: '2024-05-02',
    image: 'https://picsum.photos/id/1011/800/600',
    desc: '행사와 야경을 함께 즐길 수 있는 열린 공간'
  },
  {
    title: '어린이도서관',
    tag: '도서관',
    hashtags: ['어린이', '독서', '체험'],
    likes: 58,
    date: '2024-05-01',
    image: 'https://picsum.photos/id/1039/800/600',
    desc: '아이와 함께 방문하기 좋은 아늑한 도서관'
  },
  {
    title: '전망공원',
    tag: '공원',
    hashtags: ['전망', '노을', '사진'],
    likes: 132,
    date: '2024-04-30',
    image: 'https://picsum.photos/id/1060/800/600',
    desc: '도시 풍경과 노을을 감상하기 좋은 전망 명소'
  }
];

const createDefaultSeeData = (region) =>
  defaultSeeTemplates.map((item, index) => ({
    ...item,
    id: index + 1,
    title: `${region} ${item.title}`,
    location: `${region}시`
  }));

export const getSeeDataByRegion = (region) => {
  const regionKey = normalizeRegionKey(region);
  const data = seeData[regionKey] || createDefaultSeeData(regionKey);

  return data.map((item, index) => normalizeSeeItem(item, regionKey, index));
};

export const getSeeDataById = (id, region) => {
  if (region) {
    return getSeeDataByRegion(region).find((item) => item.id === Number(id)) || null;
  }

  return Object.keys(seeData)
    .flatMap((regionKey) => getSeeDataByRegion(regionKey))
    .find((item) => item.id === Number(id)) || null;
};
