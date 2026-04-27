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

export const getSeeDataByRegion = (region) => {
  return seeData[region] || [];
};