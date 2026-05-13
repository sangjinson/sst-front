import { getFoodDataByRegion } from '@pages/area/food/foodData';
import { getSeeDataByRegion } from '@pages/area/see/seeData';
import { getSleepDataByRegion } from '@pages/area/sleep/sleepdata';
import { getPlayDataByRegion } from '@pages/area/play/playData';
import { toEnRegion } from '@utils/regionMap';

// ────────────────────────────────────────────
// 카테고리 타입 한글/색상
// ────────────────────────────────────────────
export const TYPE_LABEL = {
  see:   '볼거리',
  food:  '먹거리',
  sleep: '잘거리',
  play:  '놀거리',
};

export const TYPE_COLOR = {
  see:   'bg-blue-100 text-blue-700',
  food:  'bg-orange-100 text-orange-700',
  sleep: 'bg-green-100 text-green-700',
  play:  'bg-purple-100 text-purple-700',
};

// PLC 코드 → 한글
export const CAT_LABEL_MAP = {
  'PLC001': '볼거리',
  'PLC002': '놀거리',
  'PLC003': '먹거리',
  'PLC004': '잘거리',
};

// PLC 코드 → 색상
export const CAT_COLOR_MAP = {
  'PLC001': 'bg-blue-100 text-blue-700',
  'PLC002': 'bg-purple-100 text-purple-700',
  'PLC003': 'bg-orange-100 text-orange-700',
  'PLC004': 'bg-green-100 text-green-700',
};

// PLC 코드 → type
const CAT_TYPE_MAP = {
  'PLC001': 'see',
  'PLC002': 'play',
  'PLC003': 'food',
  'PLC004': 'sleep',
};

// 한글 카테고리 → 색상
export const CAT_KOR_COLOR_MAP = {
  '볼거리': 'bg-blue-100 text-blue-700',
  '놀거리': 'bg-purple-100 text-purple-700',
  '먹거리': 'bg-orange-100 text-orange-700',
  '잘거리': 'bg-green-100 text-green-700',
};

export const SEARCH_CATEGORIES = ['전체', '볼거리', '먹거리', '잘거리', '놀거리'];

// ────────────────────────────────────────────
// 일정 생성 함수
// ────────────────────────────────────────────
export const generateSchedule = async (region, days) => {
  const regionKor = region || '수원시';

  const [seeRaw, foodRaw, sleepRaw, playRaw] = await Promise.all([
    getSeeDataByRegion(regionKor.replace('시', '').replace('군', '')),
    getFoodDataByRegion(regionKor),
    getSleepDataByRegion(regionKor),
    getPlayDataByRegion(regionKor),
  ]);

  const see   = seeRaw.slice(0, 2);
  const food  = foodRaw.slice(0, 2);
  const sleep = sleepRaw.slice(0, 1);
  const play  = playRaw.slice(0, 2);

  const times = ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'];

  const allItems = [
    ...see.map((item, i) => ({
      id: `see-${item.id}`,
      time: times[i % times.length],
      name: item.title || item.name,
      desc: item.desc || item.description || '',
      image: item.image,
      type: 'see',
      region: regionKor,
    })),
    ...food.map((item, i) => ({
      id: `food-${item.id}`,
      time: times[(i + 2) % times.length],
      name: item.name,
      desc: item.description || '',
      image: item.image,
      type: 'food',
      region: regionKor,
    })),
    ...play.map((item, i) => ({
      id: `play-${item.id}`,
      time: times[(i + 4) % times.length],
      name: item.name,
      desc: item.description || '',
      image: item.image,
      type: 'play',
      region: regionKor,
    })),
    ...sleep.map((item) => ({
      id: `sleep-${item.id}`,
      time: '20:00',
      name: item.name,
      desc: item.description || '',
      image: item.image,
      type: 'sleep',
      region: regionKor,
    })),
  ];

  const perDay = Math.ceil(allItems.length / days);
  const schedule = [];
  for (let d = 0; d < days; d++) {
    schedule.push(allItems.slice(d * perDay, (d + 1) * perDay));
  }
  return schedule;
};

// ────────────────────────────────────────────
// 검색 결과 생성 함수
// ────────────────────────────────────────────
export const getSearchResults = async (selectedRegion, searchKeyword, searchCategory) => {
  const kw = searchKeyword.trim().toLowerCase();

  const [seeRaw, foodRaw, sleepRaw, playRaw] = await Promise.all([
    getSeeDataByRegion(selectedRegion.replace('시', '').replace('군', '')),
    getFoodDataByRegion(selectedRegion),
    getSleepDataByRegion(selectedRegion),
    getPlayDataByRegion(selectedRegion),
  ]);

  const seeList   = seeRaw.map(i => ({ ...i, name: i.title || i.name, type: 'see',   id: `see-${i.id}` }));
  const foodList  = foodRaw.map(i => ({ ...i, type: 'food',  id: `food-${i.id}` }));
  const sleepList = sleepRaw.map(i => ({ ...i, type: 'sleep', id: `sleep-${i.id}` }));
  const playList  = playRaw.map(i => ({ ...i, type: 'play',  id: `play-${i.id}` }));

  let all = [...seeList, ...foodList, ...sleepList, ...playList];

  if (searchCategory === '볼거리') all = seeList;
  else if (searchCategory === '먹거리') all = foodList;
  else if (searchCategory === '잘거리') all = sleepList;
  else if (searchCategory === '놀거리') all = playList;

  if (kw) all = all.filter(i =>
    (i.name || '').toLowerCase().includes(kw) ||
    (i.description || i.desc || '').toLowerCase().includes(kw)
  );

  return all.slice(0, 20);
};

// ────────────────────────────────────────────
// 상세 페이지 이동 경로 생성
// ────────────────────────────────────────────
export const getDetailPath = (item, selectedRegion) => {
  const placeId  = item.placeId || String(item.id || '').replace(`${item.type}-`, '');
  const type     = item.type || CAT_TYPE_MAP[item.category] || 'see';
  const regionEn = toEnRegion(selectedRegion);

  return `/${regionEn}/${type}/view?id=${placeId}`;
};