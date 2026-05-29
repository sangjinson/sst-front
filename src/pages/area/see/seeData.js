import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const REGION_CODE_MAP = {
  '수원': 11, '성남': 13, '안양': 17, '안산': 27,
  '화성': 59, '평택': 22, '시흥': 39, '부천': 19,
  '광명': 21, '광주': 61, '이천': 50, '여주': 67,
  '하남': 45, '의왕': 43, '군포': 41, '오산': 37,
  '안성': 55, '김포': 57, '과천': 29, '양평': 83,
  '고양': 28, '구리': 31, '남양주': 36, '동두천': 25,
  '양주': 63, '연천': 80, '의정부': 15, '파주': 48,
  '포천': 65, '가평': 82, '용인': 46,
};

const FLT_LABEL_MAP = {
  'FLT001': '역사',
  'FLT002': '자연',
  'FLT003': '랜드마크',
  'FLT004': '도시공원',
  'FLT005': '전시장',
};

const normalizeRegionKey = (region = '수원') =>
  region.replace(/[시군]$/, '') || '수원';

const stripHtml = (str) => str?.replace(/<[^>]*>/g, ' ').trim() || '';

const extractUrl = (str) => {
  if (!str) return '';
  const match = str.match(/href=["']([^"']+)["']/);
  if (match) return match[1];
  return str.startsWith('http') ? str : '';
};

const normalizeApiItem = (item) => ({
  id: item.plcNo,
  plcNo: item.plcNo,
  title: item.plcName,
  name: item.plcName,
  tag: FLT_LABEL_MAP[item.plcFltCd] || '기타',
  category: FLT_LABEL_MAP[item.plcFltCd] || '기타',
  hashtags: [],
  likes: 0,
  plcAvgRating: item.plcAvgRating ?? 0,
  plcReviewCnt: item.plcReviewCnt ?? 0,
  rating: item.plcAvgRating ?? 0,
  reviewCount: item.plcReviewCnt ?? 0,
  reviews: [],
  image: item.plcMainImgUrl || item.plcThumImgUrl || 'https://picsum.photos/id/1011/800/600',
  desc: stripHtml(item.plcOverview) || '',
  description: stripHtml(item.plcOverview) || '',
  location: item.plcAddr || '',
  address: item.plcAddr || '',
  phone: stripHtml(item.plcTelno) || '',
  hours: stripHtml(item.seeUsetime) || '09:00 - 18:00',
  lat: item.plcLat ? Number(item.plcLat) : 37.2636,
  lng: item.plcLot ? Number(item.plcLot) : 127.0286,
  region: item.plcRgnCd || '',
  tags: [],
  parking: stripHtml(item.seeParking) || '',
  restdate: stripHtml(item.seeRestdate) || '',
  infocenter: stripHtml(item.seeInfocenter) || '',
  homepage: extractUrl(item.plcHomepage),
});

export const getSeeDataByRegion = async (region) => {
  try {
    const regionKey = normalizeRegionKey(region);
    const rgnCd = REGION_CODE_MAP[regionKey];
    const res = await axios.get(`${BASE_URL}/api/see/list`, { params: { rgnCd } });
    return res.data.map(normalizeApiItem);
  } catch (err) {
    console.error('볼거리 목록 조회 실패:', err);
    return [];
  }
};

export const getSeeDataPaged = async (region, page = 1, size = 12, keyword = '') => {
  try {
    const regionKey = normalizeRegionKey(region);
    const rgnCd = REGION_CODE_MAP[regionKey];
    const res = await axios.get(`${BASE_URL}/api/see/paged`, {
      params: { rgnCd, page, size, keyword },
    });
    return { ...res.data, list: res.data.list.map(normalizeApiItem) };
  } catch (err) {
    console.error('볼거리 페이징 조회 실패:', err);
    return { list: [], totalCount: 0, totalPages: 1, currentPage: 1, pageSize: size };
  }
};

export const getSeeDataById = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/see/${id}`);
    if (!res.data?.plcNo) return null;
    return normalizeApiItem(res.data);
  } catch (err) {
    console.error('볼거리 상세 조회 실패:', err);
    if (err.response?.status === 404) return null;
    throw err;
  }
};
