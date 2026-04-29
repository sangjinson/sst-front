import { getFoodDataByRegion } from '@pages/area/food/foodData';
import { getSeeDataByRegion } from '@pages/area/see/seeData';
import { getSleepDataByRegion } from '@pages/area/sleep/sleepDummyData';

// ────────────────────────────────────────────
// 카테고리 타입 한글/색상
// ────────────────────────────────────────────
export const TYPE_LABEL = {
  see:   '볼거리',
  food:  '먹거리',
  sleep: '잘거리',
};

export const TYPE_COLOR = {
  see:   'bg-blue-100 text-blue-700',
  food:  'bg-orange-100 text-orange-700',
  sleep: 'bg-green-100 text-green-700',
};

export const SEARCH_CATEGORIES = ['전체', '볼거리', '먹거리', '잘거리'];

// ────────────────────────────────────────────
// 더미 일정 생성 함수
// ────────────────────────────────────────────
export const generateSchedule = (region, days) => {
  const regionKor = region || '수원시';
  const see   = getSeeDataByRegion(regionKor.replace('시', '').replace('군', '')).slice(0, 3);
  const food  = getFoodDataByRegion(regionKor).slice(0, 4);
  const sleep = getSleepDataByRegion(regionKor).slice(0, 1);

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
export const getSearchResults = (selectedRegion, searchKeyword, searchCategory) => {
  const kw = searchKeyword.trim().toLowerCase();

  const seeList = getSeeDataByRegion(selectedRegion.replace('시', '').replace('군', ''))
    .map(i => ({ ...i, name: i.title || i.name, type: 'see', id: `see-${i.id}` }));
  const foodList = getFoodDataByRegion(selectedRegion)
    .map(i => ({ ...i, type: 'food', id: `food-${i.id}` }));
  const sleepList = getSleepDataByRegion(selectedRegion)
    .map(i => ({ ...i, type: 'sleep', id: `sleep-${i.id}` }));

  let all = [...seeList, ...foodList, ...sleepList];

  if (searchCategory === '볼거리') all = seeList;
  else if (searchCategory === '먹거리') all = foodList;
  else if (searchCategory === '잘거리') all = sleepList;

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
  const type = item.type;
  const rawId = String(item.id).replace(`${type}-`, '');
  const regionEn = selectedRegion.replace('시', '').replace('군', '').toLowerCase();
  return `/${regionEn}/${type}/view?id=${rawId}`;
};