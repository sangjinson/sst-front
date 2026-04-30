// src/pages/area/food/foodData.js

const foodDataByRegion = {

  // ──────────────────────────────────────────
  // 경기 남부
  // ──────────────────────────────────────────

  수원시: [
    { id: 1, name: "수원 왕갈비탕", category: "한식", rating: 4.8, reviews: 324, description: "60년 전통의 진한 사골육수로 우려낸 수원 대표 왕갈비탕. 두툼한 갈비살이 일품입니다.", address: "경기도 수원시 팔달구 행궁로 45", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80", tags: ["전통", "대표음식", "가족식사"] },
    { id: 2, name: "화성 통닭골목", category: "한식", rating: 4.7, reviews: 512, description: "수원 화성 인근 유명 통닭골목. 바삭한 튀김옷과 육즙 가득한 통닭이 유명합니다.", address: "경기도 수원시 팔달구 정조로 777", image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80", tags: ["통닭", "명물거리", "야식"] },
    { id: 3, name: "행궁동 스시 오마카세", category: "일식", rating: 4.9, reviews: 198, description: "제철 해산물로 구성된 프리미엄 오마카세. 수원에서 즐기는 도심 속 미식 경험.", address: "경기도 수원시 팔달구 행궁로 12", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80", tags: ["오마카세", "프리미엄", "데이트"] },
    { id: 4, name: "수원 짜장면 원조", category: "중식", rating: 4.5, reviews: 276, description: "50년 전통의 수타면 짜장면. 춘장의 깊은 맛과 쫄깃한 면발이 특징입니다.", address: "경기도 수원시 영통구 영통로 88", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80", tags: ["중화요리", "전통", "점심"] },
    { id: 5, name: "인계동 파스타", category: "양식", rating: 4.6, reviews: 145, description: "이탈리아 정통 레시피로 만든 수제 파스타. 트러플 크림 파스타가 시그니처입니다.", address: "경기도 수원시 팔달구 인계로 55", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80", tags: ["파스타", "데이트", "이탈리안"] },
    { id: 6, name: "광교 육회비빔밥", category: "한식", rating: 4.7, reviews: 389, description: "신선한 한우 육회와 참기름 향이 어우러진 정통 육회비빔밥. 광교 맛집 1위.", address: "경기도 수원시 영통구 광교로 145", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80", tags: ["육회", "비빔밥", "한우"] },
    { id: 7, name: "매탄동 라멘집", category: "일식", rating: 4.4, reviews: 231, description: "12시간 우린 돈코츠 육수의 진한 라멘. 일본 현지 감성 그대로 재현한 수원 맛집.", address: "경기도 수원시 영통구 매탄로 33", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80", tags: ["라멘", "돈코츠", "일식"] },
    { id: 8, name: "팔달문 갈비찜", category: "한식", rating: 4.8, reviews: 467, description: "간장 양념에 24시간 재운 특제 갈비찜. 부드러운 육질과 달콤한 양념이 일품.", address: "경기도 수원시 팔달구 팔달로 200", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80", tags: ["갈비찜", "전통", "명절음식"] },
    { id: 9, name: "영통 스테이크하우스", category: "양식", rating: 4.6, reviews: 162, description: "드라이에이징 한우 스테이크 전문점. 풍부한 마블링과 깊은 풍미가 특징.", address: "경기도 수원시 영통구 영통로 99", image: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80", tags: ["스테이크", "한우", "특별한날"] },
    { id: 10, name: "수원 순대국밥", category: "한식", rating: 4.5, reviews: 310, description: "구수한 뼈 육수에 듬뿍 담긴 순대와 내장. 이른 아침부터 줄 서는 수원 명물 국밥집.", address: "경기도 수원시 권선구 권선로 123", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", tags: ["국밥", "해장", "전통"] },
    { id: 11, name: "광교 딤섬하우스", category: "중식", rating: 4.6, reviews: 189, description: "홍콩식 정통 딤섬을 광교 신도시에서. 하가우·소룡포·차슈바오가 특히 인기.", address: "경기도 수원시 영통구 광교중앙로 100", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80", tags: ["딤섬", "중식", "브런치"] },
  ],

  성남시: [
    { id: 1, name: "분당 판교 소고기 전문점", category: "한식", rating: 4.9, reviews: 408, description: "IT 도시 판교에서 즐기는 프리미엄 한우. 1++ 등급 한우를 숯불에 구워 먹는 고급 음식점.", address: "경기도 성남시 분당구 판교역로 235", image: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80", tags: ["한우", "프리미엄", "회식"] },
    { id: 2, name: "모란 닭한마리", category: "한식", rating: 4.6, reviews: 341, description: "성남 모란시장 인근 50년 전통 닭한마리. 칼칼한 국물과 쫄깃한 닭고기의 조화가 일품.", address: "경기도 성남시 중원구 모란로 45", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80", tags: ["닭한마리", "전통", "모란시장"] },
    { id: 3, name: "서현 스시 오마카세", category: "일식", rating: 4.8, reviews: 156, description: "서현역 인근 수준 높은 오마카세. 매일 직송되는 신선한 생선으로 구성.", address: "경기도 성남시 분당구 서현로 170", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80", tags: ["오마카세", "데이트", "서현"] },
    { id: 4, name: "판교 브런치 카페", category: "양식", rating: 4.5, reviews: 223, description: "IT 직장인들의 성지. 에그베네딕트와 어보카도 토스트가 대표 메뉴인 힙한 브런치 카페.", address: "경기도 성남시 분당구 판교로 256", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80", tags: ["브런치", "카페", "판교"] },
    { id: 5, name: "정자동 마라탕", category: "중식", rating: 4.4, reviews: 312, description: "MZ세대에게 인기 폭발! 직접 고르는 재료와 매콤한 마라 국물의 마라탕 맛집.", address: "경기도 성남시 분당구 정자일로 20", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80", tags: ["마라탕", "MZ", "매운맛"] },
    { id: 6, name: "야탑 돼지갈비", category: "한식", rating: 4.7, reviews: 278, description: "숯불에 직접 굽는 두툼한 돼지갈비. 달콤한 양념이 입안 가득 퍼지는 야탑 명물.", address: "경기도 성남시 중원구 야탑로 66", image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80", tags: ["돼지갈비", "숯불", "야탑"] },
    { id: 7, name: "이매촌 콩나물국밥", category: "한식", rating: 4.3, reviews: 189, description: "새벽부터 끓이는 진한 콩나물국밥. 해장으로 그만인 성남 서민 음식의 진수.", address: "경기도 성남시 분당구 이매로 100", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", tags: ["콩나물국밥", "해장", "아침식사"] },
    { id: 8, name: "판교 수제버거", category: "양식", rating: 4.6, reviews: 198, description: "직접 패티를 갈아 만드는 수제버거. 두툼한 패티와 신선한 채소의 완벽한 조화.", address: "경기도 성남시 분당구 판교역로 160", image: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80", tags: ["수제버거", "점심", "판교"] },
    { id: 9, name: "분당 초밥 뷔페", category: "일식", rating: 4.5, reviews: 445, description: "가성비 최고의 초밥 뷔페. 60여 종의 초밥을 무제한으로 즐길 수 있는 분당 명물.", address: "경기도 성남시 분당구 분당로 55", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80", tags: ["초밥", "뷔페", "가성비"] },
  ],

  용인시: [
    { id: 1, name: "에버랜드 인근 삼겹살", category: "한식", rating: 4.6, reviews: 533, description: "에버랜드 방문 후 들르는 필수 코스. 두툼한 생삼겹살을 직접 구워 먹는 인기 맛집.", address: "경기도 용인시 처인구 포곡읍 에버랜드로 70", image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80", tags: ["삼겹살", "에버랜드", "가족"] },
    { id: 2, name: "기흥 순두부찌개", category: "한식", rating: 4.7, reviews: 289, description: "직접 만든 국산 콩 순두부로 끓인 얼큰한 순두부찌개. 기흥 주민들이 즐겨 찾는 터줏대감.", address: "경기도 용인시 기흥구 기흥로 80", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80", tags: ["순두부찌개", "한식", "점심"] },
    { id: 3, name: "수지 이탈리안 레스토랑", category: "양식", rating: 4.8, reviews: 167, description: "이탈리아 요리사 출신 셰프가 운영하는 정통 이탈리안. 직접 만든 생면 파스타가 특징.", address: "경기도 용인시 수지구 수지로 77", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80", tags: ["이탈리안", "파스타", "데이트"] },
    { id: 4, name: "동백 돼지국밥", category: "한식", rating: 4.4, reviews: 412, description: "부산식 돼지국밥을 용인에서. 진한 뼈 육수와 부드러운 돼지고기가 조화를 이룬다.", address: "경기도 용인시 기흥구 동백죽전대로 120", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", tags: ["돼지국밥", "부산식", "해장"] },
    { id: 5, name: "죽전 일본라멘", category: "일식", rating: 4.5, reviews: 234, description: "일본 직수입 간장과 현지 레시피로 만든 쇼유 라멘. 깔끔하면서도 깊은 맛이 특징.", address: "경기도 용인시 수지구 죽전로 45", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80", tags: ["라멘", "쇼유", "일식"] },
    { id: 6, name: "구성 중화요리", category: "중식", rating: 4.3, reviews: 178, description: "화교 주방장이 운영하는 정통 중화요리. 탕수육과 짬뽕이 시그니처 메뉴.", address: "경기도 용인시 기흥구 구성로 200", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80", tags: ["중화요리", "탕수육", "짬뽕"] },
    { id: 7, name: "처인구 한정식", category: "한식", rating: 4.9, reviews: 143, description: "용인 전통 한정식 명가. 30여 가지 반찬이 한 상 가득 차려지는 정통 코스 요리.", address: "경기도 용인시 처인구 중부대로 1234", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80", tags: ["한정식", "전통", "접대"] },
    { id: 8, name: "광교저수지 뷰 레스토랑", category: "양식", rating: 4.7, reviews: 321, description: "광교저수지 전경을 바라보며 즐기는 스테이크와 파스타. 뷰 맛집으로 유명.", address: "경기도 용인시 수지구 광교산로 88", image: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80", tags: ["뷰맛집", "스테이크", "데이트"] },
    { id: 9, name: "백암 순대국", category: "한식", rating: 4.6, reviews: 388, description: "용인 백암면 명물 순대국. 직접 만든 찹쌀 순대와 진한 국물이 일품인 향토 음식.", address: "경기도 용인시 처인구 백암면 백암로 100", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", tags: ["순대국", "백암", "향토음식"] },
  ],

  안양시: [
    { id: 1, name: "안양 평촌 족발집", category: "한식", rating: 4.7, reviews: 398, description: "30년 전통의 안양 대표 족발집. 쫄깃하고 담백한 족발과 막국수 세트가 시그니처.", address: "경기도 안양시 동안구 평촌대로 100", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80", tags: ["족발", "전통", "안주"] },
    { id: 2, name: "범계 곱창전골", category: "한식", rating: 4.6, reviews: 267, description: "신선한 소 곱창을 듬뿍 넣은 얼큰한 전골. 범계역 인근 직장인들의 회식 성지.", address: "경기도 안양시 동안구 범계로 55", image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80", tags: ["곱창", "전골", "회식"] },
    { id: 3, name: "안양 아구찜", category: "한식", rating: 4.5, reviews: 312, description: "통통한 아구살과 콩나물이 어우러진 매콤한 안양식 아구찜. 현지인 추천 맛집.", address: "경기도 안양시 만안구 안양로 200", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80", tags: ["아구찜", "매운맛", "현지인추천"] },
    { id: 4, name: "평촌 스시바", category: "일식", rating: 4.8, reviews: 189, description: "평촌 중심가의 모던 스시바. 제철 생선을 이용한 창작 초밥이 인기.", address: "경기도 안양시 동안구 평촌대로 120", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80", tags: ["스시", "창작초밥", "데이트"] },
    { id: 5, name: "안양 중국집 원조", category: "중식", rating: 4.4, reviews: 445, description: "안양에서 가장 오래된 중국집. 손으로 직접 뽑은 면과 진한 짜장이 전통 그대로.", address: "경기도 안양시 만안구 안양천동로 77", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80", tags: ["짜장면", "전통", "수타면"] },
    { id: 6, name: "호계동 화덕피자", category: "양식", rating: 4.5, reviews: 223, description: "화덕에서 구운 나폴리식 정통 피자. 쫄깃한 도우와 풍부한 토핑이 특징.", address: "경기도 안양시 동안구 호계로 88", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80", tags: ["피자", "화덕", "이탈리안"] },
    { id: 7, name: "석수동 감자탕", category: "한식", rating: 4.4, reviews: 334, description: "뼈 속까지 부드럽게 익힌 돼지 뼈와 감자가 어우러진 진한 감자탕.", address: "경기도 안양시 만안구 석수로 45", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", tags: ["감자탕", "해장", "뼈국물"] },
    { id: 8, name: "평촌 샤브샤브", category: "일식", rating: 4.6, reviews: 256, description: "채소와 해산물이 풍성하게 담긴 샤브샤브. 건강하고 깔끔한 한 끼.", address: "경기도 안양시 동안구 평촌대로 88", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80", tags: ["샤브샤브", "건강식", "데이트"] },
  ],

  안산시: [
    { id: 1, name: "대부도 조개구이", category: "한식", rating: 4.8, reviews: 524, description: "서해 직송 조개를 숯불에 구워 먹는 대부도 명물. 바지락·키조개·새조개 세트가 인기.", address: "경기도 안산시 단원구 대부북동 대부황금로 17", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80", tags: ["조개구이", "대부도", "서해"] },
    { id: 2, name: "원곡동 할랄 양고기", category: "중식", rating: 4.5, reviews: 312, description: "안산 다문화 특구 원곡동의 정통 할랄 양고기 요리. 이국적인 향신료가 매력적.", address: "경기도 안산시 단원구 원곡동 다문화로 55", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80", tags: ["할랄", "양고기", "다문화"] },
    { id: 3, name: "선부동 해물순두부", category: "한식", rating: 4.6, reviews: 278, description: "서해 해산물이 가득 들어간 얼큰한 해물순두부. 신선한 재료로 매일 끓여냅니다.", address: "경기도 안산시 단원구 선부로 100", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80", tags: ["순두부", "해물", "점심"] },
    { id: 4, name: "고잔 일식 정식", category: "일식", rating: 4.5, reviews: 198, description: "가성비 좋은 일식 정식. 생선구이·된장국·샐러드가 세트로 나오는 든든한 한 끼.", address: "경기도 안산시 단원구 고잔로 77", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80", tags: ["일식정식", "가성비", "점심"] },
    { id: 5, name: "안산 중앙시장 떡볶이", category: "한식", rating: 4.3, reviews: 445, description: "안산 중앙시장의 명물 즉석 떡볶이. 쫄면·순대와 함께 먹는 것이 현지 스타일.", address: "경기도 안산시 상록구 안산시장로 33", image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80", tags: ["떡볶이", "분식", "시장"] },
    { id: 6, name: "시화 MTV 스테이크", category: "양식", rating: 4.6, reviews: 167, description: "시화 MTV 신도시의 모던 스테이크 레스토랑. 드라이에이징 숙성육이 시그니처.", address: "경기도 안산시 단원구 시화MTV로 200", image: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80", tags: ["스테이크", "숙성육", "MTV"] },
    { id: 7, name: "대부도 바지락칼국수", category: "한식", rating: 4.7, reviews: 389, description: "대부도 갯벌에서 직접 채취한 바지락으로 끓인 시원한 칼국수. 국물이 일품.", address: "경기도 안산시 단원구 대부도로 88", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", tags: ["바지락칼국수", "대부도", "해물"] },
    { id: 8, name: "원곡동 베트남 쌀국수", category: "양식", rating: 4.4, reviews: 256, description: "안산 다문화 거리의 정통 베트남 쌀국수. 현지인이 운영하는 진짜 포.", address: "경기도 안산시 단원구 원곡동 33", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80", tags: ["쌀국수", "베트남", "다문화"] },
  ],

  과천시: [
    { id: 1, name: "과천 경마공원 갈비", category: "한식", rating: 4.7, reviews: 334, description: "경마공원 인근 유명 갈비집. 경기 후 즐기는 두툼한 생갈비가 명물.", address: "경기도 과천시 경마공원대로 107", image: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80", tags: ["갈비", "경마공원", "명물"] },
    { id: 2, name: "과천 막국수", category: "한식", rating: 4.6, reviews: 278, description: "메밀 향 가득한 시원한 막국수. 과천 관악산 등산 후 즐기는 현지인 맛집.", address: "경기도 과천시 관문로 45", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", tags: ["막국수", "등산후", "메밀"] },
    { id: 3, name: "과천 정부청사 근처 한정식", category: "한식", rating: 4.8, reviews: 189, description: "정부청사 공무원들의 단골 한정식집. 정갈한 반찬과 제철 나물이 가득.", address: "경기도 과천시 관문로 88", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80", tags: ["한정식", "접대", "정갈"] },
    { id: 4, name: "과천 서울랜드 주변 통닭", category: "한식", rating: 4.4, reviews: 412, description: "서울랜드 방문 후 들르는 필수 코스. 바삭한 후라이드와 양념 통닭 세트.", address: "경기도 과천시 광명로 135", image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80", tags: ["통닭", "서울랜드", "가족"] },
    { id: 5, name: "중앙동 이탈리안 카페", category: "양식", rating: 4.5, reviews: 156, description: "과천 중심가의 아담한 이탈리안 카페. 직접 만든 티라미수와 파스타가 유명.", address: "경기도 과천시 중앙동 중앙로 55", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80", tags: ["이탈리안", "카페", "디저트"] },
    { id: 6, name: "과천 냉면집", category: "한식", rating: 4.6, reviews: 223, description: "평양식 물냉면과 함흥식 비빔냉면을 모두 맛볼 수 있는 과천 냉면 명가.", address: "경기도 과천시 별양로 22", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80", tags: ["냉면", "평양냉면", "여름"] },
  ],

  광명시: [
    { id: 1, name: "광명동굴 인근 한우", category: "한식", rating: 4.7, reviews: 298, description: "광명동굴 관광 후 들르는 한우 전문점. 1등급 한우를 합리적인 가격에 즐길 수 있음.", address: "경기도 광명시 가학로85번길 142", image: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80", tags: ["한우", "광명동굴", "가성비"] },
    { id: 2, name: "철산 왕만두", category: "한식", rating: 4.5, reviews: 389, description: "철산역 인근 30년 전통 왕만두집. 두툼한 피에 꽉 찬 소가 일품인 광명 명물.", address: "경기도 광명시 철산로 88", image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&q=80", tags: ["만두", "전통", "분식"] },
    { id: 3, name: "소하동 낙지볶음", category: "한식", rating: 4.6, reviews: 234, description: "살아있는 낙지로 만드는 매콤한 낙지볶음. 쭈꾸미와 함께 즐기는 것이 광명 스타일.", address: "경기도 광명시 소하로 120", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80", tags: ["낙지볶음", "매운맛", "해산물"] },
    { id: 4, name: "광명 IKEA 근처 브런치", category: "양식", rating: 4.4, reviews: 312, description: "IKEA 광명점 근처 감성 브런치 카페. 쇼핑 전후 들르기 좋은 여유로운 공간.", address: "경기도 광명시 신기로 11", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80", tags: ["브런치", "IKEA", "카페"] },
    { id: 5, name: "하안동 짬뽕집", category: "중식", rating: 4.5, reviews: 267, description: "해물이 가득한 얼큰한 짬뽕. 광명 현지인들이 줄 서서 먹는 숨은 짬뽕 맛집.", address: "경기도 광명시 하안로 66", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80", tags: ["짬뽕", "해물", "중식"] },
    { id: 6, name: "광명 참숯 삼겹살", category: "한식", rating: 4.7, reviews: 445, description: "참숯 화로에 직접 구워 먹는 두툼한 삼겹살. 연기 없이 바삭하게 구워지는 것이 특징.", address: "경기도 광명시 광명로 200", image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80", tags: ["삼겹살", "참숯", "회식"] },
  ],

  광주시: [
    { id: 1, name: "남한산성 막걸리 골목", category: "한식", rating: 4.7, reviews: 456, description: "남한산성 등산 후 즐기는 전통 막걸리와 파전. 산 아래 줄지어 있는 막걸리 골목이 명물.", address: "경기도 광주시 남한산성면 남한산성로 784", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80", tags: ["막걸리", "파전", "남한산성"] },
    { id: 2, name: "곤지암 도자기 카페", category: "양식", rating: 4.6, reviews: 234, description: "곤지암 도예 마을의 감성 카페. 직접 만든 도자기 컵에 담아주는 특별한 커피.", address: "경기도 광주시 곤지암읍 경충대로 2776", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80", tags: ["카페", "도자기", "곤지암"] },
    { id: 3, name: "광주 토종닭 백숙", category: "한식", rating: 4.8, reviews: 312, description: "토종닭을 12시간 이상 고아낸 진한 백숙. 황기와 인삼이 들어간 보양식.", address: "경기도 광주시 초월읍 용수로 55", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", tags: ["백숙", "보양식", "토종닭"] },
    { id: 4, name: "퇴촌 토마토 요리", category: "양식", rating: 4.5, reviews: 178, description: "퇴촌 특산 토마토로 만드는 토마토 파스타와 토마토 스테이크. 싱싱한 특산물 요리.", address: "경기도 광주시 퇴촌면 광여로 100", image: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80", tags: ["토마토", "특산물", "파스타"] },
    { id: 5, name: "경안동 국밥거리", category: "한식", rating: 4.4, reviews: 389, description: "광주 경안동에 형성된 국밥 골목. 순대국밥·해장국·설렁탕 등 다양한 국밥집 밀집.", address: "경기도 광주시 경안동 광주로 33", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", tags: ["국밥", "골목", "해장"] },
    { id: 6, name: "오포 장어구이", category: "한식", rating: 4.7, reviews: 267, description: "팔당호 인근에서 공수한 민물장어를 직화로 구운 장어구이. 보양식으로 인기.", address: "경기도 광주시 오포읍 오포로 200", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80", tags: ["장어구이", "보양식", "팔당"] },
  ],

  군포시: [
    { id: 1, name: "산본 닭갈비", category: "한식", rating: 4.6, reviews: 334, description: "산본 신도시의 대표 닭갈비 맛집. 춘천식 닭갈비를 철판에 볶아 먹는 방식.", address: "경기도 군포시 산본로 323", image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80", tags: ["닭갈비", "철판", "산본"] },
    { id: 2, name: "군포 칼국수", category: "한식", rating: 4.5, reviews: 278, description: "손으로 직접 반죽한 쫄깃한 칼국수. 바지락 육수의 시원한 맛이 일품.", address: "경기도 군포시 군포로 100", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", tags: ["칼국수", "수제면", "점심"] },
    { id: 3, name: "금정역 돈코츠 라멘", category: "일식", rating: 4.7, reviews: 198, description: "금정역 인근 진한 돈코츠 라멘 전문점. 두꺼운 면발과 진한 국물의 조화.", address: "경기도 군포시 금정로 55", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80", tags: ["라멘", "돈코츠", "일식"] },
    { id: 4, name: "당정동 생선구이", category: "한식", rating: 4.4, reviews: 223, description: "제철 생선을 직화로 구운 생선구이 정식. 고등어·갈치·조기가 매일 달라진다.", address: "경기도 군포시 당정로 77", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80", tags: ["생선구이", "정식", "건강식"] },
    { id: 5, name: "산본 중국성", category: "중식", rating: 4.5, reviews: 312, description: "산본에서 가장 유명한 중화요리 전문점. 탕수육과 팔보채가 시그니처 메뉴.", address: "경기도 군포시 산본로 200", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80", tags: ["중화요리", "탕수육", "팔보채"] },
    { id: 6, name: "군포 카레하우스", category: "양식", rating: 4.6, reviews: 156, description: "일본식 스지카레부터 인도식 커리까지. 다양한 카레를 즐길 수 있는 이색 맛집.", address: "경기도 군포시 군포로 155", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80", tags: ["카레", "이색", "인도식"] },
  ],

  부천시: [
    { id: 1, name: "중동 소머리국밥", category: "한식", rating: 4.7, reviews: 412, description: "새벽부터 끓이는 진한 소머리 육수. 부천 현지인이 사랑하는 해장국 명가.", address: "경기도 부천시 중동 부천로 200", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", tags: ["소머리국밥", "해장", "현지인"] },
    { id: 2, name: "상동 양꼬치거리", category: "중식", rating: 4.5, reviews: 356, description: "이국적인 향신료와 함께 즐기는 숯불 양꼬치. 부천 상동의 이색 먹자골목.", address: "경기도 부천시 상동 상일로 55", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80", tags: ["양꼬치", "이색", "상동"] },
    { id: 3, name: "부천역 마늘 떡볶이", category: "한식", rating: 4.3, reviews: 523, description: "알싸한 마늘향이 매력적인 부천 특유의 마늘 떡볶이. 중독성 강한 분식 맛집.", address: "경기도 부천시 부천로 1", image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80", tags: ["떡볶이", "마늘", "분식"] },
    { id: 4, name: "작동 홍두깨 칼국수", category: "한식", rating: 4.6, reviews: 289, description: "진한 바지락 육수와 쫄깃한 수타면의 조화. 부천에서 가장 유명한 칼국수집.", address: "경기도 부천시 작동 길주로 100", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", tags: ["칼국수", "수타면", "바지락"] },
    { id: 5, name: "신중동 곱창구이", category: "한식", rating: 4.5, reviews: 334, description: "퇴근길 직장인들의 발길을 사로잡는 고소한 곱창구이. 신중동역 인근 인기 맛집.", address: "경기도 부천시 중동 신중로 77", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80", tags: ["곱창", "회식", "신중동"] },
    { id: 6, name: "까치울 감성 카페", category: "양식", rating: 4.7, reviews: 198, description: "전원주택 단지 속 아기자기한 감성 카페. 직접 만든 케이크와 커피가 유명.", address: "경기도 부천시 오정구 까치울로 33", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80", tags: ["카페", "감성", "브런치"] },
    { id: 7, name: "부천 스시 오마카세", category: "일식", rating: 4.8, reviews: 145, description: "부천에서 즐기는 프리미엄 오마카세. 합리적인 가격으로 코스 요리를 즐길 수 있음.", address: "경기도 부천시 원미구 길주로 200", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80", tags: ["오마카세", "프리미엄", "일식"] },
  ],

  시흥시: [
    { id: 1, name: "오이도 회 센터", category: "한식", rating: 4.8, reviews: 489, description: "시흥 오이도에서 즐기는 신선한 서해 활어회. 낙조를 보며 먹는 낭만적인 식사.", address: "경기도 시흥시 오이도로 175", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80", tags: ["활어회", "오이도", "서해"] },
    { id: 2, name: "오이도 바지락죽", category: "한식", rating: 4.6, reviews: 367, description: "오이도 갯벌에서 직접 잡은 바지락으로 끓인 바지락죽. 고소하고 시원한 맛.", address: "경기도 시흥시 오이도로 88", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", tags: ["바지락죽", "오이도", "해장"] },
    { id: 3, name: "정왕동 중화요리", category: "중식", rating: 4.4, reviews: 234, description: "시화공단 노동자들의 밥집. 저렴하고 푸짐한 정통 중화요리 전문점.", address: "경기도 시흥시 정왕동 시화로 120", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80", tags: ["중화요리", "가성비", "푸짐"] },
    { id: 4, name: "배곧 신도시 파스타", category: "양식", rating: 4.6, reviews: 189, description: "배곧 신도시의 트렌디한 이탈리안 레스토랑. 오션뷰와 함께 즐기는 파스타.", address: "경기도 시흥시 배곧동 서해로 200", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80", tags: ["파스타", "오션뷰", "배곧"] },
    { id: 5, name: "월곶 조개찜", category: "한식", rating: 4.7, reviews: 312, description: "월곶 포구 인근 조개찜 전문점. 큰 찜통에 가득 담긴 조개와 야채의 조화.", address: "경기도 시흥시 월곶포구로 55", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80", tags: ["조개찜", "월곶", "포구"] },
    { id: 6, name: "시흥 능곡 막국수", category: "한식", rating: 4.5, reviews: 256, description: "메밀 향 가득한 능곡 스타일 막국수. 동치미 국물로 만든 시원한 물막국수.", address: "경기도 시흥시 능곡동 능곡로 44", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80", tags: ["막국수", "메밀", "시원"] },
  ],

  안성시: [
    { id: 1, name: "안성 한우 전골", category: "한식", rating: 4.8, reviews: 345, description: "안성 브랜드 한우를 가득 넣은 진한 한우 전골. 채소와 버섯이 조화롭게 어우러짐.", address: "경기도 안성시 중앙로 100", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80", tags: ["한우전골", "안성한우", "보양식"] },
    { id: 2, name: "안성 맞춤 쌀밥", category: "한식", rating: 4.6, reviews: 289, description: "안성 특산 쌀로 지은 솥밥 정식. '안성맞춤'이라는 말의 고향에서 맛보는 정통 밥상.", address: "경기도 안성시 안성맞춤대로 55", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80", tags: ["솥밥", "특산물", "한정식"] },
    { id: 3, name: "공도 떡갈비", category: "한식", rating: 4.5, reviews: 234, description: "안성 한우로 만든 수제 떡갈비. 달콤한 양념이 배어든 부드러운 떡갈비.", address: "경기도 안성시 공도읍 공도로 200", image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80", tags: ["떡갈비", "한우", "공도"] },
    { id: 4, name: "안성 팜랜드 삼겹살", category: "한식", rating: 4.4, reviews: 412, description: "안성 팜랜드 인근 직화 삼겹살. 농장에서 키운 돼지고기를 직접 구워 먹는 체험형 식사.", address: "경기도 안성시 공도읍 대신두길 66", image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80", tags: ["삼겹살", "팜랜드", "체험"] },
    { id: 5, name: "죽산 산채 정식", category: "한식", rating: 4.7, reviews: 178, description: "죽산 인근 산에서 채취한 나물로 차린 산채 정식. 자연의 맛을 그대로 담은 건강식.", address: "경기도 안성시 죽산면 죽산로 300", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80", tags: ["산채정식", "건강식", "죽산"] },
    { id: 6, name: "안성 중국집", category: "중식", rating: 4.3, reviews: 267, description: "안성 시내 인기 중화요리집. 수타면으로 만든 짜장면과 해물 짬뽕이 인기 메뉴.", address: "경기도 안성시 중앙로 77", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80", tags: ["중화요리", "수타면", "짬뽕"] },
  ],

  오산시: [
    { id: 1, name: "오산 물향기 수목원 카페", category: "양식", rating: 4.6, reviews: 234, description: "물향기 수목원 인근 감성 카페. 계절 꽃과 함께 즐기는 브런치와 디저트.", address: "경기도 오산시 수청동 수목원로 100", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80", tags: ["카페", "수목원", "브런치"] },
    { id: 2, name: "오산 시장 국밥", category: "한식", rating: 4.5, reviews: 389, description: "오산 전통 시장의 구수한 국밥. 새벽부터 줄 서는 현지인 단골 국밥집.", address: "경기도 오산시 오산동 시장로 33", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", tags: ["국밥", "시장", "전통"] },
    { id: 3, name: "세교 신도시 스시", category: "일식", rating: 4.7, reviews: 167, description: "세교 신도시의 깔끔한 스시 전문점. 당일 직송 생선으로 만든 신선한 초밥.", address: "경기도 오산시 세교동 세교로 200", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80", tags: ["스시", "신선", "세교"] },
    { id: 4, name: "오산 두부요리", category: "한식", rating: 4.4, reviews: 223, description: "국산 콩으로 직접 만든 순두부와 모두부 요리. 담백하고 고소한 건강 밥상.", address: "경기도 오산시 원동 오산로 55", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80", tags: ["두부요리", "건강식", "담백"] },
    { id: 5, name: "오산 갈비탕", category: "한식", rating: 4.6, reviews: 312, description: "진한 사골 육수에 부드러운 갈비가 듬뿍 들어간 오산 명물 갈비탕.", address: "경기도 오산시 오산동 경기대로 88", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", tags: ["갈비탕", "사골육수", "보양"] },
  ],

  의왕시: [
    { id: 1, name: "백운호수 뷰 카페", category: "양식", rating: 4.8, reviews: 312, description: "백운호수를 바라보며 즐기는 커피와 브런치. 의왕에서 가장 뷰가 좋은 카페.", address: "경기도 의왕시 학의동 호수로 145", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80", tags: ["뷰맛집", "백운호수", "카페"] },
    { id: 2, name: "의왕 철도박물관 인근 돈가스", category: "일식", rating: 4.5, reviews: 267, description: "철도박물관 방문 후 들르는 수제 돈가스 전문점. 바삭한 튀김옷과 부드러운 고기.", address: "경기도 의왕시 월암동 철도박물관로 142", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80", tags: ["돈가스", "수제", "철도박물관"] },
    { id: 3, name: "오전동 삼계탕", category: "한식", rating: 4.7, reviews: 234, description: "의왕 토종닭으로 끓인 진한 삼계탕. 인삼·황기·대추가 듬뿍 들어간 보양식.", address: "경기도 의왕시 오전동 의왕로 55", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80", tags: ["삼계탕", "보양식", "토종닭"] },
    { id: 4, name: "의왕 청계산 막국수", category: "한식", rating: 4.6, reviews: 189, description: "청계산 등산 후 즐기는 시원한 막국수. 메밀의 고소한 향과 동치미 육수.", address: "경기도 의왕시 청계동 청계로 100", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", tags: ["막국수", "등산후", "청계산"] },
    { id: 5, name: "포일 한우갈비", category: "한식", rating: 4.8, reviews: 345, description: "의왕 포일동의 한우 갈비 전문점. 마블링 좋은 한우를 숯불에 구워 먹는 고급 식사.", address: "경기도 의왕시 포일동 포일로 200", image: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80", tags: ["한우갈비", "숯불", "프리미엄"] },
  ],

  이천시: [
    { id: 1, name: "이천 쌀밥 정식", category: "한식", rating: 4.9, reviews: 567, description: "임금님께 진상하던 이천 쌀로 지은 솥밥. 구수한 누룽지까지 즐길 수 있는 정통 이천 쌀밥 정식.", address: "경기도 이천시 중리동 설봉로 170", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80", tags: ["쌀밥", "임금님쌀", "전통"] },
    { id: 2, name: "부발 도예 카페 브런치", category: "양식", rating: 4.7, reviews: 198, description: "이천 도예 문화와 결합한 독특한 카페. 직접 만든 도자기 그릇에 담아 나오는 브런치 코스.", address: "경기도 이천시 신둔면 도예로 55", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80", tags: ["도예", "브런치", "이색카페"] },
    { id: 3, name: "이천 닭볶음탕", category: "한식", rating: 4.6, reviews: 345, description: "이천 현지인들이 사랑하는 매콤한 닭볶음탕. 감자와 당근이 듬뿍 들어간 푸짐한 한 솥.", address: "경기도 이천시 관고동 경충대로 2776", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80", tags: ["닭볶음탕", "매운맛", "현지인"] },
    { id: 4, name: "설봉 산채비빔밥", category: "한식", rating: 4.8, reviews: 289, description: "설봉산 인근에서 채취한 신선한 나물로 만든 산채비빔밥. 자연의 맛을 그대로 담은 건강식.", address: "경기도 이천시 중리동 설봉로 33", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80", tags: ["산채비빔밥", "건강식", "자연"] },
    { id: 5, name: "이천 도자기 복합문화단지 한식", category: "한식", rating: 4.5, reviews: 223, description: "도자기 축제 기간 특히 유명한 한식 뷔페. 이천 특산 쌀밥과 다양한 향토 음식.", address: "경기도 이천시 신둔면 수광리 도예로 88", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80", tags: ["한식뷔페", "도자기축제", "향토음식"] },
  ],

  평택시: [
    { id: 1, name: "송탄 부대찌개", category: "한식", rating: 4.9, reviews: 678, description: "부대찌개의 원조 송탄. 미군 부대 인근에서 시작된 역사적인 맛. 풍부한 재료와 진한 국물.", address: "경기도 평택시 서정동 신장로 2", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80", tags: ["부대찌개", "원조", "송탄"] },
    { id: 2, name: "평택항 활어회", category: "한식", rating: 4.8, reviews: 412, description: "평택항에서 직접 들여오는 신선한 활어회. 서해 바다의 싱싱한 생선을 맛볼 수 있는 항구 맛집.", address: "경기도 평택시 포승읍 평택항로 126", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80", tags: ["활어회", "서해", "신선"] },
    { id: 3, name: "팽성 쌀밥 한정식", category: "한식", rating: 4.7, reviews: 289, description: "평택 쌀로 지은 솥밥과 한정식. 향기로운 밥과 정갈한 반찬이 가득한 전통 한상.", address: "경기도 평택시 팽성읍 원평로 100", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80", tags: ["한정식", "쌀밥", "전통"] },
    { id: 4, name: "안정리 스테이크", category: "양식", rating: 4.6, reviews: 234, description: "미군 부대 인근에서 발달한 미국식 스테이크 하우스. 정통 아메리칸 스타일의 두툼한 스테이크.", address: "경기도 평택시 팽성읍 안정리 210", image: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80", tags: ["스테이크", "미국식", "안정리"] },
    { id: 5, name: "평택 칼국수", category: "한식", rating: 4.5, reviews: 345, description: "손으로 직접 반죽하고 칼로 썬 정통 칼국수. 시원하고 구수한 국물이 일품인 평택 명물.", address: "경기도 평택시 평택동 평남로 55", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", tags: ["칼국수", "수제면", "점심"] },
    { id: 6, name: "중국 동포 마을 양꼬치", category: "중식", rating: 4.4, reviews: 289, description: "평택 중국 동포 마을의 정통 양꼬치. 현지의 향신료와 비법 소스가 만들어내는 진짜 맛.", address: "경기도 평택시 비전동 중국마을길 77", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80", tags: ["양꼬치", "정통중식", "이색"] },
  ],

  하남시: [
    { id: 1, name: "미사리 카페거리 브런치", category: "양식", rating: 4.7, reviews: 445, description: "한강 미사리 경정 인근 유명 카페거리. 강변 뷰를 보며 즐기는 브런치와 커피.", address: "경기도 하남시 미사동 미사강변대로 100", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80", tags: ["브런치", "미사리", "한강뷰"] },
    { id: 2, name: "스타필드 하남 푸드코트", category: "양식", rating: 4.4, reviews: 567, description: "스타필드 하남의 다채로운 레스토랑가. 다양한 국적의 음식을 한 곳에서 즐길 수 있음.", address: "경기도 하남시 미사대로 750", image: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80", tags: ["스타필드", "다양한메뉴", "쇼핑"] },
    { id: 3, name: "하남 위례 한우", category: "한식", rating: 4.8, reviews: 312, description: "위례 신도시의 프리미엄 한우 전문점. 마블링 가득한 한우를 숯불에 구워 먹는 고급 식사.", address: "경기도 하남시 위례 위례대로 200", image: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80", tags: ["한우", "위례", "프리미엄"] },
    { id: 4, name: "팔당 두물머리 막국수", category: "한식", rating: 4.6, reviews: 278, description: "두물머리 인근의 시원한 막국수. 북한강과 남한강이 만나는 뷰를 보며 먹는 낭만 식사.", address: "경기도 하남시 배알미동 두물머리길 45", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", tags: ["막국수", "두물머리", "뷰맛집"] },
    { id: 5, name: "검단산 산악회 칼국수", category: "한식", rating: 4.5, reviews: 345, description: "검단산 등산로 입구의 칼국수 명가. 등산객들이 줄 서서 먹는 얼큰 칼국수.", address: "경기도 하남시 하산곡동 검단산로 88", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", tags: ["칼국수", "등산", "검단산"] },
    { id: 6, name: "하남 미사리 닭볶음탕", category: "한식", rating: 4.7, reviews: 234, description: "미사리 경정 인근 닭볶음탕 명가. 매콤달콤한 양념과 쫄깃한 닭고기가 일품.", address: "경기도 하남시 미사동 미사로 55", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80", tags: ["닭볶음탕", "미사리", "매운맛"] },
  ],

  화성시: [
    { id: 1, name: "제부도 해산물 백반", category: "한식", rating: 4.8, reviews: 378, description: "제부도 섬에서 맛보는 싱싱한 해산물 백반. 조개구이와 매운탕이 포함된 푸짐한 한상.", address: "경기도 화성시 서신면 제부리 74", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80", tags: ["해산물", "백반", "섬"] },
    { id: 2, name: "궁평항 꽃게탕", category: "한식", rating: 4.9, reviews: 445, description: "서해 직송 꽃게로 끓인 칼칼한 꽃게탕. 궁평항 일몰을 보며 먹는 최고의 낭만 식사.", address: "경기도 화성시 서신면 궁평항로 1049", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80", tags: ["꽃게탕", "서해", "뷰맛집"] },
    { id: 3, name: "동탄 파스타&피자", category: "양식", rating: 4.6, reviews: 267, description: "동탄 신도시의 트렌디한 이탈리안 레스토랑. 화덕 피자와 직접 만든 생면 파스타.", address: "경기도 화성시 동탄반석로 100", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80", tags: ["파스타", "피자", "동탄"] },
    { id: 4, name: "봉담 돼지갈비", category: "한식", rating: 4.5, reviews: 312, description: "화성 봉담의 명물 갈비집. 두껍게 썬 돼지갈비를 직화로 구워 먹는 로컬 맛집.", address: "경기도 화성시 봉담읍 봉담로 200", image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80", tags: ["돼지갈비", "직화", "로컬"] },
    { id: 5, name: "동탄 일식 오마카세", category: "일식", rating: 4.7, reviews: 134, description: "동탄 신도시의 숨은 오마카세 맛집. 당일 들어오는 신선한 재료로만 구성하는 코스.", address: "경기도 화성시 동탄기흥로 520", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80", tags: ["오마카세", "프리미엄", "동탄"] },
    { id: 6, name: "전곡항 해물라면", category: "한식", rating: 4.4, reviews: 389, description: "전곡항 포구에서 즐기는 푸짐한 해물라면. 서해 조개와 낙지가 가득 들어간 얼큰한 한 그릇.", address: "경기도 화성시 우정읍 전곡리 전곡항로 77", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", tags: ["해물라면", "전곡항", "포구"] },
  ],

  여주시: [
    { id: 1, name: "여주 쌀밥 정식", category: "한식", rating: 4.9, reviews: 489, description: "여주 특산 쌀로 지은 향기로운 솥밥 정식. 이천 쌀과 함께 경기도 최고 쌀 산지의 밥상.", address: "경기도 여주시 중앙로 100", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80", tags: ["쌀밥", "여주쌀", "특산물"] },
    { id: 2, name: "남한강 민물매운탕", category: "한식", rating: 4.7, reviews: 356, description: "남한강에서 잡은 민물고기로 끓인 얼큰한 매운탕. 빠가사리·메기·잉어가 들어간 정통 강 매운탕.", address: "경기도 여주시 강변유원지길 55", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80", tags: ["매운탕", "민물고기", "남한강"] },
    { id: 3, name: "여주 도자기 마을 카페", category: "양식", rating: 4.6, reviews: 234, description: "여주 도자기 마을의 감성 카페. 직접 만든 도자기 컵으로 즐기는 특별한 커피 타임.", address: "경기도 여주시 북내면 도예로 200", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80", tags: ["카페", "도자기", "감성"] },
    { id: 4, name: "세종대왕릉 인근 한정식", category: "한식", rating: 4.8, reviews: 178, description: "세종대왕릉 방문 후 즐기는 전통 한정식. 정갈한 반찬과 여주 쌀밥으로 차린 품격 있는 한상.", address: "경기도 여주시 능서면 영릉로 269", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80", tags: ["한정식", "세종대왕릉", "전통"] },
    { id: 5, name: "여주 고구마 요리", category: "한식", rating: 4.5, reviews: 312, description: "여주 특산 고구마로 만드는 다양한 고구마 요리. 고구마튀김·고구마맛탕·군고구마 세트.", address: "경기도 여주시 여흥동 여주로 88", image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80", tags: ["고구마", "특산물", "디저트"] },
  ],

  양평군: [
    { id: 1, name: "두물머리 뷰 카페", category: "양식", rating: 4.9, reviews: 512, description: "남한강과 북한강이 만나는 두물머리의 감성 카페. 물안개와 함께하는 최고의 뷰.", address: "경기도 양평군 양서면 양수리 두물머리길 100", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80", tags: ["뷰맛집", "두물머리", "카페"] },
    { id: 2, name: "양평 장국밥", category: "한식", rating: 4.7, reviews: 389, description: "양평 전통 장국밥. 구수한 된장 베이스에 각종 채소가 들어간 건강한 한 끼.", address: "경기도 양평군 양평읍 양평로 55", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", tags: ["장국밥", "전통", "건강식"] },
    { id: 3, name: "용문사 산채 비빔밥", category: "한식", rating: 4.8, reviews: 278, description: "용문산 등산 후 즐기는 신선한 산채 비빔밥. 용문사 인근에서 채취한 나물로 만듦.", address: "경기도 양평군 용문면 용문산로 782", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80", tags: ["산채비빔밥", "용문사", "등산후"] },
    { id: 4, name: "양평 한우 마을", category: "한식", rating: 4.7, reviews: 445, description: "양평 청정 자연에서 키운 한우 전문 단지. 1등급 한우를 직판 가격으로 즐기는 한우 마을.", address: "경기도 양평군 강상면 병산리 한우마을길 33", image: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80", tags: ["한우", "직판", "청정"] },
    { id: 5, name: "양평 유기농 레스토랑", category: "양식", rating: 4.6, reviews: 198, description: "양평 유기농 농산물로 만드는 건강한 레스토랑. 제철 채소 샐러드와 유기농 파스타.", address: "경기도 양평군 양평읍 중앙로 200", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80", tags: ["유기농", "건강식", "파스타"] },
    { id: 6, name: "강변 민물 매운탕", category: "한식", rating: 4.5, reviews: 334, description: "남한강 강변에서 즐기는 민물 매운탕. 빠가사리와 메기가 들어간 칼칼한 강 매운탕.", address: "경기도 양평군 양평읍 강변로 77", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80", tags: ["매운탕", "강변", "민물고기"] },
  ],

  // ──────────────────────────────────────────
  // 경기 북부
  // ──────────────────────────────────────────

  고양시: [
    { id: 1, name: "일산 장어구이", category: "한식", rating: 4.8, reviews: 356, description: "서해 갯벌 민물장어를 숯불에 구운 일산 대표 맛집. 달콤한 양념과 고소한 장어의 조화.", address: "경기도 고양시 일산서구 일산로 210", image: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80", tags: ["장어", "숯불", "보양식"] },
    { id: 2, name: "킨텍스 한식 뷔페", category: "한식", rating: 4.5, reviews: 478, description: "킨텍스 인근 대형 한식 뷔페. 50여 가지 한식 메뉴를 합리적인 가격에 즐길 수 있음.", address: "경기도 고양시 일산서구 킨텍스로 217", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80", tags: ["뷔페", "한식", "가족"] },
    { id: 3, name: "화정 일식집", category: "일식", rating: 4.6, reviews: 201, description: "화정역 인근 정통 일식. 가성비 좋은 정식 메뉴와 신선한 회가 인기.", address: "경기도 고양시 덕양구 화정로 99", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80", tags: ["일식", "회", "가성비"] },
    { id: 4, name: "대화 마라샹궈", category: "중식", rating: 4.4, reviews: 334, description: "직접 볶아주는 마라샹궈. 매운 정도를 고를 수 있어 다양한 입맛에 맞춤 가능.", address: "경기도 고양시 일산동구 대화로 55", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80", tags: ["마라샹궈", "중식", "매운맛"] },
    { id: 5, name: "일산 호수 뷰 레스토랑", category: "양식", rating: 4.9, reviews: 287, description: "일산 호수공원 바로 옆 뷰 레스토랑. 호수 전망을 보며 즐기는 코스 요리.", address: "경기도 고양시 일산동구 호수로 731", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80", tags: ["뷰맛집", "코스요리", "데이트"] },
    { id: 6, name: "백석 해물탕", category: "한식", rating: 4.7, reviews: 412, description: "서해 직송 해산물로 끓이는 얼큰한 해물탕. 랍스터부터 조개까지 푸짐하게 담아냄.", address: "경기도 고양시 일산동구 백석로 100", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80", tags: ["해물탕", "해산물", "푸짐"] },
    { id: 7, name: "주엽 떡볶이 전문점", category: "한식", rating: 4.3, reviews: 523, description: "즉석에서 끓이는 국물 떡볶이. 쫀득한 떡과 어묵의 조화. 고양 현지인 최애 분식집.", address: "경기도 고양시 일산서구 주엽로 40", image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80", tags: ["떡볶이", "분식", "현지인추천"] },
  ],

  구리시: [
    { id: 1, name: "한강 로드 카페", category: "양식", rating: 4.7, reviews: 312, description: "한강 조망이 일품인 구리 카페거리. 테라스에서 즐기는 브런치와 커피.", address: "경기도 구리시 토평동 한강로 100", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80", tags: ["한강뷰", "카페", "브런치"] },
    { id: 2, name: "교문동 감자탕", category: "한식", rating: 4.6, reviews: 289, description: "구리 교문동의 30년 전통 감자탕. 뼈 속까지 부드럽게 익힌 돼지 뼈와 감자의 조화.", address: "경기도 구리시 교문로 55", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", tags: ["감자탕", "전통", "뼈국물"] },
    { id: 3, name: "인창동 순대볶음", category: "한식", rating: 4.5, reviews: 345, description: "구리 인창동 명물 순대볶음. 철판에 볶아내는 매콤달콤한 순대볶음이 시그니처.", address: "경기도 구리시 인창동 동구릉로 33", image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80", tags: ["순대볶음", "분식", "철판"] },
    { id: 4, name: "동구릉 숲속 한정식", category: "한식", rating: 4.8, reviews: 167, description: "동구릉 인근 고즈넉한 한정식집. 왕릉 숲을 바라보며 즐기는 전통 한상 차림.", address: "경기도 구리시 인창동 동구릉로 197", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80", tags: ["한정식", "동구릉", "전통"] },
    { id: 5, name: "구리 왕십리 곱창", category: "한식", rating: 4.5, reviews: 412, description: "서울 왕십리 곱창거리와 연결되는 구리 곱창 골목. 신선한 소 곱창을 직화로 구워 먹음.", address: "경기도 구리시 수택동 경춘로 77", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80", tags: ["곱창", "직화", "골목"] },
    { id: 6, name: "구리 아차산 닭볶음탕", category: "한식", rating: 4.6, reviews: 278, description: "아차산 등산 후 즐기는 매콤한 닭볶음탕. 감자와 고구마가 들어간 푸짐한 한 솥.", address: "경기도 구리시 아천동 아차산로 88", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80", tags: ["닭볶음탕", "아차산", "등산후"] },
  ],

  남양주시: [
    { id: 1, name: "북한강 카페거리", category: "양식", rating: 4.8, reviews: 534, description: "북한강을 따라 늘어선 감성 카페거리. 강 위에 떠있는 듯한 뷰 카페들이 즐비.", address: "경기도 남양주시 조안면 북한강로 655", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80", tags: ["북한강뷰", "카페", "드라이브"] },
    { id: 2, name: "능내리 물고기 매운탕", category: "한식", rating: 4.7, reviews: 389, description: "팔당호 인근 민물매운탕 전문점. 남양주 특유의 진한 매운탕 맛이 일품.", address: "경기도 남양주시 조안면 능내리 다산로 200", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80", tags: ["매운탕", "민물고기", "팔당"] },
    { id: 3, name: "마석 닭갈비", category: "한식", rating: 4.5, reviews: 312, description: "남양주 마석의 특제 소스 닭갈비. 춘천식과 다른 마석만의 깊은 양념이 특징.", address: "경기도 남양주시 화도읍 마석우리 경춘로 100", image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80", tags: ["닭갈비", "마석", "특제소스"] },
    { id: 4, name: "다산 신도시 파스타", category: "양식", rating: 4.6, reviews: 234, description: "다산 신도시의 트렌디한 이탈리안 레스토랑. 생면 파스타와 화덕 피자가 인기.", address: "경기도 남양주시 다산동 다산중앙로 200", image: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80", tags: ["파스타", "다산신도시", "이탈리안"] },
    { id: 5, name: "천마산 산채 정식", category: "한식", rating: 4.7, reviews: 178, description: "천마산 등산로 인근 산채 정식. 직접 채취한 나물과 제철 식재료로 차린 건강 밥상.", address: "경기도 남양주시 화도읍 천마산로 55", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80", tags: ["산채정식", "천마산", "건강식"] },
    { id: 6, name: "별내 일식 오마카세", category: "일식", rating: 4.8, reviews: 145, description: "별내 신도시의 프리미엄 오마카세. 당일 수산시장에서 직접 구입한 신선한 재료 사용.", address: "경기도 남양주시 별내동 별내대로 300", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80", tags: ["오마카세", "별내", "프리미엄"] },
  ],

  동두천시: [
    { id: 1, name: "소요산 산채 비빔밥", category: "한식", rating: 4.7, reviews: 289, description: "소요산 등산로 입구의 산채 비빔밥. 봄 나물이 풍성하게 올라간 건강한 한 끼.", address: "경기도 동두천시 상봉암동 소요산로 100", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80", tags: ["산채비빔밥", "소요산", "등산후"] },
    { id: 2, name: "동두천 부대찌개", category: "한식", rating: 4.6, reviews: 445, description: "평택 송탄과 함께 부대찌개의 양대 성지. 미군 부대 문화가 만들어낸 동두천 스타일 부대찌개.", address: "경기도 동두천시 중앙로 200", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80", tags: ["부대찌개", "미군부대", "동두천"] },
    { id: 3, name: "생연동 한우 직판장", category: "한식", rating: 4.8, reviews: 234, description: "산지 직송 한우를 저렴하게 즐기는 한우 직판 식당. 1등급 한우를 산지 가격으로.", address: "경기도 동두천시 생연동 동두천로 77", image: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80", tags: ["한우", "직판", "가성비"] },
    { id: 4, name: "동두천 냉면", category: "한식", rating: 4.5, reviews: 312, description: "이북 실향민들이 전수한 정통 평양냉면. 동두천에서 맛보는 진짜 평양냉면의 맛.", address: "경기도 동두천시 중앙로 55", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", tags: ["평양냉면", "이북식", "전통"] },
    { id: 5, name: "보산동 세계 음식 거리", category: "양식", rating: 4.4, reviews: 267, description: "보산동 외국인 관광 특구의 세계 음식 거리. 멕시코·태국·인도 등 다양한 국적의 음식.", address: "경기도 동두천시 보산동 외국인관광특구로 33", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80", tags: ["세계음식", "이색", "외국인거리"] },
  ],

  양주시: [
    { id: 1, name: "장흥 유원지 닭백숙", category: "한식", rating: 4.7, reviews: 378, description: "장흥 유원지 계곡 인근 토종닭 백숙. 시원한 계곡 물소리를 들으며 먹는 보양식.", address: "경기도 양주시 장흥면 권율로 193", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80", tags: ["닭백숙", "계곡", "보양식"] },
    { id: 2, name: "양주 송추 갈비", category: "한식", rating: 4.8, reviews: 456, description: "북한산과 도봉산 사이 송추계곡 인근의 갈비집. 등산 후 즐기는 두툼한 생갈비.", address: "경기도 양주시 장흥면 송추계곡로 100", image: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80", tags: ["갈비", "송추계곡", "등산후"] },
    { id: 3, name: "고읍 순대국밥", category: "한식", rating: 4.5, reviews: 312, description: "양주 고읍의 전통 순대국밥. 직접 만든 찹쌀순대와 진한 뼈 육수가 일품.", address: "경기도 양주시 고읍동 고읍로 55", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", tags: ["순대국밥", "찹쌀순대", "전통"] },
    { id: 4, name: "옥정 신도시 라멘", category: "일식", rating: 4.6, reviews: 198, description: "옥정 신도시의 일본 감성 라멘 전문점. 진한 돈코츠 육수와 쫄깃한 면발.", address: "경기도 양주시 옥정동 옥정로 200", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80", tags: ["라멘", "돈코츠", "옥정신도시"] },
    { id: 5, name: "양주 산정호수 카페", category: "양식", rating: 4.7, reviews: 234, description: "산정호수 전경이 펼쳐지는 감성 카페. 호수 뷰 테라스에서 즐기는 커피와 디저트.", address: "경기도 양주시 남면 황방리 호수로 88", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80", tags: ["카페", "호수뷰", "감성"] },
  ],

  의정부시: [
    { id: 1, name: "의정부 부대찌개 골목", category: "한식", rating: 4.9, reviews: 734, description: "의정부 부대찌개 골목은 전국 3대 부대찌개 성지. 50년 이상 이어온 전통의 맛.", address: "경기도 의정부시 의정부동 부대찌개골목길 1", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80", tags: ["부대찌개", "성지", "전통"] },
    { id: 2, name: "가능동 닭갈비", category: "한식", rating: 4.6, reviews: 345, description: "의정부 가능동의 명물 닭갈비. 춘천식과는 다른 의정부 스타일의 진한 양념 닭갈비.", address: "경기도 의정부시 가능동 시민로 55", image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80", tags: ["닭갈비", "가능동", "의정부"] },
    { id: 3, name: "의정부 냉면", category: "한식", rating: 4.7, reviews: 412, description: "이북 출신 주인장이 운영하는 정통 평양냉면. 의정부 실향민 문화가 낳은 냉면 명가.", address: "경기도 의정부시 의정부동 의정로 100", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", tags: ["평양냉면", "이북식", "전통"] },
    { id: 4, name: "민락동 초밥집", category: "일식", rating: 4.5, reviews: 267, description: "의정부 민락 신도시의 신선한 초밥 전문점. 당일 수산시장 직송 생선으로 만드는 초밥.", address: "경기도 의정부시 민락동 민락로 200", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80", tags: ["초밥", "신선", "민락동"] },
    { id: 5, name: "의정부 짬뽕거리", category: "중식", rating: 4.6, reviews: 389, description: "의정부에서만 맛볼 수 있는 특제 짬뽕 골목. 각 집마다 다른 비법 육수가 특징.", address: "경기도 의정부시 의정부2동 평화로 77", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80", tags: ["짬뽕", "골목", "비법육수"] },
    { id: 6, name: "송산동 삼겹살 골목", category: "한식", rating: 4.5, reviews: 456, description: "의정부 송산동에 형성된 삼겹살 골목. 저렴하고 푸짐한 직화 삼겹살집들이 밀집.", address: "경기도 의정부시 송산동 도봉로 33", image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80", tags: ["삼겹살", "골목", "직화"] },
  ],

  파주시: [
    { id: 1, name: "헤이리 감성 카페 브런치", category: "양식", rating: 4.8, reviews: 312, description: "헤이리 예술마을 속 감성 카페. 아트 공간과 맛이 어우러진 브런치 메뉴가 유명.", address: "경기도 파주시 탄현면 헤이리마을길 93", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80", tags: ["브런치", "감성", "헤이리"] },
    { id: 2, name: "파주 장단콩 두부요리", category: "한식", rating: 4.7, reviews: 245, description: "파주 장단콩으로 만든 순두부와 두부 정식. 고소하고 담백한 두부 요리 전문점.", address: "경기도 파주시 문산읍 통일로 678", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80", tags: ["두부", "장단콩", "건강식"] },
    { id: 3, name: "임진각 참게장", category: "한식", rating: 4.6, reviews: 189, description: "임진강에서 잡은 참게로 담근 간장게장. 밥도둑으로 유명한 파주 특산 음식.", address: "경기도 파주시 문산읍 임진각로 148", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80", tags: ["간장게장", "참게", "특산물"] },
    { id: 4, name: "출판도시 라멘바", category: "일식", rating: 4.5, reviews: 134, description: "파주 출판도시의 독특한 분위기 속 라멘바. 독서와 라멘을 함께 즐기는 콘셉트.", address: "경기도 파주시 회동길 145", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80", tags: ["라멘", "출판도시", "감성"] },
    { id: 5, name: "파주 오두산 매운갈비찜", category: "한식", rating: 4.8, reviews: 378, description: "한강과 임진강이 만나는 오두산 인근 명물. 매콤달콤한 갈비찜이 인기 메뉴.", address: "경기도 파주시 탄현면 성동로 660", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80", tags: ["갈비찜", "매운맛", "뷰맛집"] },
    { id: 6, name: "프로방스 마을 유럽식 레스토랑", category: "양식", rating: 4.7, reviews: 267, description: "파주 프로방스 마을의 유럽풍 레스토랑. 프랑스 가정식 코스 요리를 즐길 수 있음.", address: "경기도 파주시 탄현면 새오리로 69", image: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80", tags: ["유럽식", "프로방스", "코스요리"] },
  ],

  포천시: [
    { id: 1, name: "이동 갈비", category: "한식", rating: 4.9, reviews: 589, description: "포천 이동 갈비는 전국 3대 갈비 성지. 두툼하고 부드러운 생갈비를 숯불에 구워 먹음.", address: "경기도 포천시 이동면 이동갈비로 50", image: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80", tags: ["이동갈비", "성지", "숯불"] },
    { id: 2, name: "포천 아트밸리 카페", category: "양식", rating: 4.7, reviews: 312, description: "포천 아트밸리 인근 감성 카페. 화강암 채석장이 만들어낸 호수 뷰가 환상적.", address: "경기도 포천시 신북면 아트밸리로 234", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80", tags: ["카페", "아트밸리", "호수뷰"] },
    { id: 3, name: "신북 온천 주변 삼계탕", category: "한식", rating: 4.6, reviews: 278, description: "포천 신북 온천 온천욕 후 즐기는 진한 삼계탕. 인삼과 황기가 가득한 보양 한 끼.", address: "경기도 포천시 신북면 온천로 77", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80", tags: ["삼계탕", "온천후", "보양식"] },
    { id: 4, name: "산정호수 송어회", category: "한식", rating: 4.8, reviews: 345, description: "산정호수 청정 냉수에서 키운 송어 회와 송어 매운탕 세트. 포천의 명물 민물 요리.", address: "경기도 포천시 영북면 산정호수로 411", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80", tags: ["송어회", "산정호수", "민물요리"] },
    { id: 5, name: "포천 막걸리 양조장 식당", category: "한식", rating: 4.5, reviews: 234, description: "포천 막걸리 양조장에서 직접 운영하는 식당. 신선한 생막걸리와 어울리는 전통 안주.", address: "경기도 포천시 소흘읍 이동교로 200", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80", tags: ["막걸리", "양조장", "전통안주"] },
    { id: 6, name: "허브아일랜드 레스토랑", category: "양식", rating: 4.6, reviews: 189, description: "허브아일랜드 내 허브 요리 전문 레스토랑. 직접 재배한 허브로 만드는 유럽식 요리.", address: "경기도 포천시 신북면 청신로 2247", image: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80", tags: ["허브요리", "유럽식", "허브아일랜드"] },
  ],

  연천군: [
    { id: 1, name: "한탄강 민물매운탕", category: "한식", rating: 4.8, reviews: 312, description: "한탄강에서 잡은 신선한 민물고기로 끓인 매운탕. 경기 북부 최고의 강 매운탕 명가.", address: "경기도 연천군 전곡읍 한탄로 100", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80", tags: ["매운탕", "한탄강", "민물고기"] },
    { id: 2, name: "연천 고구마 돼지갈비", category: "한식", rating: 4.6, reviews: 234, description: "연천 특산 고구마를 넣어 구운 돼지갈비. 달콤한 고구마 향이 배어드는 독특한 갈비.", address: "경기도 연천군 연천읍 연천로 55", image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80", tags: ["돼지갈비", "고구마", "특산물"] },
    { id: 3, name: "전곡리 구석기 체험 식당", category: "한식", rating: 4.4, reviews: 178, description: "전곡리 구석기 유적지 인근 체험형 식당. 화덕에 구운 고기와 전통 방식 요리 체험.", address: "경기도 연천군 전곡읍 양연로 1510", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80", tags: ["체험식당", "구석기", "화덕구이"] },
    { id: 4, name: "연천 율무 한정식", category: "한식", rating: 4.7, reviews: 156, description: "연천 특산 율무로 만드는 건강 한정식. 율무밥·율무차·율무 전까지 율무 풀코스.", address: "경기도 연천군 연천읍 차탄로 33", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80", tags: ["율무", "한정식", "특산물"] },
    { id: 5, name: "재인폭포 인근 삼겹살", category: "한식", rating: 4.5, reviews: 267, description: "재인폭포 트레킹 후 즐기는 직화 삼겹살. 자연 속에서 먹는 바베큐의 특별함.", address: "경기도 연천군 연천읍 고문리 폭포로 100", image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80", tags: ["삼겹살", "재인폭포", "트레킹후"] },
  ],

  가평군: [
    { id: 1, name: "자라섬 카페 레스토랑", category: "양식", rating: 4.8, reviews: 489, description: "자라섬 재즈 페스티벌로 유명한 가평의 명소. 북한강 뷰를 보며 즐기는 브런치.", address: "경기도 가평군 가평읍 자라섬로 60", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80", tags: ["자라섬", "북한강뷰", "브런치"] },
    { id: 2, name: "잣향기 푸른숲 잣 요리", category: "한식", rating: 4.7, reviews: 312, description: "가평 특산 잣으로 만드는 잣죽·잣칼국수·잣 정식. 고소한 잣의 풍미가 가득한 특산 요리.", address: "경기도 가평군 가평읍 북한강변로 100", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80", tags: ["잣요리", "특산물", "가평잣"] },
    { id: 3, name: "청평 붕어찜", category: "한식", rating: 4.6, reviews: 378, description: "청평호 인근 붕어찜 전문점. 청평호 민물 붕어를 매콤하게 쪄낸 가평 향토 음식.", address: "경기도 가평군 청평면 청평리 호반로 200", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80", tags: ["붕어찜", "청평호", "향토음식"] },
    { id: 4, name: "아침고요 수목원 카페", category: "양식", rating: 4.9, reviews: 534, description: "아침고요 수목원 내 카페. 사계절 꽃과 나무를 바라보며 즐기는 커피와 디저트.", address: "경기도 가평군 상면 수목원로 432", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80", tags: ["카페", "수목원", "아침고요"] },
    { id: 5, name: "가평 닭갈비", category: "한식", rating: 4.6, reviews: 445, description: "춘천 닭갈비의 원류를 잇는 가평식 닭갈비. 옥수수와 감자가 함께 들어간 푸짐한 철판 닭갈비.", address: "경기도 가평군 가평읍 가평로 55", image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80", tags: ["닭갈비", "가평", "철판"] },
    { id: 6, name: "이화원 중식당", category: "중식", rating: 4.5, reviews: 234, description: "가평 관광지 인근의 정통 중화요리. 코스 요리로 즐기는 팔보채와 북경오리가 인기.", address: "경기도 가평군 가평읍 가화로 100", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80", tags: ["중화요리", "북경오리", "코스"] },
    { id: 7, name: "북한강 송어축제 송어회", category: "한식", rating: 4.7, reviews: 389, description: "겨울 송어축제로 유명한 가평. 얼음 낚시로 잡은 송어를 즉석에서 회로 즐기는 특별한 경험.", address: "경기도 가평군 가평읍 북한강변로 200", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80", tags: ["송어회", "축제", "겨울"] },
  ],

  // ──────────────────────────────────────────
  // 기본 fallback
  // ──────────────────────────────────────────
  default: [
    { id: 1, name: "경기도 전통 한정식", category: "한식", rating: 4.7, reviews: 289, description: "경기도 지역 특산 식재료로 차린 전통 한정식. 정갈한 반찬과 구수한 된장찌개.", address: "경기도", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80", tags: ["한정식", "전통", "경기도"] },
    { id: 2, name: "경기 로컬 갈비집", category: "한식", rating: 4.6, reviews: 378, description: "지역민이 사랑하는 숯불 갈비집. 두툼한 생갈비를 직접 구워 먹는 방식.", address: "경기도", image: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80", tags: ["갈비", "숯불", "로컬"] },
    { id: 3, name: "경기 해장국", category: "한식", rating: 4.5, reviews: 412, description: "경기도 로컬 해장국집. 새벽부터 끓이는 구수한 뼈해장국이 유명.", address: "경기도", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", tags: ["해장국", "아침", "뼈국물"] },
  ],
};

/**
 * 지역명으로 먹거리 데이터를 반환
 * @param {string} regionName - 지역명 (예: "수원시", "성남시")
 * @returns {Array} 해당 지역의 먹거리 배열
 */
export function getFoodDataByRegion(regionName) {
  if (!regionName) return foodDataByRegion.default;
  return foodDataByRegion[regionName] ?? foodDataByRegion.default;
}

export default foodDataByRegion;