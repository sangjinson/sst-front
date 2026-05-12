import React, { useEffect, useRef } from 'react';

const KAKAO_APP_KEY = '44ca77103cfef539e22b73750e2dc760';

/**
 * AreaMap - 카카오 지도 섹션
 *
 * props:
 * - lat     : 위도 (선택)
 * - lng     : 경도 (선택)
 * - address : 주소 (lat/lng 없을 때 주소로 검색)
 */
const AreaMap = ({ lat, lng, address }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const loadMap = () => {
      if (!window.kakao || !window.kakao.maps) return;
      window.kakao.maps.load(() => {
        const container = mapRef.current;
        if (!container) return;

        if (lat && lng) {
          // 좌표로 지도 표시
          const coords = new window.kakao.maps.LatLng(lat, lng);
          const map = new window.kakao.maps.Map(container, {
            center: coords,
            level: 4,
          });
          new window.kakao.maps.Marker({ map, position: coords });
        } else if (address) {
          // 주소로 좌표 변환 후 지도 표시
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

    // 이미 로드된 경우
    if (window.kakao && window.kakao.maps) {
      loadMap();
      return;
    }

    // 스크립트 동적 로드
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&libraries=services&autoload=false`;
    script.async = true;
    script.onload = loadMap;
    document.head.appendChild(script);

    return () => {
      // 클린업: 같은 스크립트 중복 방지
    };
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