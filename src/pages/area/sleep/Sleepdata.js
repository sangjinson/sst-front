// Sleepdata.js
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
  'FLT011': '호텔/모텔',
  'FLT012': '콘도',
  'FLT013': '펜션',
  'FLT014': '캠핑',
  'FLT015': '게스트하우스',
};

const stripHtml = (str) => str?.replace(/<[^>]*>/g, ' ').trim() || '';

const extractUrl = (str) => {
  if (!str) return '';
  const match = str.match(/href=["']([^"']+)["']/);
  if (match) return match[1];
  return str.startsWith('http') ? str : '';
};

const getFacilities = (item) => {
  const facilities = [];
  if (item.sleepBarbecu)    facilities.push('바베큐');
  if (item.sleepBeauty)     facilities.push('미용실');
  if (item.sleepBeverage)   facilities.push('음료');
  if (item.sleepBicycle)    facilities.push('자전거');
  if (item.sleepCampfire)   facilities.push('캠프파이어');
  if (item.sleepFitness)    facilities.push('피트니스');
  if (item.sleepKaraoke)    facilities.push('노래방');
  if (item.sleepPublicBath) facilities.push('공용욕실');
  if (item.sleepPublicPc)   facilities.push('PC');
  if (item.sleepSauna)      facilities.push('사우나');
  if (item.sleepSeminar)    facilities.push('세미나실');
  if (item.sleepSports)     facilities.push('스포츠');
  if (item.sleepParking)    facilities.push('주차가능');
  return facilities;
};

const normalizeApiItem = (item) => ({
  id: item.plcNo,
  plcNo: item.plcNo,
  name: item.plcName,
  title: item.plcName,
  category: FLT_LABEL_MAP[item.plcFltCd] || '호텔/모텔',
  tag: FLT_LABEL_MAP[item.plcFltCd] || '호텔/모텔',
  plcAvgRating: item.plcAvgRating ?? 0,
  plcReviewCnt: item.plcReviewCnt ?? 0,
  rating: item.plcAvgRating ?? 0,
  reviewCount: item.plcReviewCnt ?? 0,
  reviews: [],
  description: stripHtml(item.plcOverview) || '',
  desc: stripHtml(item.plcOverview) || '',
  address: item.plcAddr || '',
  location: item.plcAddr || '',
  image: item.plcMainImgUrl || item.plcThumImgUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
  phone: item.plcTelno?.trim() || item.sleepInfocenter?.trim() || '',
  checkIn: stripHtml(item.sleepCheckIn) || '',
  checkOut: stripHtml(item.sleepCheckOut) || '',
  lat: item.plcLat ? Number(item.plcLat) : 37.2636,
  lng: item.plcLot ? Number(item.plcLot) : 127.0286,
  tags: [],
  facilities: getFacilities(item),
  parking: stripHtml(item.sleepParking) || '',
  reservation: stripHtml(item.sleepReservation) || '',
  reservationUrl: item.sleepReservationUrl || '',
  subFacility: stripHtml(item.sleepSubFacility) || '',
  homepage: extractUrl(item.plcHomepage),
});

export const getSleepDataByRegion = async (region) => {
  try {
    const rgnCd = REGION_CODE_MAP[region];
    const res = await axios.get(`${BASE_URL}/api/sleep/list`, { params: { rgnCd } });
    return res.data.map(normalizeApiItem);
  } catch (err) {
    console.error('잘거리 목록 조회 실패:', err);
    return [];
  }
};

export const getSleepDataById = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/sleep/${id}`);
    if (!res.data?.plcNo) return null;
    return normalizeApiItem(res.data);
  } catch (err) {
    console.error('잘거리 상세 조회 실패:', err);
    if (err.response?.status === 404) return null;
    throw err;
  }
};

export default getSleepDataByRegion;
