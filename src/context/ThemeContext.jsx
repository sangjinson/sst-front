import React, { createContext, useContext, useEffect, useState } from 'react';
import { useConfig } from '@hooks/useConfig'; // 사이트 전반의 설정 값
import { useParams, Navigate } from 'react-router-dom';

import { toRegionTxt, toRegion, hasRegion } from '@utils/regionMap';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const {getConfig, setConfig} = useConfig();   // Config 값 가져오기
  const { region, type } = useParams();
  const siteConfig = getConfig();

  
  useEffect(() => {
      const regionEn = region ? toRegionTxt(region, 'en') : '';
      if (region) {
          if(hasRegion(region)){
            sessionStorage.setItem('lastVisitedRegion', regionEn);
            setConfig('curRegionEn', regionEn);
            setConfig('curRegionKr', toRegionTxt(region, 'ko'));
            setConfig('curRegion', toRegion(region));
          }else{
            
          }
      } else if (sessionStorage.getItem('lastVisitedRegion')) {
          const savedRegion = sessionStorage.getItem('lastVisitedRegion');
          if (savedRegion && hasRegion(savedRegion)) {
              setConfig('curRegionEn', toRegionTxt(savedRegion, 'en'));
              setConfig('curRegionKr', toRegionTxt(savedRegion, 'ko'));
              setConfig('curRegion', toRegion(savedRegion));
          }else{
            
          }
      }
  }, [region, type]); // siteConfig.curRegionEn은 제거하여 무한 루프 방지


  //  기존에 저장된 테마가 있으면 가져오고, 없으면 기본값 'light'
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('color-theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;

    //  테마 상태에 따라 최상위 html 태그에 클래스 조작
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    //  새로고침해도 유지되도록 로컬 스토리지에 저장
    localStorage.setItem('color-theme', theme);


  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const isDarkMode = theme === 'dark';

  if (region) {
    if(region == null || region == "null" || !hasRegion(region)){
      return <Navigate to="/" replace />  
    }
  }
  
  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);