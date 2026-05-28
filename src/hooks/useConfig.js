import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@api/axios';
import { mapDataToState } from '@utils/common';

const defaultValues = {
  pageTitle: '',
  logoText: '거리에섯',
  curRegion: {},
  curRegionEn: '',
  curRegionKr: '',
  theme: 'light',
  user: { isAuth: false },
  profile: null,
  footer: {
    zipCode: '54888',
    address: '전북특별자치도 전주시 덕진구 기린대로 499',
    phone: '010-8728-4276',
    fax: '02-123-1234',
    slogan: '숨겨진 경기도의 매력을 발견하세요.',
    subSlogan: '나만의 완벽한 여행 일정을 AI와 함께 쉽게 계획할 수 있습니다.',
    copyright: '© 2026 SST. All rights reserved.',
    portfolioNotice: '본 사이트는 팀 [SST]의 공동 역량 증명을 위한 포트폴리오 용도로 제작되었으며, 일체의 상업적 목적이 없음을 밝힙니다.',
    devTeam: [
      { name: '김영훈', email: 'weed3029@gmail.com' },
      { name: '김지태', email: 'jtkim4510@gmail.com' },
      { name: '노송현', email: 'dlfakxm12@gmail.com' },
      { name: '소제우', email: 'sjo8080@naver.com' },
      { name: '손상진', email: 'thstkdwls13@naver.com' },
      { name: '한상인', email: 'blueunycon@gmail.com' }
    ]
  }
};

export const useConfig = () => {
  const queryClient = useQueryClient();
  const queryKey = ['siteConfig'];

  const { data: siteConfig = defaultValues } = useQuery({
    queryKey,
    queryFn: () => defaultValues,
    staleTime: Infinity,
    initialData: defaultValues,
  });

  const getConfig = (path, defaultValue = '경기도') => {
    if (!path) return siteConfig;
    return path.split('.').reduce((acc, key) => acc?.[key], siteConfig) ?? defaultValue;
  };

  const setConfig = (path, value) => {
    queryClient.setQueryData(queryKey, (prev = defaultValues) => {
      const newConfig = { ...prev };
      const keys = path.split('.');
      let current = newConfig;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        current[key] = (current[key] && typeof current[key] === 'object') ? { ...current[key] } : {};
        current = current[key];
      }

      const lastKey = keys[keys.length - 1];
      const existingValue = current[lastKey];

      if (existingValue !== null && typeof existingValue === 'object' && value !== null && typeof value === 'object' && !Array.isArray(value)) {
        current[lastKey] = { ...existingValue, ...value };
      } else {
        current[lastKey] = value;
      }
      return newConfig;
    });
  };

  const fetchFullProfile = async () => {
    try {
      const response = await api.get('/member/me');
      const data = mapDataToState('profile', response.data.data);
      setConfig('profile', data);
    } catch (error) {
      setConfig('profile', null);
    }
  };

  return { 
    getConfig, 
    setConfig, 
    saveConfig: setConfig, 
    updateConfig: setConfig, 
    fetchFullProfile 
  };
};