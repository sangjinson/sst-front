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