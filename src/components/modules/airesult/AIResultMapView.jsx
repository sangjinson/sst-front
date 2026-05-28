import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TYPE_LABEL, TYPE_COLOR, CAT_LABEL_MAP, CAT_COLOR_MAP, CAT_KOR_COLOR_MAP, getDetailPath } from './aiResultUtils';
import { WishlistHeartButton } from '@components/modules/ActionButtons';

const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_MAP_KEY;

const DAY_COLORS = ['#0F9B73', '#E8956D', '#5B8DEF', '#F5A623', '#9B59B6'];

const CAT_TYPE_MAP = {
  '볼거리': 'see',
  '놀거리': 'play',
  '먹거리': 'food',
  '잘거리': 'sleep',
};

const AIResultMapView = ({ selectedRegion, schedule, activeDay, selectedItem, onSelectItem }) => {
  const navigate     = useNavigate();
  const mapRef       = useRef(null);
  const mapObj       = useRef(null);
  const overlaysRef  = useRef([]);
  const polylinesRef = useRef([]);
  const [mapReady, setMapReady] = useState(false);

  const currentDayItems = schedule[activeDay]?.plans || [];

  const clearMap = () => {
    overlaysRef.current.forEach(o => o.setMap && o.setMap(null));
    overlaysRef.current = [];
    polylinesRef.current.forEach(p => p.setMap && p.setMap(null));
    polylinesRef.current = [];
  };

  const drawRoute = (map, items, dayIdx = 0, onSelect) => {
    const color      = DAY_COLORS[dayIdx % DAY_COLORS.length];
    const validItems = items.filter(i => i.lat && i.lng);
    const bounds     = new window.kakao.maps.LatLngBounds();
    const linePath   = [];

    validItems.forEach((item) => {
      const pos = new window.kakao.maps.LatLng(parseFloat(item.lat), parseFloat(item.lng));
      linePath.push(pos);
      bounds.extend(pos);
    });

    clearMap();

    validItems.forEach((item, idx) => {
      const pos     = linePath[idx];
      const content = `
        <div style="
          width:28px; height:28px; border-radius:50%;
          background:${color}; color:white;
          font-size:13px; font-weight:bold;
          display:flex; align-items:center; justify-content:center;
          border:2px solid white;
          box-shadow:0 2px 6px rgba(0,0,0,0.3);
          cursor:pointer;
        " id="overlay-${item.placeId}">${idx + 1}</div>
      `;
      const overlay = new window.kakao.maps.CustomOverlay({ map, position: pos, content, yAnchor: 1 });
      overlaysRef.current.push(overlay);

      setTimeout(() => {
        const el = document.getElementById(`overlay-${item.placeId}`);
        if (el) el.addEventListener('click', () => onSelect(item));
      }, 100);
    });

    if (linePath.length > 1) {
      const polyline = new window.kakao.maps.Polyline({
        map,
        path         : linePath,
        strokeWeight : 4,
        strokeColor  : color,
        strokeOpacity: 0.9,
        strokeStyle  : 'solid',
      });
      polylinesRef.current.push(polyline);
    }

    if (validItems.length > 0) map.setBounds(bounds);
  };

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current) return;
      window.kakao.maps.load(() => {
        if (!mapRef.current) return;
        try {
          const map = new window.kakao.maps.Map(mapRef.current, {
            center: new window.kakao.maps.LatLng(37.5665, 126.9780),
            level : 8,
          });
          mapObj.current = map;
          map.relayout();
          setMapReady(true);
        } catch (e) {
          console.warn('카카오맵 초기화 실패:', e);
        }
      });
    };

    if (window.kakao?.maps) { initMap(); return; }

    const existing = document.querySelector(`script[src*="dapi.kakao.com"]`);
    if (existing) {
      existing.addEventListener('load', initMap);
      return () => existing.removeEventListener('load', initMap);
    }

    const script    = document.createElement('script');
    script.src      = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&libraries=services,drawing&autoload=false`;
    script.async    = true;
    script.onload   = initMap;
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!mapReady || !mapObj.current || !currentDayItems.length) return;
    if (window.kakao?.maps) {
      window.kakao.maps.load(() => {
        drawRoute(mapObj.current, currentDayItems, activeDay, onSelectItem);
      });
    }
  }, [mapReady, activeDay, schedule]);

  const handlePrev = () => {
    const idx = currentDayItems.findIndex(i => i.placeId === selectedItem?.placeId);
    if (idx > 0) onSelectItem(currentDayItems[idx - 1]);
  };

  const handleNext = () => {
    const idx = currentDayItems.findIndex(i => i.placeId === selectedItem?.placeId);
    if (idx < currentDayItems.length - 1) onSelectItem(currentDayItems[idx + 1]);
  };

  const handleGoDetail = () => {
    if (!selectedItem) return;
    window.open(getDetailPath(selectedItem, selectedRegion), '_blank');
  };

  const currentIdx = currentDayItems.findIndex(i => i.placeId === selectedItem?.placeId);

  return (
    <div className="print-map flex-1 flex flex-col min-w-0 order-first md:order-none">

      <div className="w-full relative h-[240px] md:h-[500px]">
        <div
          ref={mapRef}
          id="ai-result-map"
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {selectedItem ? (
        <div className="print-hide hidden md:flex border-t border-gray-100 bg-white px-4 py-4 items-center gap-4 h-[140px]">
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="text-gray-400 hover:text-gray-600 text-4xl shrink-0 disabled:opacity-30 transition"
          >
            ‹
          </button>

          <div
            onClick={handleGoDetail}
            className="w-28 h-28 rounded-xl overflow-hidden shrink-0 cursor-pointer hover:opacity-80 transition"
          >
            {selectedItem.imgUrl ? (
              <img src={selectedItem.imgUrl} alt={selectedItem.placeName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>

          <div onClick={handleGoDetail} className="flex-1 min-w-0 cursor-pointer">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                CAT_KOR_COLOR_MAP[selectedItem.category] ?? CAT_COLOR_MAP[selectedItem.category] ?? TYPE_COLOR[selectedItem.type] ?? 'bg-gray-100 text-gray-600'
              }`}>
                {selectedItem.category ?? CAT_LABEL_MAP[selectedItem.category] ?? TYPE_LABEL[selectedItem.type]}
              </span>
            </div>
            <p className="text-lg font-bold text-gray-900 truncate hover:text-[#0F9B73] transition">
              {selectedItem.placeName}
            </p>
            <p className="text-sm text-gray-500 mt-0.5 truncate">
              {selectedItem.addr}
            </p>
            <p className="text-sm text-gray-400 mt-1.5 line-clamp-2">
              {selectedItem.overview}
            </p>
          </div>

          <div onClick={(e) => e.stopPropagation()} className="shrink-0">
            <WishlistHeartButton
              item={{
                id      : selectedItem.placeId,
                name    : selectedItem.placeName,
                image   : selectedItem.imgUrl,
                category: selectedItem.category,
                address : '',
              }}
              itemType={CAT_TYPE_MAP[selectedItem.category] ?? 'see'}
              region={selectedRegion}
            />
          </div>

          <button
            onClick={handleNext}
            disabled={currentIdx === currentDayItems.length - 1}
            className="text-gray-400 hover:text-gray-600 text-4xl shrink-0 disabled:opacity-30 transition"
          >
            ›
          </button>
        </div>
      ) : (
        <div className="print-hide hidden md:flex border-t border-gray-100 bg-white px-4 py-4 items-center gap-4 h-[140px]">
          왼쪽 일정 목록에서 장소를 클릭하면 상세 정보를 볼 수 있어요
        </div>
      )}
    </div>
  );
};

export default AIResultMapView;