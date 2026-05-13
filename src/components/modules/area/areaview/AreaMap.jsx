import React, { useEffect, useRef } from 'react';

const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_MAP_KEY;

const AreaMap = ({ lat, lng, address }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const loadMap = () => {
      if (!window.kakao || !window.kakao.maps) return;
      window.kakao.maps.load(() => {
        const container = mapRef.current;
        if (!container) return;

        if (lat && lng) {
          const coords = new window.kakao.maps.LatLng(lat, lng);
          const map = new window.kakao.maps.Map(container, {
            center: coords,
            level: 4,
          });
          new window.kakao.maps.Marker({ map, position: coords });
        } else if (address) {
          const geocoder = new window.kakao.maps.services.Geocoder();
          const defaultCoords = new window.kakao.maps.LatLng(37.2636, 127.0286);
          const map = new window.kakao.maps.Map(container, {
            center: defaultCoords,
            level: 4,
          });
          geocoder.addressSearch(address, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
              map.setCenter(coords);
              new window.kakao.maps.Marker({ map, position: coords });
            }
          });
        }
      });
    };

    if (window.kakao && window.kakao.maps) {
      loadMap();
      return;
    }

    const existing = document.querySelector('script[src*="dapi.kakao.com"]');
    if (existing) {
      existing.addEventListener('load', loadMap);
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&libraries=services,drawing&autoload=false`;
    script.async = true;
    script.onload = loadMap;
    document.head.appendChild(script);
  }, [lat, lng, address]);

  return (
    <div className="bg-white rounded-lg p-5 mb-4 shadow-sm">
      <h2 className="fs-up-3 font-bold text-gray-900 mb-3">위치</h2>
      <hr className="w-full border-b border-t-0 border-gray-200 mt-3 mb-5" />
      <div
        ref={mapRef}
        className="w-full h-96 rounded-lg overflow-hidden bg-gray-100"
      />
    </div>
  );
};

export default AreaMap;