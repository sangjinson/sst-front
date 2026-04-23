import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// ----------------------------------------------------
// 1. 배너 이미지 설정 영역 (여기에 이미지 주소를 넣으시면 됩니다!)
// ----------------------------------------------------
const bannerImages = {
  '수원시': 'https://images.unsplash.com/photo-1605833989399-52e8548a3dae?auto=format&fit=crop&w=1920&q=80', // 수원화성 느낌의 전통 건축물
  '화성시': 'https://images.unsplash.com/photo-1590393275627-0c46bc8ea23c?auto=format&fit=crop&w=1920&q=80', // 화성행궁 느낌의 고즈넉한 풍경
  '부천시': 'https://images.unsplash.com/photo-1570198083995-1f6cc9709d07?auto=format&fit=crop&w=1920&q=80', // 부천 도심 야경/공원 느낌
  '용인시': 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1920&q=80', // 놀이공원/자연 느낌의 이국적 풍경
  '고양시': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=80', // 호수공원 느낌의 수변 풍경
};

const defaultBanner = 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1920&q=80';

// ----------------------------------------------------
// 2. 지역별 통합 더미 데이터 (각 5개씩 존재)
// ----------------------------------------------------
const regionData = {
  '수원시': {
    streetList: [
      { id: 1, title: '행리단길', location: '신풍동 일대', img: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=400&q=80' },
      { id: 2, title: '수원 통닭거리', location: '팔달로 일대', img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=400&q=80' },
      { id: 3, title: '나혜석거리', location: '인계동', img: 'https://images.unsplash.com/photo-1542314831-c6a4d14eff40?auto=format&fit=crop&w=400&q=80' },
      { id: 4, title: '지동시장 순대타운길', location: '지동', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80' },
      { id: 5, title: '공방거리', location: '팔달문 인근', img: 'https://images.unsplash.com/photo-1524850301259-7729d41d11d9?auto=format&fit=crop&w=400&q=80' },
    ],
    attractions: [
      { id: 1, tag: '볼거리', title: '수원화성', desc: '유네스코 세계문화유산, 조선시대 성곽 건축의 꽃', img: 'https://images.unsplash.com/photo-1590393275627-0c46bc8ea23c?auto=format&fit=crop&w=400&q=80' },
      { id: 2, tag: '볼거리', title: '화성행궁', desc: '정조대왕이 머물던 아름답고 웅장한 행궁', img: 'https://images.unsplash.com/photo-1582236528775-68b42fc06bf6?auto=format&fit=crop&w=400&q=80' },
      { id: 3, tag: '볼거리', title: '방화수류정', desc: '아름다운 연못과 성곽이 어우러진 야경 명소', img: 'https://images.unsplash.com/photo-1605833989399-52e8548a3dae?auto=format&fit=crop&w=400&q=80' },
      { id: 4, tag: '볼거리', title: '플라잉수원', desc: '열기구를 타고 하늘에서 내려다보는 수원의 파노라마', img: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=400&q=80' },
      { id: 5, tag: '볼거리', title: '광교호수공원', desc: '도심 속 거대한 호수와 환상적인 야경', img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=400&q=80' },
    ],
    activities: [
      { id: 1, tag: '잘거리', title: '행궁동 한옥스테이', desc: '고즈넉한 분위기에서 즐기는 특별한 하룻밤', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80' },
      { id: 2, tag: '놀거리', title: '화성어차 탑승', desc: '왕의 가마를 모티브로 한 관광열차 투어', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80' },
      { id: 3, tag: '놀거리', title: '아쿠아플라넷 광교', desc: '도심 속에서 만나는 신비로운 바닷속 탐험', img: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=400&q=80' },
      { id: 4, tag: '놀거리', title: '연무대 국궁체험', desc: '조선시대 군사들이 무예를 연마하던 곳에서 활쏘기', img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80' },
      { id: 5, tag: '잘거리', title: '광교 비즈니스 호텔', desc: '깔끔하고 모던한 도심 속 호캉스', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80' },
    ],
    foods: [
      { id: 1, tag: '먹거리', title: '수원왕갈비', desc: '수원을 대표하는 부드럽고 달콤한 양념갈비', img: 'https://images.unsplash.com/photo-1544025162-811114215b22?auto=format&fit=crop&w=400&q=80' },
      { id: 2, tag: '먹거리', title: '수원 통닭', desc: '가마솥에 튀겨내어 바삭함이 살아있는 통닭', img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80' },
      { id: 3, tag: '먹거리', title: '지동시장 순대볶음', desc: '철판에 볶아먹는 매콤달콤 푸짐한 순대볶음', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80' },
      { id: 4, tag: '먹거리', title: '보영만두', desc: '수원 시민들의 소울푸드, 쫄면과 만두의 조합', img: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=400&q=80' },
      { id: 5, tag: '먹거리', title: '행궁동 감성 디저트', desc: '한옥 뷰를 바라보며 즐기는 커피와 케이크', img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  '화성시': {
    streetList: [
      { id: 1, title: '제부도 해안길', location: '서신면 제부리', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80' },
      { id: 2, title: '동탄 센트럴파크 카페거리', location: '반송동', img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80' },
      { id: 3, title: '궁평항 해물거리', location: '서신면 궁평리', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80' },
      { id: 4, title: '향남 로데오거리', location: '향남읍', img: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=400&q=80' },
      { id: 5, title: '융건릉 산책로', location: '안녕동', img: 'https://images.unsplash.com/photo-1542314831-c6a4d14eff40?auto=format&fit=crop&w=400&q=80' },
    ],
    attractions: [
      { id: 1, tag: '볼거리', title: '제부도 모세의 기적', desc: '하루 두 번 바닷길이 열리는 신비의 섬', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80' },
      { id: 2, tag: '볼거리', title: '전곡항', desc: '이국적인 요트들이 정박해 있는 아름다운 항구', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80' },
      { id: 3, tag: '볼거리', title: '동탄 호수공원', desc: '루나쇼와 함께하는 세련된 수변 공원', img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=400&q=80' },
      { id: 4, tag: '볼거리', title: '융건릉', desc: '사도세자와 정조가 잠든 고즈넉한 세계문화유산', img: 'https://images.unsplash.com/photo-1590393275627-0c46bc8ea23c?auto=format&fit=crop&w=400&q=80' },
      { id: 5, tag: '볼거리', title: '우리꽃식물원', desc: '우리 땅에서 자라는 아름다운 자생식물들의 보금자리', img: 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=400&q=80' },
    ],
    activities: [
      { id: 1, tag: '놀거리', title: '서해랑 해상케이블카', desc: '제부도 바다 위를 가로지르는 아찔한 비행', img: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=400&q=80' },
      { id: 2, tag: '놀거리', title: '전곡항 요트 체험', desc: '푸른 바다를 가르는 럭셔리한 해양 레저', img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80' },
      { id: 3, tag: '잘거리', title: '율암온천 숯가마', desc: '천연 온천수와 참숯가마에서 즐기는 힐링', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80' },
      { id: 4, tag: '놀거리', title: '동탄 루나쇼 관람', desc: '밤하늘을 수놓는 화려한 호수공원 분수쇼', img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=400&q=80' },
      { id: 5, tag: '잘거리', title: '롤링힐스 호텔', desc: '자연 속에 파묻혀 즐기는 프라이빗 호캉스', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80' },
    ],
    foods: [
      { id: 1, tag: '먹거리', title: '궁평항 바지락칼국수', desc: '서해 바다의 시원함이 가득 담긴 국물', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80' },
      { id: 2, tag: '먹거리', title: '제부도 조개구이', desc: '파도 소리를 들으며 구워 먹는 싱싱한 해산물', img: 'https://images.unsplash.com/photo-1599084990807-6f68bf2be8a3?auto=format&fit=crop&w=400&q=80' },
      { id: 3, tag: '먹거리', title: '동탄 브런치', desc: '분위기 좋은 카페거리에서 즐기는 여유로운 식사', img: 'https://images.unsplash.com/photo-1495474472207-464a47e452cd?auto=format&fit=crop&w=400&q=80' },
      { id: 4, tag: '먹거리', title: '발안 만세시장 국밥', desc: '전통 시장의 정이 넘치는 든든한 소머리국밥', img: 'https://images.unsplash.com/photo-1583182332473-b31c07318d1a?auto=format&fit=crop&w=400&q=80' },
      { id: 5, tag: '먹거리', title: '남양 한우', desc: '입안에서 살살 녹는 고품질 화성 한우 구이', img: 'https://images.unsplash.com/photo-1544025162-811114215b22?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  '부천시': {
    streetList: [
      { id: 1, title: '밤리단길 (밤가시마을)', location: '일산동구', img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80' },
      { id: 2, title: '부천역 로데오거리', location: '심곡동', img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=400&q=80' },
      { id: 3, title: '상동 카페거리', location: '상동', img: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=400&q=80' },
      { id: 4, title: '신중동 먹자골목', location: '중동', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80' },
      { id: 5, title: '부천 만화의 거리', location: '상동', img: 'https://images.unsplash.com/photo-1524850301259-7729d41d11d9?auto=format&fit=crop&w=400&q=80' },
    ],
    attractions: [
      { id: 1, tag: '볼거리', title: '한국만화박물관', desc: '한국 만화의 역사와 현재를 한눈에 볼 수 있는 곳', img: 'https://images.unsplash.com/photo-1582236528775-68b42fc06bf6?auto=format&fit=crop&w=400&q=80' },
      { id: 2, tag: '볼거리', title: '부천 자연생태공원', desc: '도심 속 산소탱크, 수목원과 식물원의 조화', img: 'https://images.unsplash.com/photo-1542314831-c6a4d14eff40?auto=format&fit=crop&w=400&q=80' },
      { id: 3, tag: '볼거리', title: '부천 백만송이 장미원', desc: '매년 5월, 화려한 장미가 만개하는 로맨틱 스팟', img: 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=400&q=80' },
      { id: 4, tag: '볼거리', title: '부천호수식물원 수피아', desc: '상동호수공원 내 위치한 이국적인 온실 식물원', img: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=400&q=80' },
      { id: 5, tag: '볼거리', title: '부천천문과학관', desc: '별과 우주의 신비를 탐구하는 도심 속 천문대', img: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=400&q=80' },
    ],
    activities: [
      { id: 1, tag: '놀거리', title: '만화 드로잉 체험', desc: '만화박물관에서 직접 나만의 캐릭터 그려보기', img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&q=80' },
      { id: 2, tag: '놀거리', title: '상동호수공원 피크닉', desc: '넓은 잔디밭에서 즐기는 여유로운 오후', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80' },
      { id: 3, tag: '놀거리', title: '플레이아쿠아리움 부천', desc: '해양 생물부터 정글 동물까지 만나는 실내 동물원', img: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=400&q=80' },
      { id: 4, tag: '잘거리', title: '부천 도심 레지던스', desc: '교통이 편리한 부천 도심에서의 편안한 숙박', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80' },
      { id: 5, tag: '놀거리', title: '별자리 관측', desc: '천문과학관 망원경으로 밤하늘 별 찾기', img: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=400&q=80' },
    ],
    foods: [
      { id: 1, tag: '먹거리', title: '작동 홍두깨칼국수', desc: '진한 바지락 육수와 쫄깃한 수타면의 조화', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80' },
      { id: 2, tag: '먹거리', title: '까치울 카페거리 커피', desc: '전원주택 단지 속 아기자기한 감성 카페 탐방', img: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=400&q=80' },
      { id: 3, tag: '먹거리', title: '신중동역 곱창', desc: '퇴근길 직장인들의 발길을 사로잡는 고소한 곱창구이', img: 'https://images.unsplash.com/photo-1544025162-811114215b22?auto=format&fit=crop&w=400&q=80' },
      { id: 4, tag: '먹거리', title: '부천역 마늘떡볶이', desc: '알싸한 마늘향이 매력적인 중독성 강한 분식', img: 'https://images.unsplash.com/photo-1583182332473-b31c07318d1a?auto=format&fit=crop&w=400&q=80' },
      { id: 5, tag: '먹거리', title: '상동 양꼬치거리', desc: '이국적인 향신료와 함께 즐기는 숯불 양꼬치', img: 'https://images.unsplash.com/photo-1544025162-811114215b22?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  '용인시': {
    streetList: [
      { id: 1, title: '보정동 카페거리', location: '기흥구 보정동', img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80' },
      { id: 2, title: '에버랜드 로맨틱 에비뉴', location: '처인구 포곡읍', img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=400&q=80' },
      { id: 3, title: '용인 중앙시장 길', location: '처인구 김량장동', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80' },
      { id: 4, title: '기흥 호수공원 산책로', location: '기흥구', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80' },
      { id: 5, title: '역북동 대학로', location: '처인구 역북동', img: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=400&q=80' },
    ],
    attractions: [
      { id: 1, tag: '볼거리', title: '에버랜드', desc: '국내 최대 규모의 짜릿한 테마파크와 사파리', img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=400&q=80' },
      { id: 2, tag: '볼거리', title: '한국민속촌', desc: '조선시대로 타임슬립! 전통 문화 테마파크', img: 'https://images.unsplash.com/photo-1590393275627-0c46bc8ea23c?auto=format&fit=crop&w=400&q=80' },
      { id: 3, tag: '볼거리', title: '호암미술관', desc: '아름다운 희원(전통정원)과 수준 높은 미술품 전시', img: 'https://images.unsplash.com/photo-1582236528775-68b42fc06bf6?auto=format&fit=crop&w=400&q=80' },
      { id: 4, tag: '볼거리', title: '백남준아트센터', desc: '비디오 아트의 거장, 백남준의 예술 세계 탐구', img: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=400&q=80' },
      { id: 5, tag: '볼거리', title: '용인 농촌테마파크', desc: '자연 속에서 즐기는 농경문화 체험과 꽃 구경', img: 'https://images.unsplash.com/photo-1542314831-c6a4d14eff40?auto=format&fit=crop&w=400&q=80' },
    ],
    activities: [
      { id: 1, tag: '놀거리', title: '티익스프레스 탑승', desc: '아찔한 속도감을 자랑하는 우든 코스터', img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=400&q=80' },
      { id: 2, tag: '놀거리', title: '민속촌 한복 체험', desc: '고운 한복을 입고 조선시대 저잣거리 걷기', img: 'https://images.unsplash.com/photo-1590393275627-0c46bc8ea23c?auto=format&fit=crop&w=400&q=80' },
      { id: 3, tag: '놀거리', title: '짚라인 용인', desc: '자연휴양림 숲속을 가로지르는 짜릿한 비행', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80' },
      { id: 4, tag: '잘거리', title: '자연휴양림 숲속의 집', desc: '맑은 공기를 마시며 즐기는 산속 펜션 휴양', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80' },
      { id: 5, tag: '놀거리', title: '캐리비안베이', desc: '여름을 시원하게 날려버릴 짜릿한 워터파크', img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80' },
    ],
    foods: [
      { id: 1, tag: '먹거리', title: '백암순대', desc: '야채와 고기가 듬뿍 들어간 용인 백암면의 명물', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80' },
      { id: 2, tag: '먹거리', title: '고기리 막국수', desc: '들기름 향이 솔솔 나는 담백하고 고소한 막국수', img: 'https://images.unsplash.com/photo-1583182332473-b31c07318d1a?auto=format&fit=crop&w=400&q=80' },
      { id: 3, tag: '먹거리', title: '보정동 앤틱 브런치', desc: '이국적인 할로윈/크리스마스 거리에서 즐기는 브런치', img: 'https://images.unsplash.com/photo-1495474472207-464a47e452cd?auto=format&fit=crop&w=400&q=80' },
      { id: 4, tag: '먹거리', title: '용인 중앙시장 족발', desc: '오랜 전통을 자랑하는 쫄깃하고 푸짐한 시장 족발', img: 'https://images.unsplash.com/photo-1544025162-811114215b22?auto=format&fit=crop&w=400&q=80' },
      { id: 5, tag: '먹거리', title: '에버랜드 츄러스', desc: '놀이동산의 설렘을 더해주는 달콤바삭한 간식', img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  '고양시': {
    streetList: [
      { id: 1, title: '일산 라페스타', location: '일산동구 장항동', img: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=400&q=80' },
      { id: 2, title: '밤리단길', location: '일산동구 정발산동', img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80' },
      { id: 3, title: '웨스턴돔', location: '일산동구 장항동', img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=400&q=80' },
      { id: 4, title: '행주산성 먹거리촌', location: '덕양구 행주외동', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80' },
      { id: 5, title: '원당 종마목장 길', location: '덕양구 원당동', img: 'https://images.unsplash.com/photo-1542314831-c6a4d14eff40?auto=format&fit=crop&w=400&q=80' },
    ],
    attractions: [
      { id: 1, tag: '볼거리', title: '일산 호수공원', desc: '아시아 최대 규모의 인공 호수와 아름다운 꽃 박람회', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80' },
      { id: 2, tag: '볼거리', title: '킨텍스 (KINTEX)', desc: '매주 다채로운 전시와 박람회가 열리는 대형 전시장', img: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=400&q=80' },
      { id: 3, tag: '볼거리', title: '현대모터스튜디오 고양', desc: '자동차의 탄생 과정을 눈으로 확인하는 테마파크', img: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=400&q=80' },
      { id: 4, tag: '볼거리', title: '아쿠아플라넷 일산', desc: '바다 생물과 정글 동물이 공존하는 실내 테마파크', img: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=400&q=80' },
      { id: 5, tag: '볼거리', title: '행주산성', desc: '권율 장군의 얼이 깃든 한강 조망의 역사적 명소', img: 'https://images.unsplash.com/photo-1590393275627-0c46bc8ea23c?auto=format&fit=crop&w=400&q=80' },
    ],
    activities: [
      { id: 1, tag: '놀거리', title: '호수공원 자전거 라이딩', desc: '시원한 바람을 맞으며 즐기는 자전거 산책', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80' },
      { id: 2, tag: '놀거리', title: '자동차 시승 체험', desc: '모터스튜디오에서 최신 차량 직접 타보기', img: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=400&q=80' },
      { id: 3, tag: '잘거리', title: '소노캄 고양', desc: '킨텍스 인근에 위치한 최고급 5성급 호텔', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80' },
      { id: 4, tag: '놀거리', title: '원마운트 스노우파크', desc: '365일 눈이 내리는 실내 겨울 테마파크', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80' },
      { id: 5, tag: '놀거리', title: '배다골 테마파크', desc: '아이들과 함께 즐기는 도심 속 미니 농장 체험', img: 'https://images.unsplash.com/photo-1542314831-c6a4d14eff40?auto=format&fit=crop&w=400&q=80' },
    ],
    foods: [
      { id: 1, tag: '먹거리', title: '행주산성 원조국수', desc: '자전거 라이더들의 성지, 세숫대야 크기의 잔치국수', img: 'https://images.unsplash.com/photo-1583182332473-b31c07318d1a?auto=format&fit=crop&w=400&q=80' },
      { id: 2, tag: '먹거리', title: '밤리단길 에스프레소', desc: '유럽 감성 물씬 풍기는 분위기 깡패 카페들', img: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=400&q=80' },
      { id: 3, tag: '먹거리', title: '일산 닭칼국수', desc: '걸쭉하고 뽀얀 육수가 일품인 줄 서서 먹는 칼국수', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80' },
      { id: 4, tag: '먹거리', title: '웨스턴돔 즉석떡볶이', desc: '쇼핑 후 즐기는 매콤달콤한 분식 타임', img: 'https://images.unsplash.com/photo-1583182332473-b31c07318d1a?auto=format&fit=crop&w=400&q=80' },
      { id: 5, tag: '먹거리', title: '애니골 장작구이', desc: '일산의 오래된 맛집 촌, 참나무 장작구이 통닭', img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80' },
    ],
  }
};

// ----------------------------------------------------
// 3. 무작위로 n개의 요소를 뽑아주는 유틸리티 함수
// ----------------------------------------------------
const getRandomItems = (arr, num) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

// ----------------------------------------------------
// 4. 메인 페이지 컴포넌트
// ----------------------------------------------------
const MainPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 현재 지역 가져오기 (기본값 수원시)
  const currentRegion = location.state?.selectedRegion || '수원시';
  
  // 🚀 지역에 맞는 배너 이미지 적용!
  const currentBannerImage = bannerImages[currentRegion] || defaultBanner;
  
  // 현재 지역 데이터 꺼내오기
  const currentData = regionData[currentRegion] || regionData['수원시'];
  const { streetList, attractions, activities, foods } = currentData;

  // 🚀 새로고침 시 5개의 데이터 중 랜덤으로 3개만 추출 (useMemo를 써서 화면 렌더링 최적화)
  const randomStreetList = useMemo(() => getRandomItems(streetList, 4), [currentRegion]);
  const randomAttractions = useMemo(() => getRandomItems(attractions, 3), [currentRegion]);
  const randomActivities = useMemo(() => getRandomItems(activities, 3), [currentRegion]);
  const randomFoods = useMemo(() => getRandomItems(foods, 3), [currentRegion]);

  const handleMoreClick = (pathType) => {
    navigate(`/area/${pathType}/list`, { state: { selectedRegion: currentRegion } });
  };

  // 카테고리 렌더링 함수
  const renderCategorySection = (title, dataList, pathType) => (
    <section className="mb-[60px]">
      <div className="flex justify-between items-end mb-[25px]">
        <h3 className="text-[22px] font-bold flex items-center gap-2.5 text-gray-900">
          <span className="inline-block w-1 h-5 bg-[#E26338] rounded-sm"></span>
          {title}
        </h3>
        <button 
          onClick={() => handleMoreClick(pathType)}
          className="bg-[#f5f5f5] border border-[#eee] py-1 px-4 rounded-full text-[12px] text-gray-600 cursor-pointer hover:bg-[#eee] transition-colors"
        >
          더보기 <span>→</span>
        </button>
      </div>
      
      {/* 3열 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[25px]">
        {dataList.map((item) => (
          <div key={item.id} className="bg-white border border-[#eee] rounded-xl overflow-hidden cursor-pointer transition-shadow duration-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] group">
            
            {/* 🚀 회색 박스 대신 실제 이미지가 들어갑니다! */}
            <img 
              src={item.img} 
              alt={item.title} 
              className="w-full h-[180px] object-cover block group-hover:scale-105 transition-transform duration-300" 
            />
            
            <div className="p-5 relative bg-white">
              <span className="inline-block bg-[#FFF2E8] text-[#E26338] text-[11px] font-bold py-1 px-2.5 rounded mb-3">
                {item.tag}
              </span>
              <h4 className="text-[18px] font-bold mb-2 text-gray-900 group-hover:text-primary transition-colors">{item.title}</h4>
              <p className="text-[14px] text-gray-500 leading-relaxed line-clamp-2">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="w-full bg-white pb-[100px]">
      
      {/* 상단 히어로 배너 */}
      <section 
        className="w-full h-[400px] bg-cover bg-center flex justify-center items-center relative transition-all duration-500"
        style={{ backgroundImage: `url('${currentBannerImage}')` }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center text-white drop-shadow-md">
          <h1 className="font-['GriunFont'] text-[50px] md:text-[80px] mb-[15px] font-black">
            {currentRegion} 
          </h1>
          <p className="text-[18px] md:text-[24px] font-medium tracking-[2px]">전통과 현대가 공존하는 도시</p>
        </div>
      </section>

      {/* 중앙 콘텐츠 영역 */}
      <div className="max-w-[1200px] mx-auto px-5 py-10">
        <div className="text-[13px] text-gray-500 mb-[50px]">
          홈 &gt; <strong className="text-gray-900">{currentRegion}</strong>
        </div>

        {/* 숨어있는 거리 섹션 */}
        <section className="mb-[80px]">
          <div className="text-center mb-10 border-b-2 border-gray-800 pb-4">
            <h2 className="text-[26px] font-bold text-gray-900">방방곳곳 숨어있는 거리를 찾다</h2>
          </div>
          
          {/* 거리 이미지 카드도 3열로 맞췄습니다 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {/* 🚀 원본 리스트 대신 랜덤 리스트 맵핑 */}
            {randomStreetList.map((street) => (
              <div key={street.id} className="relative rounded-xl overflow-hidden aspect-[3/4] shadow-[0_4px_15px_rgba(0,0,0,0.1)] cursor-pointer hover:-translate-y-1.5 transition-transform duration-300">
                <img src={street.img} alt={street.title} className="w-full h-full object-cover block" />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent pt-[30px] pb-5 px-5 text-white">
                  <h4 className="text-[18px] font-bold mb-1">{street.title}</h4>
                  <p className="text-[13px] text-gray-300">{street.location}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 카테고리별 추천 리스트 🚀 원본 리스트 대신 랜덤 리스트를 넘겨줍니다. */}
        {renderCategorySection("놓치지 말아야 할 '볼거리'", randomAttractions, "see")}
        {renderCategorySection("편안한 '잘거리'와 신나는 '놀거리'", randomActivities, "play")}
        {renderCategorySection("수원의 맛, '먹거리'", randomFoods, "food")}

      </div>
    </div>
  );
};

export default MainPage;