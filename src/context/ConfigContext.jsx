import React, { createContext, useState, useCallback, useMemo, useEffect } from 'react';
import { HelmetProvider, Helmet } from "react-helmet-async";
import { useParams } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import api from '@api/axios';
import { toRegionTxt, toRegion, hasRegion } from '@utils/regionMap';
import { toast, confirm, mapDataToState } from '@utils/common'

export const ConfigContext = createContext(null);

export const ConfigProvider = ({ children }) => {
    const { user } = useAuth(); // 인증 hook (기본 로그인 정보)
    const { region, type } = useParams();

    const [siteConfig, setSiteConfig] = useState({
        pageTitle: '거리에섯 | 나만의 완벽한 여행 일정',
        logoText: '거리에섯',
        curRegion: {},
        curRegionEn: '',
        curRegionKr: '',
        isUser: false,
        profile: null, // 🚀 여기에 상세 프로필 데이터가 저장됩니다.
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

    const getConfig = useCallback((path, defaultValue = null) => {
        if (!path) return siteConfig;
        const result = path.split('.').reduce((acc, key) => acc?.[key], siteConfig);
        return result ?? defaultValue;
    }, [siteConfig]);

    const makeConfig = useCallback((path, value) => {
        setSiteConfig(prev => {
            const keys = path.split('.');
            let currentRaw = prev;
            for (let i = 0; i < keys.length; i++) {
                currentRaw = currentRaw?.[keys[i]];
            }

            if (currentRaw === value) return prev;

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

    // 🚀 상세 정보를 가져와 'profile' 경로에 저장
    const fetchFullProfile = useCallback(async () => {
        try {
            const response = await api.get('/member/me');
            // console.log(response.data.data)
            const data = mapDataToState('profile', response.data.data);
            
            makeConfig('profile', data);
        } catch (error) {
            console.error("상세 프로필 로드 실패:", error);
            makeConfig('profile', null);
        }
    }, [makeConfig]);

    useEffect(() => {
        // --- 지역 관련 ---
        makeConfig('Url.region', region ?? '');
        makeConfig('Url.type', type ?? '');

        const regionEn = region ? toRegionTxt(region, 'en') : '';
        if (hasRegion(region)) {
            makeConfig('curRegionEn', regionEn);
            makeConfig('curRegionKr', toRegionTxt(region, 'ko'));
            makeConfig('curRegion', toRegion(region));
            localStorage.setItem('lastVisitedRegion', regionEn);
        } else if (!siteConfig.curRegionEn) {
            const savedRegion = localStorage.getItem('lastVisitedRegion');
            if (savedRegion && hasRegion(savedRegion)) {
                makeConfig('curRegionEn', toRegionTxt(savedRegion, 'en'));
                makeConfig('curRegionKr', toRegionTxt(savedRegion, 'ko'));
                makeConfig('curRegion', toRegion(savedRegion));
            }
        }
        // --- 사용자 인증 및 profile 동기화 ---
        if (user) {
            // profile 정보가 없거나 로그인이 바뀐 경우에만 호출
            if (!siteConfig.profile || siteConfig.profile.id !== user.mbrId) {
                fetchFullProfile();
            }
            
            if (!siteConfig.isUser) makeConfig('isUser', true);
        } else {
            if (siteConfig.profile !== null) makeConfig('profile', null);
            if (siteConfig.isUser) makeConfig('isUser', false);
        }

    }, [user, region, type, fetchFullProfile, siteConfig.profile, siteConfig.isUser, siteConfig.curRegionEn, makeConfig]);

    const value = useMemo(() => ({ 
        siteConfig, 
        makeConfig, 
        getConfig 
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