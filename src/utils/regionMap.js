export const regionMap = {
  '수원시': 'suwon',
  '성남시': 'seongnam',
  '용인시': 'yongin',
  '안양시': 'anyang',
  '안산시': 'ansan',
  '과천시': 'gwacheon',
  '광명시': 'gwangmyeong',
  '광주시': 'gwangju',
  '군포시': 'gunpo',
  '부천시': 'bucheon',
  '시흥시': 'siheung',
  '안성시': 'anseong',
  '오산시': 'osan',
  '의왕시': 'uiwang',
  '이천시': 'icheon',
  '평택시': 'pyeongtaek',
  '하남시': 'hanam',
  '화성시': 'hwaseong',
  '여주시': 'yeoju',
  '양평군': 'yangpyeong',
  '고양시': 'goyang',
  '구리시': 'guri',
  '남양주시': 'namyangju',
  '동두천시': 'dongducheon',
  '양주시': 'yangju',
  '의정부시': 'uijeongbu',
  '파주시': 'paju',
  '포천시': 'pocheon',
  '연천군': 'yeoncheon',
  '가평군': 'gapyeong',
};

// 한글 → 영어
export const toEnRegion = (kor) => regionMap[kor] || kor;

// 영어 → 한글
export const toKorRegion = (eng) => {
  return Object.keys(regionMap).find((key) => regionMap[key] === eng) || eng;
};