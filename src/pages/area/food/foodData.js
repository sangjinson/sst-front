import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const REGION_CODE_MAP = {
  '수원시': 11, '성남시': 13, '안양시': 17, '안산시': 27,
  '화성시': 59, '평택시': 22, '시흥시': 39, '부천시': 19,
  '광명시': 21, '광주시': 61, '이천시': 50, '여주시': 67,
  '하남시': 45, '의왕시': 43, '군포시': 41, '오산시': 37,
  '안성시': 55, '김포시': 57, '과천시': 29, '양평군': 83,
  '고양시': 28, '구리시': 31, '남양주시': 36, '동두천시': 25,
  '양주시': 63, '연천군': 80, '의정부시': 15, '파주시': 48,
  '포천시': 65, '가평군': 82, '용인시': 46,
};

const FLT_LABEL_MAP = {
  'FLT006': '한식',
  'FLT007': '일식',
  'FLT008': '양식',
  'FLT009': '중식',
  'FLT010': '카페',
  'FLT021': '간이음식',
};

const stripHtml = (str) => str?.replace(/<[^>]*>/g, ' ').trim() || '';

const normalizeApiItem = (item) => ({
  id: item.plcNo,
  plcNo: item.plcNo,                        // ← 추가
  name: item.plcName,
  title: item.plcName,
  category: FLT_LABEL_MAP[item.plcFltCd] || '한식',
  tag: FLT_LABEL_MAP[item.plcFltCd] || '한식',
  plcAvgRating: item.plcAvgRating ?? 0,     // ← 추가
  plcReviewCnt: item.plcReviewCnt ?? 0,     // ← 추가
  rating: item.plcAvgRating ?? 0,        // ← 추가 (AreaListCard용)
  reviewCount: item.plcReviewCnt ?? 0,   // ← 추가 (AreaListCard용)
  reviews: [],                              // ← 빈 배열
  description: stripHtml(item.plcOverview) || '',
  desc: stripHtml(item.plcOverview) || '',
  address: item.plcAddr || '',
  location: item.plcAddr || '',
  image: item.plcMainImgUrl || item.plcThumImgUrl || 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80',
  phone: stripHtml(item.plcTelno) || '',
  hours: stripHtml(item.foodOpeningHours) || '09:00 - 22:00',
  lat: item.plcLat ? Number(item.plcLat) : 37.2636,
  lng: item.plcLot ? Number(item.plcLot) : 127.0286,
  tags: [],
  parking: stripHtml(item.foodParking) || '',
  restdate: stripHtml(item.foodRestdate) || '',
  menu: stripHtml(item.foodMenu) || '',
  infocenter: stripHtml(item.foodInfocenter) || '',
});

export const getFoodDataByRegion = async (regionName) => {
  try {
    const rgnCd = REGION_CODE_MAP[regionName];
    const res = await axios.get(`${BASE_URL}/api/food/list`, {
      params: { rgnCd },
    });
    return res.data.map(normalizeApiItem);
  } catch (err) {
    console.error('먹거리 목록 조회 실패:', err);
    return [];
  }
};

export const getFoodDataById = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/food/${id}`);
    return normalizeApiItem(res.data);
  } catch (err) {
    console.error('먹거리 상세 조회 실패:', err);
    return null;
  }
};

export default getFoodDataByRegion;