import { useContext, useCallback, useMemo } from 'react';
import { ConfigContext } from '@context/ConfigContext';

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) throw new Error("useConfig error");

    const { siteConfig, makeConfig } = context;

    /**
     * @param {string} path - 데이터 경로 (예: 'user.name')
     * @param {any} defaultValue - 값이 없을 때 반환할 기본값 (기본: null)
     */
    const getConfig = useCallback((path, defaultValue = null) => {
        if (!path) return siteConfig;
        
        // reduce를 통해 경로 끝까지 탐색
        const result = path.split('.').reduce((acc, key) => acc?.[key], siteConfig);
        
        // 결과가 undefined이거나 null이면 전달받은 defaultValue(기본 null)를 반환
        return result ?? defaultValue;
    }, [siteConfig]);

    const setConfig = useCallback((path, value) => {
        makeConfig(path, value);
    }, [makeConfig]);

    const saveConfig = setConfig;

    return useMemo(() => ({ 
        getConfig, 
        setConfig, 
        saveConfig,
        updateConfig: saveConfig 
    }), [getConfig, setConfig, saveConfig]);
};