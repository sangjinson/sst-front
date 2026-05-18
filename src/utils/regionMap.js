import { REGION_DATA, DEFAULT_REGION } from '@public/scripts/regions';

// 1. 지역( 한글 → 영어 )
export const toEnRegion = (kor) => {
  const region = REGION_DATA.find(r => r.textKor === kor);
  return region ? region.textEn : kor;
};

// 2. 지역( 영어 → 한글 )
export const toKorRegion = (eng) => {
  const region = REGION_DATA.find(r => r.textEn === eng?.toLowerCase());
  return region ? region.textKor : eng;
};

// 3. 지역( 영어 <-> 한글 ) 통합 버전
export const toRegionTxt = (name, mode = 'ko') => {
  if (!name) return '';
  const safeMode = mode.toLowerCase();
  
  return safeMode === 'en' ? toEnRegion(name) : toKorRegion(name);
};

// 4. 영문이든 한글이든 해당 객체 정보를 통째로 가져오기
export const toRegion = (key) => {
  if (!key) return DEFAULT_REGION;
  
  return REGION_DATA.find(
    (r) => r.textKor === key || r.textEn === key?.toLowerCase()
  ) || DEFAULT_REGION;
};

// 5. 특정 영역(north/south)의 모든 지역 객체 리스트 가져오기
export const getRegionsByArea = (area) => {
  const safeArea = area?.toLowerCase();
  // 'north' 또는 'south'에 해당하는 데이터만 필터링 (기본값 null 제외)
  return REGION_DATA.filter(r => r.area === safeArea);
};

// 6. 북부 지역 리스트만 가져오기 (편의용)
export const getNorthRegions = () => getRegionsByArea('north');

// 7. 남부 지역 리스트만 가져오기 (편의용)
export const getSouthRegions = () => getRegionsByArea('south');

// 8. 특정 지역이 어느 영역에 속하는지 확인 (이름이나 영어명 입력)
export const getAreaByRegion = (key) => {
  const region = toRegion(key);
  return region ? region.area : null;
};

// 9. 영역별로 그룹화된 객체 가져오기 (전체 데이터를 분류해서 뿌려줄 때 유용)
export const getGroupedRegions = () => {
  return REGION_DATA.reduce((acc, r) => {
    if (r.area === 'north' || r.area === 'south') {
      acc[r.area].push(r);
    }
    return acc;
  }, { north: [], south: [] });
};

// 10. 유효한 지역인지 검증하는 함수 추가 (영문명 기준)
export const hasRegion = (engName) => {
  if (!engName) return false;
  return REGION_DATA.some(r => r.textEn === engName.toLowerCase());
};