// areaListUtils.js - 리스트/뷰 페이지 공통 유틸

// 카테고리 순서대로 순환하는 배지 색상 팔레트
// 첫번째 카테고리: 초록, 두번째: 노란, 세번째: 파란, ...
export const BADGE_COLORS = [
  'bg-green-100 text-green-700',
  'bg-yellow-100 text-yellow-700',
  'bg-blue-100 text-blue-700',
  'bg-rose-100 text-rose-700',
  'bg-purple-100 text-purple-700',
  'bg-orange-100 text-orange-700',
  'bg-cyan-100 text-cyan-700',
  'bg-lime-100 text-lime-700',
];

// 카테고리 배열에서 해당 카테고리의 배지 색상 반환
// categories: '전체' 제외한 카테고리 배열
// category: 현재 카테고리명
export const getBadgeColor = (categories, category) => {
  const idx = categories.filter(c => c !== '전체').indexOf(category);
  return BADGE_COLORS[Math.max(idx, 0) % BADGE_COLORS.length];
};

// 공통 정렬 옵션
export const AREA_SORT_OPTIONS = [
  { value: 'reviews', label: '리뷰순' },
  { value: 'rating',  label: '평점순' },
];

// 공통 정렬 함수 - useMemo 안에서 사용
// sortOption: 'reviews' | 'rating'
export const sortData = (data, sortOption) => {
  const result = [...data];

  const hasImage = (item) => {
    const url = item.image || '';
    return url && !url.includes('picsum') && !url.includes('unsplash');
  };

  if (sortOption === 'reviews') {
    result.sort((a, b) => {
      const aCount = a.reviewCount ?? a.reviews ?? 0;
      const bCount = b.reviewCount ?? b.reviews ?? 0;
      if (bCount !== aCount) return bCount - aCount;
      // 리뷰 수 같으면 이미지 있는 것 앞으로
      return hasImage(b) - hasImage(a);
    });
  } else if (sortOption === 'rating') {
    result.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      // 평점 같으면 이미지 있는 것 앞으로
      return hasImage(b) - hasImage(a);
    });
  }

  return result;
};