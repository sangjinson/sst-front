import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TYPE_LABEL, TYPE_COLOR, CAT_LABEL_MAP, CAT_COLOR_MAP, getDetailPath } from './aiResultUtils';

const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_MAP_KEY;

const DAY_COLORS = [
  '#0F9B73',
  '#E8956D',
  '#5B8DEF',
  '#F5A623',
  '#9B59B6',
];

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

  const drawRoute = (map, items, dayIdx = 0) => {
    const color      = DAY_COLORS[dayIdx % DAY_COLORS.length];
    const validItems = items.filter(i => i.lat && i.lng);

    const bounds   = new window.kakao.maps.LatLngBounds();
    const linePath = [];

    validItems.forEach((item) => {
      const pos = new window.kakao.maps.LatLng(
        parseFloat(item.lat),
        parseFloat(item.lng)
      );
      linePath.push(pos);
      bounds.extend(pos);
    });

    clearMap();

    validItems.forEach((item, idx) => {
      const pos = linePath[idx];
      const content = `
        <div style="
          width:28px; height:28px; border-radius:50%;
          background:${color}; color:white;
          font-size:13px; font-weight:bold;
          display:flex; align-items:center; justify-content:center;
          border:2px solid white;
          box-shadow:0 2px 6px rgba(0,0,0,0.3);
        ">${idx + 1}</div>
      `;
      const overlay = new window.kakao.maps.CustomOverlay({
        map,
        position: pos,
        content,
        yAnchor: 1,
      });
      overlaysRef.current.push(overlay);
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

  // 지도 초기화
  useEffect(() => {
    const initMap = () => {
      if (!window.kakao?.maps || !mapRef.current) return;
      window.kakao.maps.load(() => {
        const map = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780),
          level : 8,
        });
        mapObj.current = map;
        window.__testMap = map;
        map.relayout();
        setMapReady(true);
      });
    };

    if (window.kakao?.maps) { initMap(); return; }

    const existing = document.querySelector(`script[src*="dapi.kakao.com"]`);
    if (existing) { existing.addEventListener('load', initMap); return; }

    const script = document.createElement('script');
    script.src   = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&libraries=services,drawing&autoload=false`;
    script.async = true;
    script.onload = initMap;
    document.head.appendChild(script);
  }, []);

  // 지도 그리기
  useEffect(() => {
    if (!mapReady || !mapObj.current) return;
    if (!currentDayItems.length) return;
    if (window.kakao?.maps) {
      window.kakao.maps.load(() => {
        drawRoute(mapObj.current, currentDayItems, activeDay);
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
    navigate(getDetailPath(selectedItem, selectedRegion));
  };

  const currentIdx = currentDayItems.findIndex(i => i.placeId === selectedItem?.placeId);

  return (
    <div className="flex-1 flex flex-col min-w-0">

      <div style={{ width: '100%', height: '500px', position: 'relative' }}>
        <div
          ref={mapRef}
          id="ai-result-map"
          style={{
            width   : '100%',
            height  : '100%',
            position: 'absolute',
            top     : 0,
            left    : 0,
          }}
        />
      </div>

      {selectedItem ? (
        <div className="border-t border-gray-100 bg-white px-3 py-3 flex items-center gap-3">

          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="text-gray-400 hover:text-gray-600 text-2xl shrink-0 disabled:opacity-30 transition"
          >
            ‹
          </button>

          <div
            onClick={handleGoDetail}
            className="w-16 h-16 rounded-xl overflow-hidden shrink-0 cursor-pointer hover:opacity-80 transition"
          >
            {selectedItem.imgUrl ? (
              <img src={selectedItem.imgUrl} alt={selectedItem.placeName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>

          <div onClick={handleGoDetail} className="flex-1 min-w-0 cursor-pointer">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                CAT_COLOR_MAP[selectedItem.category] ?? TYPE_COLOR[selectedItem.type] ?? 'bg-gray-100 text-gray-600'
              }`}>
                {CAT_LABEL_MAP[selectedItem.category] ?? TYPE_LABEL[selectedItem.type] ?? selectedItem.category}
              </span>
            </div>
            <p className="text-sm font-bold text-gray-900 truncate hover:text-[#0F9B73] transition">
              {selectedItem.placeName}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 truncate">
              {selectedItem.overview}
            </p>
          </div>

          <button className="text-red-400 hover:text-red-500 transition text-xl shrink-0">
            ♥
          </button>

          <button
            onClick={handleNext}
            disabled={currentIdx === currentDayItems.length - 1}
            className="text-gray-400 hover:text-gray-600 text-2xl shrink-0 disabled:opacity-30 transition"
          >
            ›
          </button>
        </div>
      ) : (
        <div className="border-t border-gray-100 bg-white px-4 py-4 text-center text-sm text-gray-400">
          왼쪽 일정 목록에서 장소를 클릭하면 상세 정보를 볼 수 있어요
        </div>
      )}

    </div>
  );
};

export default AIResultMapView;