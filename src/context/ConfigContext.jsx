import React, { createContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { toRegionTxt, toRegion } from '@utils/regionMap';

export const ConfigContext = createContext(null);

export const ConfigProvider = ({ children }) => {
    const { user } = useAuth();
    const { region, type } = useParams();

    const [siteConfig, setSiteConfig] = useState({
        curRegion: {},
        curRegionEn: '',
        curRegionKr: '',
        isUser: false,
        navs: {},
        theme: 'light',
        test: { test1: "Bbb" },
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

            // 💡 최적화: 값이 같으면 업데이트하지 않음
            if (current[keys[keys.length - 1]] === value) return prev;

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
        if (region) {
            makeConfig('curRegionEn', regionEn);    // 지역 영문명
            makeConfig('curRegionKr', regionKr);    // 지역 한글명
            makeConfig('curRegion', regionObj);     // 지역 관련 OBJECT
        } else {
            if (siteConfig.curRegionEn !== '') {
                makeConfig('curRegionEn', '');
                makeConfig('curRegionKr', '');
                makeConfig('curRegion', {});
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
        <ConfigContext.Provider value={value}>
            {children}
        </ConfigContext.Provider>
    );
};