import React, { createContext, useState, useCallback, useMemo, useEffect } from 'react';
import { HelmetProvider, Helmet } from "react-helmet-async";
import { useParams } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { toRegionTxt, toRegion, hasRegion } from '@utils/regionMap';

export const ConfigContext = createContext(null);

export const ConfigProvider = ({ children }) => {
    const { user } = useAuth();
    const { region, type } = useParams();

    const [siteConfig, setSiteConfig] = useState({
        pageTitle : '거리에섯 | 나만의 완벽한 여행 일정',
        logoText : '거리에섯',
        curRegion: {},
        curRegionEn: '',
        curRegionKr: '',
        isUser: false,
        navs: {},
        theme: 'light',
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
    });

    // 1. 내부/외부에서 공통으로 사용할 getConfig 정의 (ReferenceError 해결)
    const getConfig = useCallback((path, defaultValue = null) => {
        if (!path) return siteConfig;
        const result = path.split('.').reduce((acc, key) => acc?.[key], siteConfig);
        return result ?? defaultValue;
    }, [siteConfig]);

    // 2. 경로 기반 설정 업데이트 함수
    const makeConfig = useCallback((path, value) => {
        setSiteConfig(prev => {
            const keys = path.split('.');
            
            // 💡 1단계: 리액트가 가진 가장 최신의 'prev' 객체에서 해당 경로의 실제 현재 값을 먼저 추적합니다.
            let currentRaw = prev;
            for (let i = 0; i < keys.length; i++) {
                currentRaw = currentRaw?.[keys[i]];
            }

            // 💡 핵심 브레이크: 비동기 렌더링 대기 상태든 뭐든, 최종 주입될 최신값(currentRaw)이 
            // 지금 새로 들어온 value와 완벽히 같다면 무조건 상태 업데이트를 전면 기각(Cancel)합니다!
            if (currentRaw === value) return prev;

            // 💡 2단계: 값이 진짜 다를 때만 딥카피 및 데이터 주입 진행 (기존 로직 유지)
            const newConfig = { ...prev };
            let current = newConfig;

            for (let i = 0; i < keys.length - 1; i++) {
                const key = keys[i];
                if (!current[key] || typeof current[key] !== 'object') {
                    current[key] = {};
                } else {
                    current[key] = { ...current[key] };
                }
                current = current[key];
            }

            current[keys[keys.length - 1]] = value;
            return newConfig;
        });
    }, []);

    // 3. 데이터 동기화 (user, region 변경 시)
    useEffect(() => {
        /**
         * 여러 개의 상태를 각각 업데이트하기보다, 
         * 의존성이 변했을 때 필요한 값을 계산해서 한 번에 업데이트하는 것이 좋습니다.
        */ 
        
        // ----------------------------------------------
        // URL 관련
        // ----------------------------------------------
        makeConfig('Url.region', region ?? '');    // 지역
        makeConfig('Url.type', type ?? '');        // 지역 컨텐츠 구분

        // 지역 관련 설정
        const regionEn = region ? toRegionTxt(region, 'en') : '';
        const regionKr = region ? toRegionTxt(region, 'ko') : '';
        const regionObj = region ? toRegion(region) : {};
        
        // 지역 데이터가 존재하는지 확인.
        if (hasRegion(region)) {
            makeConfig('curRegionEn', regionEn);    // 지역 영문명
            makeConfig('curRegionKr', regionKr);    // 지역 한글명
            makeConfig('curRegion', regionObj);     // 지역 관련 OBJECT
            
            // 마지막 방문 지역을 저장
            localStorage.setItem('lastVisitedRegion', regionEn);
        } else {
        // URL에 지역이 없는데(새로고침 등), 전역 상태까지 비어있다면?
        if (!siteConfig.curRegionEn) {
            // 로컬스토리지에서 마지막으로 방문했던 지역을 찾아온다.
            const savedRegion = localStorage.getItem('lastVisitedRegion');
            // 저장된 지역이 존재한다면 그걸로 전역 상태를 은밀하게 복원!
            if (savedRegion && hasRegion(savedRegion)) {
                makeConfig('curRegionEn', toRegionTxt(savedRegion, 'en'));
                makeConfig('curRegionKr', toRegionTxt(savedRegion, 'ko'));
                makeConfig('curRegion', toRegion(savedRegion));
            }
        }
    }

        // ----------------------------------------------
        // 사용자
        // ----------------------------------------------
        const isUserFlag = !!user;
        // 현재 상태와 비교하여 다를 때만 업데이트 (무한루프 방지)
        if (siteConfig.isUser !== isUserFlag) makeConfig('isUser', isUserFlag);

    }, [user, region, makeConfig, siteConfig.isUser, siteConfig.curRegionEn]);

    // 4. Context에 담을 값 메모이제이션
    const value = useMemo(() => ({ 
        siteConfig, 
        makeConfig, 
        getConfig // 훅에서도 이 getConfig를 가져다 쓰게 됩니다.
    }), [siteConfig, makeConfig, getConfig]);

    return (
        <HelmetProvider>
            <ConfigContext.Provider value={value}>
                <Helmet>
                    <title>{siteConfig.pageTitle}</title>
                </Helmet>

                {children}
            </ConfigContext.Provider>
        </HelmetProvider>
    );
};